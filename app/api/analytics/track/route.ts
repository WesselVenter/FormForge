import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      formId,
      action,
      fieldId,
      timeSpent,
      deviceInfo,
      userAgent,
      ipAddress,
      sessionId,
    } = await request.json();

    if (!formId || !action) {
      return NextResponse.json(
        { error: 'Form ID and action are required' },
        { status: 400 }
      );
    }

    // Insert analytics event
    const { error: analyticsError } = await supabase
      .from('form_analytics')
      .insert({
        form_id: formId,
        event_type: action,
        field_id: fieldId,
        user_agent: userAgent,
        ip_address: ipAddress,
        device_info: deviceInfo,
        time_spent: timeSpent || 0,
        session_id: sessionId,
      });

    if (analyticsError) {
      console.error('Analytics insert error:', analyticsError);
    }

    if (!sessionId) {
      return NextResponse.json({
        message: 'Analytics tracked (no session)',
      });
    }

    // --- Prepare session upsert payload ---
    const sessionPayload: any = {
      form_id: formId,
      session_id: sessionId,
      device_info: deviceInfo ?? null,
      user_agent: userAgent ?? null,
      ip_address: ipAddress ?? null,
    };

    if (action === 'view') {
      sessionPayload.fields_interacted = [];
      sessionPayload.total_time_spent = 0;
      sessionPayload.is_completed = false;
    } else if (action === 'field_focus' && fieldId) {
      // For field_focus, increment total_time_spent and add fieldId to array
      sessionPayload.total_time_spent = timeSpent || 0;
      sessionPayload.fields_interacted = [fieldId];
    } else if (action === 'submit') {
      sessionPayload.total_time_spent = timeSpent || 0;
      sessionPayload.is_completed = true;
      sessionPayload.ended_at = new Date().toISOString();
    }

    // --- Upsert session atomically ---
    const { error: sessionUpsertError } = await supabase
      .from('form_sessions')
      .upsert(sessionPayload, {
        onConflict: ['session_id', 'form_id'],
        merge: true, // merge new fields into existing row
      });

    if (sessionUpsertError) {
      console.error('Session upsert error:', sessionUpsertError);
    }

    return NextResponse.json({
      message: 'Analytics tracked successfully',
      data: { formId, action, fieldId, sessionId },
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
