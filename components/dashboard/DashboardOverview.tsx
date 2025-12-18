'use client'

import Link from 'next/link'
import { FileText, Eye, Send, Edit } from 'lucide-react'
import { Form } from '@prisma/client'

interface Stats {
  totalForms: number
  publishedForms: number
  totalSubmissions: number
  draftForms: number
}

interface DashboardOverviewProps {
  stats: Stats
  forms: (Form & { _count: { submissions: number } })[]
  recentSubmissions: any[]
}

export default function DashboardOverview({ stats, forms, recentSubmissions }: DashboardOverviewProps) {
  const statCards = [
    {
      title: 'Total Forms',
      value: stats.totalForms,
      icon: FileText,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Published',
      value: stats.publishedForms,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Submissions',
      value: stats.totalSubmissions,
      icon: Send,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Drafts',
      value: stats.draftForms,
      icon: Edit,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-display text-neutral-800 mb-2">Dashboard</h1>
        <p className="text-body text-neutral-600">
          Welcome back! Here's what's happening with your forms.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-small text-neutral-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-neutral-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-large ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-3 text-neutral-800">Recent Forms</h2>
            <Link 
              href="/dashboard/forms" 
              className="text-primary-600 hover:text-primary-700 text-small font-medium"
            >
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {forms.slice(0, 5).map((form) => (
              <div key={form.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-medium">
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-800 mb-1">{form.title}</h3>
                  <div className="flex items-center space-x-4 text-small text-neutral-600">
                    <span className={`status-${form.status.toLowerCase()}`}>
                      {form.status}
                    </span>
                    <span>{form._count.submissions} submissions</span>
                    <span>{new Date(form.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link 
                  href={`/dashboard/forms/${form.id}/edit`}
                  className="btn-ghost text-small"
                >
                  Edit
                </Link>
              </div>
            ))}
            
            {forms.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">No forms yet</p>
                <Link href="/dashboard/forms/new" className="btn-primary">
                  Create your first form
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-heading-3 text-neutral-800">Recent Submissions</h2>
            <Link 
              href="/dashboard/analytics" 
              className="text-primary-600 hover:text-primary-700 text-small font-medium"
            >
              View analytics
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-medium">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-800">{submission.form.title}</p>
                    <p className="text-small text-neutral-600">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-small text-neutral-500">
                    #{submission.id.slice(-6)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Send className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600">No submissions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-heading-3 text-neutral-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/dashboard/forms/new" 
            className="flex items-center space-x-3 p-4 bg-primary-50 rounded-medium hover:bg-primary-100 transition-colors duration-150"
          >
            <div className="p-2 bg-primary-600 rounded-medium">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-800">Create New Form</h3>
              <p className="text-small text-neutral-600">Start building from scratch</p>
            </div>
          </Link>
          
          <Link 
            href="/dashboard/templates" 
            className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-medium hover:bg-neutral-100 transition-colors duration-150"
          >
            <div className="p-2 bg-neutral-600 rounded-medium">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-800">Browse Templates</h3>
              <p className="text-small text-neutral-600">Use pre-built form templates</p>
            </div>
          </Link>
          
          <Link 
            href="/dashboard/analytics" 
            className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-medium hover:bg-neutral-100 transition-colors duration-150"
          >
            <div className="p-2 bg-green-600 rounded-medium">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-800">View Analytics</h3>
              <p className="text-small text-neutral-600">Track form performance</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}