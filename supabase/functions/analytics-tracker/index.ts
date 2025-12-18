// Real-time Analytics Tracker Edge Function
// Tracks form interactions and generates real-time insights

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { 
      formId, 
      action, 
      fieldId, 
      timeSpent, 
      deviceInfo, 
      userAgent, 
      ipAddress,
      sessionId 
    } = await req.json();

    // Validate required fields
    if (!formId || !action) {
      throw new Error('Form ID and action are required');
    }

    // Track different types of analytics events
    const analyticsEvent = {
      formId,
      action, // 'view', 'field_focus', 'field_blur', 'submit', 'abandon'
      fieldId: fieldId || null,
      timeSpent: timeSpent || 0,
      deviceInfo: deviceInfo || {},
      userAgent: userAgent || '',
      ipAddress: ipAddress || '',
      sessionId: sessionId || '',
      timestamp: new Date().toISOString(),
      metadata: {
        referrer: null, // Could extract from headers
        utm_source: null, // Could extract from URL params
        utm_campaign: null
      }
    };

    // Generate insights based on the event
    const insights = {
      formId,
      eventCount: 1, // In real implementation, aggregate multiple events
      conversionMetrics: {
        startedForms: action === 'view' ? 1 : 0,
        completedSubmissions: action === 'submit' ? 1 : 0,
        abandonedForms: action === 'abandon' ? 1 : 0
      },
      fieldInsights: fieldId ? [{
        fieldId,
        focusTime: action === 'field_focus' ? timeSpent : 0,
        blurCount: action === 'field_blur' ? 1 : 0
      }] : [],
      deviceInsights: deviceInfo ? [{
        deviceType: deviceInfo.deviceType || 'unknown',
        screenResolution: deviceInfo.screenResolution || 'unknown',
        userAgent: userAgent || ''
      }] : []
    };

    return new Response(JSON.stringify({ 
      data: {
        event: analyticsEvent,
        insights,
        message: 'Analytics event tracked successfully'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorResponse = {
      error: {
        code: 'ANALYTICS_TRACKING_ERROR',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});