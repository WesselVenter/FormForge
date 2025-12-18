import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase-client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('range') || '7d'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      default:
        startDate.setDate(endDate.getDate() - 7)
    }

    // Fetch analytics data from Supabase
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .eq('form_id', params.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (submissionsError) {
      throw submissionsError
    }

    const { data: analytics, error: analyticsError } = await supabase
      .from('form_analytics')
      .select('*')
      .eq('form_id', params.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (analyticsError) {
      throw analyticsError
    }

    const { data: sessions, error: sessionsError } = await supabase
      .from('form_sessions')
      .select('*')
      .eq('form_id', params.id)
      .gte('started_at', startDate.toISOString())
      .lte('started_at', endDate.toISOString())

    if (sessionsError) {
      throw sessionsError
    }

    // Process the data into analytics format
    const analyticsData = processAnalyticsData(submissions || [], analytics || [], sessions || [])

    return NextResponse.json({ analytics: analyticsData })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function processAnalyticsData(submissions: any[], analytics: any[], sessions: any[]) {
  const totalSubmissions = submissions.length
  const totalViews = analytics.filter(a => a.event_type === 'view').length
  const conversionRate = totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0
  const averageCompletionTime = submissions.reduce((sum, s) => sum + (s.completion_time || 0), 0) / submissions.length || 0
  
  // Calculate bounce rate (sessions that ended without submission)
  const completedSessions = sessions.filter(s => s.is_completed).length
  const bounceRate = sessions.length > 0 ? ((sessions.length - completedSessions) / sessions.length) * 100 : 0

  // Group submissions by date
  interface DateGroup {
    date: string
    submissions: number
    views: number
  }
  
  const submissionsByDate = submissions.reduce((acc: DateGroup[], submission) => {
    const date = new Date(submission.created_at).toISOString().split('T')[0]
    const existing = acc.find((item: DateGroup) => item.date === date)
    if (existing) {
      existing.submissions += 1
    } else {
      acc.push({ date, submissions: 1, views: 0 })
    }
    return acc
  }, [])

  // Add view data to date groups
  analytics
    .filter(a => a.event_type === 'view')
    .forEach(view => {
      const date = new Date(view.created_at).toISOString().split('T')[0]
      const existing = submissionsByDate.find((item: DateGroup) => item.date === date)
      if (existing) {
        existing.views += 1
      } else {
        submissionsByDate.push({ date, submissions: 0, views: 1 })
      }
    })

  // Sort by date
  submissionsByDate.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate field analytics
  const fieldAnalytics = calculateFieldAnalytics(analytics)

  // Device analytics
  const deviceAnalytics = calculateDeviceAnalytics(sessions)

  // Traffic sources (mock data for now)
  const trafficSources = {
    direct: 42.5,
    google: 28.3,
    social: 15.2,
    email: 9.8,
    referral: 4.2
  }

  // Geographic data (mock data for now)
  const geographicData = [
    { country: 'United States', percentage: 45.2, submissions: Math.floor(totalSubmissions * 0.452) },
    { country: 'United Kingdom', percentage: 18.7, submissions: Math.floor(totalSubmissions * 0.187) },
    { country: 'Canada', percentage: 12.3, submissions: Math.floor(totalSubmissions * 0.123) },
    { country: 'Australia', percentage: 8.9, submissions: Math.floor(totalSubmissions * 0.089) },
    { country: 'Germany', percentage: 7.2, submissions: Math.floor(totalSubmissions * 0.072) },
    { country: 'Other', percentage: 7.7, submissions: totalSubmissions - Math.floor(totalSubmissions * 0.452) - Math.floor(totalSubmissions * 0.187) - Math.floor(totalSubmissions * 0.123) - Math.floor(totalSubmissions * 0.089) - Math.floor(totalSubmissions * 0.072) }
  ]

  return {
    overview: {
      totalSubmissions,
      totalViews,
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageCompletionTime: Math.round(averageCompletionTime),
      bounceRate: Math.round(bounceRate * 10) / 10
    },
    submissionsByDate,
    fieldAnalytics,
    deviceAnalytics,
    trafficSources,
    geographicData
  }
}

function calculateFieldAnalytics(analytics: any[]) {
  const fieldStats: { [key: string]: any } = {}

  analytics.forEach(event => {
    if (!fieldStats[event.field_id]) {
      fieldStats[event.field_id] = {
        fieldId: event.field_id,
        fieldLabel: event.field_id || 'Unknown Field',
        focusCount: 0,
        totalFocusTime: 0,
        blurCount: 0
      }
    }

    if (event.event_type === 'field_focus') {
      fieldStats[event.field_id].focusCount += 1
      fieldStats[event.field_id].totalFocusTime += event.time_spent || 0
    } else if (event.event_type === 'field_blur') {
      fieldStats[event.field_id].blurCount += 1
    }
  })

  return Object.values(fieldStats).map((field: any) => ({
    fieldId: field.fieldId,
    fieldLabel: field.fieldLabel,
    completionRate: field.focusCount > 0 ? Math.round(((field.blurCount / field.focusCount) * 100) * 10) / 10 : 0,
    averageTime: field.focusCount > 0 ? Math.round((field.totalFocusTime / field.focusCount) * 10) / 10 : 0,
    dropOffRate: field.focusCount > 0 ? Math.round(((1 - (field.blurCount / field.focusCount)) * 100) * 10) / 10 : 0
  }))
}

function calculateDeviceAnalytics(sessions: any[]) {
  const deviceStats = { desktop: 0, mobile: 0, tablet: 0 }
  const total = sessions.length

  sessions.forEach(session => {
    const deviceInfo = session.device_info || {}
    const deviceType = deviceInfo.deviceType || 'unknown'
    
    if (deviceType === 'desktop') deviceStats.desktop += 1
    else if (deviceType === 'mobile') deviceStats.mobile += 1
    else if (deviceType === 'tablet') deviceStats.tablet += 1
  })

  return {
    desktop: total > 0 ? Math.round((deviceStats.desktop / total) * 100 * 10) / 10 : 0,
    mobile: total > 0 ? Math.round((deviceStats.mobile / total) * 100 * 10) / 10 : 0,
    tablet: total > 0 ? Math.round((deviceStats.tablet / total) * 100 * 10) / 10 : 0
  }
}