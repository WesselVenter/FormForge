'use client'

import { useState, useEffect } from 'react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Smartphone, 
  Monitor, 
  Tablet,
  MapPin,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalSubmissions: number
    totalViews: number
    conversionRate: number
    averageCompletionTime: number
    bounceRate: number
  }
  submissionsByDate: Array<{
    date: string
    submissions: number
    views: number
  }>
  fieldAnalytics: Array<{
    fieldId: string
    fieldLabel: string
    completionRate: number
    averageTime: number
    dropOffRate: number
  }>
  deviceAnalytics: {
    desktop: number
    mobile: number
    tablet: number
  }
  trafficSources: {
    direct: number
    google: number
    social: number
    email: number
    referral: number
  }
  geographicData: Array<{
    country: string
    percentage: number
    submissions: number
  }>
}

interface AdvancedAnalyticsProps {
  formId: string
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export default function AdvancedAnalytics({ formId }: AdvancedAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchAnalytics()
  }, [formId, timeRange, refreshKey])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics/${formId}?range=${timeRange}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalytics(data.analytics)
      } else {
        // Use mock data for demo
        setAnalytics({
          overview: {
            totalSubmissions: 1250,
            totalViews: 5430,
            conversionRate: 23.0,
            averageCompletionTime: 145,
            bounceRate: 12.5
          },
          submissionsByDate: [
            { date: '2024-12-10', submissions: 45, views: 180 },
            { date: '2024-12-11', submissions: 52, views: 210 },
            { date: '2024-12-12', submissions: 38, views: 195 },
            { date: '2024-12-13', submissions: 61, views: 240 },
            { date: '2024-12-14', submissions: 58, views: 225 },
            { date: '2024-12-15', submissions: 67, views: 280 },
            { date: '2024-12-16', submissions: 73, views: 310 }
          ],
          fieldAnalytics: [
            {
              fieldId: 'name',
              fieldLabel: 'Full Name',
              completionRate: 95.2,
              averageTime: 8.5,
              dropOffRate: 4.8
            },
            {
              fieldId: 'email',
              fieldLabel: 'Email Address',
              completionRate: 92.1,
              averageTime: 6.2,
              dropOffRate: 7.9
            },
            {
              fieldId: 'message',
              fieldLabel: 'Message',
              completionRate: 78.5,
              averageTime: 42.3,
              dropOffRate: 21.5
            }
          ],
          deviceAnalytics: {
            desktop: 65.2,
            mobile: 28.1,
            tablet: 6.7
          },
          trafficSources: {
            direct: 42.5,
            google: 28.3,
            social: 15.2,
            email: 9.8,
            referral: 4.2
          },
          geographicData: [
            { country: 'United States', percentage: 45.2, submissions: 565 },
            { country: 'United Kingdom', percentage: 18.7, submissions: 234 },
            { country: 'Canada', percentage: 12.3, submissions: 154 },
            { country: 'Australia', percentage: 8.9, submissions: 111 },
            { country: 'Germany', percentage: 7.2, submissions: 90 },
            { country: 'Other', percentage: 7.7, submissions: 96 }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const exportData = () => {
    if (!analytics) return
    
    const csvData = [
      ['Date', 'Submissions', 'Views'],
      ...analytics.submissionsByDate.map(item => [
        item.date,
        item.submissions.toString(),
        item.views.toString()
      ])
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form-analytics-${formId}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">No analytics data available</p>
      </div>
    )
  }

  const deviceData = [
    { name: 'Desktop', value: analytics.deviceAnalytics.desktop, icon: Monitor },
    { name: 'Mobile', value: analytics.deviceAnalytics.mobile, icon: Smartphone },
    { name: 'Tablet', value: analytics.deviceAnalytics.tablet, icon: Tablet }
  ]

  const trafficData = Object.entries(analytics.trafficSources).map(([source, percentage]) => ({
    name: source.charAt(0).toUpperCase() + source.slice(1),
    value: percentage
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-heading-2 text-neutral-800">Advanced Analytics</h2>
          <p className="text-body text-neutral-600">Real-time insights and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field text-small"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button
            onClick={handleRefresh}
            className="btn-ghost flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={exportData}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-small text-neutral-600 mb-1">Total Submissions</p>
              <p className="text-2xl font-bold text-neutral-800">{analytics.overview.totalSubmissions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-large">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-small text-neutral-600 mb-1">Total Views</p>
              <p className="text-2xl font-bold text-neutral-800">{analytics.overview.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-large">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-small text-neutral-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-neutral-800">{analytics.overview.conversionRate}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-large">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-small text-neutral-600 mb-1">Avg. Completion</p>
              <p className="text-2xl font-bold text-neutral-800">{Math.floor(analytics.overview.averageCompletionTime / 60)}m {analytics.overview.averageCompletionTime % 60}s</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-large">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-small text-neutral-600 mb-1">Bounce Rate</p>
              <p className="text-2xl font-bold text-neutral-800">{analytics.overview.bounceRate}%</p>
            </div>
            <div className="p-3 bg-red-50 rounded-large">
              <TrendingUp className="w-6 h-6 text-red-600 rotate-180" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submissions Over Time */}
        <div className="card p-6">
          <h3 className="text-heading-3 text-neutral-800 mb-6">Submissions Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.submissionsByDate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [value, name === 'submissions' ? 'Submissions' : 'Views']}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="submissions" 
                stackId="1" 
                stroke="#4F46E5" 
                fill="#4F46E5" 
                fillOpacity={0.3}
                name="Submissions"
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stackId="2" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Views"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device Analytics */}
        <div className="card p-6">
          <h3 className="text-heading-3 text-neutral-800 mb-6">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {deviceData.map((device, index) => {
              const Icon = device.icon
              return (
                <div key={device.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <Icon className="w-4 h-4 text-neutral-600" />
                  <span className="text-small text-neutral-600">{device.name}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Field Performance */}
        <div className="card p-6">
          <h3 className="text-heading-3 text-neutral-800 mb-6">Field Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.fieldAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="fieldLabel" 
                stroke="#64748b" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completionRate" fill="#4F46E5" name="Completion Rate %" />
              <Bar dataKey="dropOffRate" fill="#EF4444" name="Drop-off Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="card p-6">
          <h3 className="text-heading-3 text-neutral-800 mb-6">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={trafficData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${value}%`}
              >
                {trafficData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {trafficData.map((source, index) => (
              <div key={source.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-small text-neutral-600">{source.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Data */}
      <div className="card p-6">
        <h3 className="text-heading-3 text-neutral-800 mb-6">Geographic Distribution</h3>
        <div className="space-y-4">
          {analytics.geographicData.map((country, index) => (
            <div key={country.country} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span className="text-body text-neutral-800">{country.country}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${country.percentage}%` }}
                  ></div>
                </div>
                <span className="text-small text-neutral-600 w-16 text-right">
                  {country.percentage}%
                </span>
                <span className="text-small text-neutral-500 w-12 text-right">
                  {country.submissions}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Analytics Table */}
      <div className="card p-6">
        <h3 className="text-heading-3 text-neutral-800 mb-6">Detailed Field Analytics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-small font-medium text-neutral-700">Field</th>
                <th className="text-left py-3 px-4 text-small font-medium text-neutral-700">Completion Rate</th>
                <th className="text-left py-3 px-4 text-small font-medium text-neutral-700">Avg. Time</th>
                <th className="text-left py-3 px-4 text-small font-medium text-neutral-700">Drop-off Rate</th>
              </tr>
            </thead>
            <tbody>
              {analytics.fieldAnalytics.map((field) => (
                <tr key={field.fieldId} className="border-b border-neutral-100">
                  <td className="py-3 px-4 text-body text-neutral-800">{field.fieldLabel}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${field.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-small text-neutral-600">{field.completionRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-small text-neutral-600">{field.averageTime}s</td>
                  <td className="py-3 px-4">
                    <span className="text-small text-red-600">{field.dropOffRate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}