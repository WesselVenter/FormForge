'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, Layout } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Template {
  id: string
  title: string
  description: string
  category: string
  thumbnail: string | null
  schema: any
  settings: any
}

interface TemplatesGridProps {
  templates: Template[]
}

export default function TemplatesGrid({ templates }: TemplatesGridProps) {
  const [isCreating, setIsCreating] = useState<string | null>(null)
  const router = useRouter()

  const categories = Array.from(new Set(templates.map(t => t.category)))

  const handleUseTemplate = async (template: Template) => {
    setIsCreating(template.id)

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: template.title,
          description: template.description,
          schema: template.schema,
          settings: template.settings
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Form created from template!')
        router.push(`/dashboard/forms/${data.form.id}/edit`)
      } else {
        toast.error(data.error || 'Failed to create form')
      }
    } catch (error) {
      console.error('Create from template error:', error)
      toast.error('An error occurred while creating the form')
    } finally {
      setIsCreating(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-display text-neutral-800 mb-2">Form Templates</h1>
        <p className="text-body text-neutral-600">
          Choose from our pre-built templates to get started quickly
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-primary-600 text-white rounded-medium text-small font-medium">
          All Templates
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-medium text-small font-medium hover:bg-neutral-200 transition-colors duration-150"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
            {/* Template Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-800 mb-2">
                  {template.title}
                </h3>
                <p className="text-small text-neutral-600 mb-3">
                  {template.description}
                </p>
                <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-small font-medium rounded-small">
                  {template.category}
                </span>
              </div>
              <div className="ml-4">
                <div className="w-12 h-12 bg-primary-100 rounded-medium flex items-center justify-center">
                  <Layout className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>

            {/* Template Preview */}
            <div className="bg-neutral-50 rounded-medium p-4 mb-6">
              <div className="space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  {template.schema.fields.slice(0, 3).map((field: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                    </div>
                  ))}
                  {template.schema.fields.length > 3 && (
                    <div className="text-small text-neutral-500">
                      +{template.schema.fields.length - 3} more fields
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Template Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleUseTemplate(template)}
                disabled={isCreating === template.id}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {isCreating === template.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Use Template</span>
                  </>
                )}
              </button>
              
              <Link
                href={`/dashboard/templates/${template.id}/preview`}
                className="btn-ghost text-small"
              >
                Preview
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
            <FileText className="w-12 h-12 text-neutral-400" />
          </div>
          <h3 className="text-heading-3 text-neutral-800 mb-2">No templates available</h3>
          <p className="text-body text-neutral-600 mb-6">
            Check back later for new templates
          </p>
          <Link href="/dashboard/forms/new" className="btn-primary">
            Create Custom Form
          </Link>
        </div>
      )}
    </div>
  )
}