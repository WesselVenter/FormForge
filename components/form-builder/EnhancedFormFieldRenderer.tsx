'use client'

import { FormField } from '@/types'
import AdvancedFileUpload from './AdvancedFileUpload'

interface FormFieldRendererProps {
  field: FormField
  onFileChange?: (fieldId: string, file: File | null) => void
}

export default function FormFieldRenderer({ field, onFileChange }: FormFieldRendererProps) {
  const getFieldWidthClass = () => {
    switch (field.width) {
      case 'half':
        return 'w-1/2'
      case 'third':
        return 'w-1/3'
      default:
        return 'w-full'
    }
  }

  const renderField = () => {
    const baseClasses = "input-field"
    const widthClass = getFieldWidthClass()

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className={`${baseClasses} ${widthClass}`}
            required={field.required}
            readOnly
          />
        )

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            className={`${baseClasses} ${widthClass} min-h-[100px] resize-vertical`}
            required={field.required}
            readOnly
          />
        )

      case 'dropdown':
        return (
          <select className={`${baseClasses} ${widthClass}`} required={field.required} readOnly>
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className={`space-y-2 ${widthClass}`}>
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                  required={field.required}
                  readOnly
                />
                <span className="text-body text-neutral-700">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className={`space-y-2 ${widthClass}`}>
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  readOnly
                />
                <span className="text-body text-neutral-700">{option.label}</span>
              </label>
            ))}
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            className={`${baseClasses} ${widthClass}`}
            required={field.required}
            readOnly
          />
        )

      case 'file':
        return (
          <div className={`${widthClass}`}>
            <AdvancedFileUpload
              field={field}
              value={null}
              onChange={(file) => onFileChange?.(field.id, file)}
              onError={(error) => console.error('File upload error:', error)}
            />
          </div>
        )

      case 'rating':
        const stars = Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className="w-6 h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))
        return (
          <div className={`flex items-center space-x-1 ${widthClass}`}>
            {stars}
          </div>
        )

      case 'hidden':
        return (
          <input
            type="hidden"
            value={field.defaultValue || ''}
            readOnly
          />
        )

      case 'divider':
        return (
          <div className={`border-t border-neutral-200 my-8 ${widthClass}`}></div>
        )

      case 'submit':
        return (
          <button
            type="submit"
            className="btn-primary"
            disabled
          >
            {field.label || 'Submit'}
          </button>
        )

      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            className={`${baseClasses} ${widthClass}`}
            required={field.required}
            readOnly
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      {/* Field Label */}
      {field.type !== 'hidden' && field.type !== 'divider' && (
        <label className="block text-small font-medium text-neutral-700">
          {field.label}
          {field.required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Field Input */}
      <div className="flex flex-wrap gap-4">
        {renderField()}
      </div>

      {/* Field Description */}
      {field.placeholder && field.type !== 'textarea' && field.type !== 'file' && (
        <p className="text-small text-neutral-500">{field.placeholder}</p>
      )}

      {/* File Upload Validation Info */}
      {field.type === 'file' && field.validation && (
        <p className="text-small text-neutral-500">
          Allowed types: {field.validation.allowedTypes?.join(', ').toUpperCase()} 
          {field.validation.maxSize && ` • Max size: ${field.validation.maxSize}`}
        </p>
      )}
    </div>
  )
}