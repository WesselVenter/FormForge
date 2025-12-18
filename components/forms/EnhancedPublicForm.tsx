'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Form } from '@prisma/client'
import { FormSchema } from '@/types'
import { CheckCircle } from 'lucide-react'
import AdvancedFileUpload from './AdvancedFileUpload'

interface PublicFormProps {
  form: Form
}

interface FormData {
  [key: string]: any
}

export default function PublicForm({ form }: PublicFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2)}`)
  const [fieldStartTimes, setFieldStartTimes] = useState<{ [key: string]: number }>({})
  const [deviceInfo, setDeviceInfo] = useState<any>({})
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>()
  
  const schema = form.schema as FormSchema

  // Track device info and analytics on component mount
  useEffect(() => {
    // Detect device info
    const deviceInfo = {
      deviceType: getDeviceType(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language
    }
    setDeviceInfo(deviceInfo)

    // Track form view
    trackAnalytics('view', null, 0)

    // Cleanup on unmount
    return () => {
      // Track session end if not completed
      if (!isSubmitted) {
        trackAnalytics('abandon', null, getSessionDuration())
      }
    }
  }, [])

  const getDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('mobile')) return 'mobile'
    if (userAgent.includes('tablet') || userAgent.includes('ipad')) return 'tablet'
    return 'desktop'
  }

  const getSessionDuration = () => {
    const startTime = parseInt(sessionId.split('_')[1])
    return Math.floor((Date.now() - startTime) / 1000)
  }

  const trackAnalytics = async (action: string, fieldId: string | null, timeSpent: number) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: form.id,
          action,
          fieldId,
          timeSpent,
          deviceInfo,
          userAgent: navigator.userAgent,
          ipAddress: null, // Could be extracted from headers in production
          sessionId
        }),
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  const handleFieldFocus = (fieldId: string) => {
    const startTime = Date.now()
    setFieldStartTimes(prev => ({ ...prev, [fieldId]: startTime }))
    trackAnalytics('field_focus', fieldId, 0)
  }

  const handleFieldBlur = (fieldId: string) => {
    const startTime = fieldStartTimes[fieldId]
    if (startTime) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      trackAnalytics('field_blur', fieldId, timeSpent)
      
      // Remove from tracking
      setFieldStartTimes(prev => {
        const newState = { ...prev }
        delete newState[fieldId]
        return newState
      })
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      // Add session info to submission
      const submissionData = {
        ...data,
        _metadata: {
          sessionId,
          completionTime: getSessionDuration(),
          deviceInfo,
          timestamp: new Date().toISOString()
        }
      }

      const response = await fetch('/api/forms/' + form.id + '/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: submissionData,
          ipAddress: null, // Could be extracted from headers
          userAgent: navigator.userAgent,
          sessionId,
          completionTime: getSessionDuration(),
          deviceInfo
        }),
      })

      if (response.ok) {
        // Track successful submission
        trackAnalytics('submit', null, getSessionDuration())
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
    const fieldValue = watch(fieldName)
    
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
      onFocus: () => handleFieldFocus(fieldName),
      onBlur: () => handleFieldBlur(fieldName),
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
            onFocus={() => handleFieldFocus(fieldName)}
            onBlur={() => handleFieldBlur(fieldName)}
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
                  onFocus={() => handleFieldFocus(fieldName)}
                  onBlur={() => handleFieldBlur(fieldName)}
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
                  onFocus={() => handleFieldFocus(fieldName)}
                  onBlur={() => handleFieldBlur(fieldName)}
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
          <AdvancedFileUpload
            field={field}
            value={fieldValue}
            onChange={(file) => setValue(fieldName, file)}
            onError={(error) => toast.error(error)}
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
                onClick={() => setValue(fieldName, star)}
                onFocus={() => handleFieldFocus(fieldName)}
                onBlur={() => handleFieldBlur(fieldName)}
              >
                {fieldValue >= star ? '★' : '☆'}
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