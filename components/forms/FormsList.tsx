'use client'

import Link from 'next/link'
import { Plus, FileText, Eye, Edit, Trash2, Copy, BarChart3 } from 'lucide-react'
import { Form } from '@prisma/client'
import { useState } from 'react'

interface FormsListProps {
  forms: (Form & { _count: { submissions: number } })[]
}

export default function FormsList({ forms }: FormsListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return
    }

    setIsDeleting(formId)

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to delete form')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting the form')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDuplicate = async (formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}/duplicate`, {
        method: 'POST',
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to duplicate form')
      }
    } catch (error) {
      console.error('Duplicate error:', error)
      alert('An error occurred while duplicating the form')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="status-published">Published</span>
      case 'DRAFT':
        return <span className="status-draft">Draft</span>
      case 'ARCHIVED':
        return <span className="status-archived">Archived</span>
      default:
        return <span className="status-draft">{status}</span>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-neutral-800 mb-2">My Forms</h1>
          <p className="text-body text-neutral-600">
            Create and manage your forms
          </p>
        </div>
        <Link href="/dashboard/forms/new" className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Form</span>
        </Link>
      </div>

      {/* Forms Grid */}
      {forms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
              {/* Form Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-800 mb-2 line-clamp-2">
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className="text-small text-neutral-600 line-clamp-2 mb-3">
                      {form.description}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  {getStatusBadge(form.status)}
                </div>
              </div>

              {/* Form Stats */}
              <div className="flex items-center space-x-4 text-small text-neutral-600 mb-6">
                <span className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>{form._count.submissions} submissions</span>
                </span>
                <span>
                  Updated {new Date(form.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/dashboard/forms/${form.id}/edit`}
                    className="btn-ghost text-small flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  
                  {form.status === 'PUBLISHED' && (
                    <Link
                      href={`/forms/${form.id}`}
                      target="_blank"
                      className="btn-ghost text-small flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Link>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <Link
                    href={`/dashboard/forms/${form.id}/analytics`}
                    className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-neutral-50 rounded-small transition-colors duration-150"
                    title="Analytics"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Link>
                  
                  <button
                    onClick={() => handleDuplicate(form.id)}
                    className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-neutral-50 rounded-small transition-colors duration-150"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(form.id)}
                    disabled={isDeleting === form.id}
                    className="p-2 text-neutral-500 hover:text-error hover:bg-red-50 rounded-small transition-colors duration-150 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-neutral-400" />
          </div>
          <h3 className="text-heading-3 text-neutral-800 mb-2">No forms yet</h3>
          <p className="text-body text-neutral-600 mb-6">
            Create your first form to get started collecting responses
          </p>
          <Link href="/dashboard/forms/new" className="btn-primary">
            Create Your First Form
          </Link>
        </div>
      )}
    </div>
  )
}