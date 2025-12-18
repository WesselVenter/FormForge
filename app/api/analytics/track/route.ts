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

    // Validate required fields
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
      return NextResponse.json(
        { error: 'Failed to track analytics' },
        { status: 500 }
      );
    }

    // Update or create form session
    if (sessionId) {
      // --- VIEW action: create a new session ---
      if (action === 'view') {
        const { error: sessionError } = await supabase
          .from('form_sessions')
          .insert({
            form_id: formId,
            session_id: sessionId,
            device_info: deviceInfo ?? null,
            user_agent: userAgent ?? null,
            ip_address: ipAddress ?? null,
            fields_interacted: [],
            total_time_spent: 0,
            is_completed: false,
          });

        if (sessionError) {
          console.error('Session insert error:', sessionError);
        }
      }

      // --- FIELD_FOCUS action: update session with field interaction ---
      else if (action === 'field_focus' && fieldId) {
        const { data: currentSession, error: fetchError } = await supabase
          .from('form_sessions')
          .select('fields_interacted, total_time_spent')
          .eq('session_id', sessionId)
          .eq('form_id', formId)
          .maybeSingle();

        if (!fetchError && currentSession) {
          const updatedFields = Array.from(
            new Set([...(currentSession.fields_interacted || []), fieldId])
          );

          const { error: updateError } = await supabase
            .from('form_sessions')
            .eq('session_id', sessionId)
            .eq('form_id', formId)
            .update({
              fields_interacted: updatedFields,
              total_time_spent:
                (currentSession.total_time_spent || 0) + (timeSpent || 0),
            });

          if (updateError) {
            console.error('Session update error:', updateError);
          }
        } else if (fetchError) {
          console.error('Session fetch error:', fetchError);
        }
      }

      // --- SUBMIT action: mark session as completed ---
      else if (action === 'submit') {
        const { data: currentSession, error: fetchError } = await supabase
          .from('form_sessions')
          .select('total_time_spent')
          .eq('session_id', sessionId)
          .eq('form_id', formId)
          .maybeSingle();

        const totalTime =
          (currentSession?.total_time_spent || 0) + (timeSpent || 0);

        const { error: completeError } = await supabase
          .from('form_sessions')
          .eq('session_id', sessionId)
          .eq('form_id', formId)
          .update({
            is_completed: true,
            total_time_spent: totalTime,
            ended_at: new Date().toISOString(),
          });

        if (fetchError) {
          console.error('Session fetch error (submit):', fetchError);
        }
        if (completeError) {
          console.error('Session completion error:', completeError);
        }
      }
    }

    return NextResponse.json({
      message: 'Analytics tracked successfully',
      data: {
        formId,
        action,
        fieldId,
        sessionId,
      },
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
