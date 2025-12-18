'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function NewFormPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please enter a form title')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          schema: {
            title: formData.title.trim(),
            description: formData.description.trim(),
            fields: []
          },
          settings: {
            submitText: 'Submit',
            redirectUrl: null,
            thankYouMessage: 'Thank you for your submission!',
            notifications: {
              email: false,
              adminEmail: null
            }
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Form created successfully!')
        router.push(`/dashboard/forms/${data.form.id}/edit`)
      } else {
        toast.error(data.error || 'Failed to create form')
      }
    } catch (error) {
      console.error('Create form error:', error)
      toast.error('An error occurred while creating the form')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-display text-neutral-800 mb-2">Create New Form</h1>
        <p className="text-body text-neutral-600">
          Start building your form by giving it a title and description
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-small font-medium text-neutral-700 mb-1">
                Form Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Enter form title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-small font-medium text-neutral-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                placeholder="Enter form description"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Form'}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}