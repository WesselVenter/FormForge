'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Form } from '@prisma/client'
import { FormSchema } from '@/types'
import { CheckCircle } from 'lucide-react'

interface PublicFormProps {
  form: Form
}

interface FormData {
  [key: string]: any
}

export default function PublicForm({ form }: PublicFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  
  const schema = form.schema as FormSchema

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/forms/' + form.id + '/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          ipAddress: null, // You could get this from headers in a real implementation
          userAgent: navigator.userAgent
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        toast.success('Form submitted successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to submit form')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('An error occurred while submitting the form')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: any) => {
    const fieldName = field.id
    const isRequired = field.required
    
    const commonProps = {
      ...register(fieldName, {
        required: isRequired ? `${field.label} is required` : false,
        ...(field.validation?.minLength && {
          minLength: {
            value: field.validation.minLength,
            message: `${field.label} must be at least ${field.validation.minLength} characters`
          }
        }),
        ...(field.validation?.maxLength && {
          maxLength: {
            value: field.validation.maxLength,
            message: `${field.label} must be no more than ${field.validation.maxLength} characters`
          }
        }),
        ...(field.validation?.pattern && {
          pattern: {
            value: new RegExp(field.validation.pattern),
            message: field.validation.customMessage || `${field.label} format is invalid`
          }
        })
      }),
      className: 'w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      placeholder: field.placeholder,
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <input
            type={field.type}
            {...commonProps}
            required={isRequired}
          />
        )

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
            required={isRequired}
          />
        )

      case 'dropdown':
        return (
          <select {...commonProps} required={isRequired}>
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option: any, index: number) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option: any, index: number) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value={option.value}
                  {...register(fieldName, { required: isRequired ? `${field.label} is required` : false })}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="text-neutral-700">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option: any, index: number) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  {...register(fieldName)}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="text-neutral-700">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            {...commonProps}
            required={isRequired}
          />
        )

      case 'file':
        return (
          <input
            type="file"
            {...register(fieldName, { required: isRequired ? `${field.label} is required` : false })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required={isRequired}
          />
        )

      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                {...register(fieldName, { required: isRequired ? `${field.label} is required` : false })}
                className="text-2xl text-yellow-400 hover:text-yellow-500 focus:outline-none"
                onClick={() => {
                  // Handle star rating
                }}
              >
                ★
              </button>
            ))}
          </div>
        )

      default:
        return (
          <input
            type="text"
            {...commonProps}
            required={isRequired}
          />
        )
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">
            Thank You!
          </h1>
          <p className="text-neutral-600 mb-6">
            {form.settings && typeof form.settings === 'object' && 'thankYouMessage' in form.settings 
              ? (form.settings as any).thankYouMessage 
              : 'Your form has been submitted successfully.'
            }
          </p>
          {form.settings && typeof form.settings === 'object' && 'redirectUrl' in form.settings && (form.settings as any).redirectUrl && (
            <a
              href={(form.settings as any).redirectUrl}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Continue to our website
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 mb-4">
              {schema.title}
            </h1>
            {schema.description && (
              <p className="text-neutral-600">
                {schema.description}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {schema.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {renderField(field)}
                
                {errors[field.id] && (
                  <p className="text-sm text-red-600">
                    {errors[field.id]?.message as string}
                  </p>
                )}
              </div>
            ))}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-150"
              >
                {isSubmitting ? 'Submitting...' : (form.settings && typeof form.settings === 'object' && 'submitText' in form.settings ? (form.settings as any).submitText : 'Submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}