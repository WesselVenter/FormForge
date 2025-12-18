'use client'

import { useState } from 'react'
import { FormField } from '@/types'

interface FieldSettingsProps {
  field: FormField
  onUpdate: (updates: Partial<FormField>) => void
}

export default function FieldSettings({ field, onUpdate }: FieldSettingsProps) {
  const [localField, setLocalField] = useState(field)

  const updateField = (updates: Partial<FormField>) => {
    const updatedField = { ...localField, ...updates }
    setLocalField(updatedField)
    onUpdate(updates)
  }

  const updateValidation = (validation: any) => {
    updateField({
      validation: { ...localField.validation, ...validation }
    })
  }

  const addOption = () => {
    const newOption = { value: '', label: '' }
    updateField({
      options: [...(localField.options || []), newOption]
    })
  }

  const updateOption = (index: number, key: 'value' | 'label', value: string) => {
    const updatedOptions = [...(localField.options || [])]
    updatedOptions[index] = { ...updatedOptions[index], [key]: value }
    updateField({ options: updatedOptions })
  }

  const removeOption = (index: number) => {
    const updatedOptions = (localField.options || []).filter((_, i) => i !== index)
    updateField({ options: updatedOptions })
  }

  const hasOptions = ['dropdown', 'radio', 'checkbox'].includes(field.type)
  const hasValidation = ['text', 'textarea', 'email', 'number'].includes(field.type)
  const showPlaceholder = !['radio', 'checkbox', 'file', 'date', 'rating', 'hidden', 'divider', 'submit'].includes(field.type)

  return (
    <div className="p-6 space-y-6">
      {/* Basic Settings */}
      <div>
        <h3 className="text-ui-label text-neutral-800 mb-4">Basic Settings</h3>
        
        <div className="space-y-4">
          {/* Field Label */}
          <div>
            <label className="block text-small font-medium text-neutral-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={localField.label}
              onChange={(e) => updateField({ label: e.target.value })}
              className="input-field"
              placeholder="Enter field label"
            />
          </div>

          {/* Placeholder */}
          {showPlaceholder && (
            <div>
              <label className="block text-small font-medium text-neutral-700 mb-1">
                Placeholder
              </label>
              <input
                type="text"
                value={localField.placeholder || ''}
                onChange={(e) => updateField({ placeholder: e.target.value })}
                className="input-field"
                placeholder="Enter placeholder text"
              />
            </div>
          )}

          {/* Width */}
          <div>
            <label className="block text-small font-medium text-neutral-700 mb-1">
              Width
            </label>
            <select
              value={localField.width}
              onChange={(e) => updateField({ width: e.target.value as 'full' | 'half' | 'third' })}
              className="input-field"
            >
              <option value="full">Full Width</option>
              <option value="half">Half Width</option>
              <option value="third">Third Width</option>
            </select>
          </div>

          {/* Required */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={localField.required || false}
              onChange={(e) => updateField({ required: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="required" className="text-small font-medium text-neutral-700">
              Required field
            </label>
          </div>
        </div>
      </div>

      {/* Options (for dropdown, radio, checkbox) */}
      {hasOptions && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-ui-label text-neutral-800">Options</h3>
            <button
              onClick={addOption}
              className="text-primary-600 hover:text-primary-700 text-small font-medium"
            >
              Add Option
            </button>
          </div>
          
          <div className="space-y-3">
            {(localField.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => updateOption(index, 'label', e.target.value)}
                  className="input-field flex-1"
                  placeholder="Option label"
                />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => updateOption(index, 'value', e.target.value)}
                  className="input-field flex-1"
                  placeholder="Option value"
                />
                <button
                  onClick={() => removeOption(index)}
                  className="text-error hover:text-red-700 p-1"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {(!localField.options || localField.options.length === 0) && (
              <p className="text-small text-neutral-500 text-center py-4">
                No options added yet. Click "Add Option" to get started.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Validation */}
      {hasValidation && (
        <div>
          <h3 className="text-ui-label text-neutral-800 mb-4">Validation</h3>
          
          <div className="space-y-4">
            {/* Min Length */}
            <div>
              <label className="block text-small font-medium text-neutral-700 mb-1">
                Minimum Length
              </label>
              <input
                type="number"
                value={localField.validation?.minLength || ''}
                onChange={(e) => updateValidation({ 
                  minLength: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="input-field"
                placeholder="No minimum"
                min="0"
              />
            </div>

            {/* Max Length */}
            <div>
              <label className="block text-small font-medium text-neutral-700 mb-1">
                Maximum Length
              </label>
              <input
                type="number"
                value={localField.validation?.maxLength || ''}
                onChange={(e) => updateValidation({ 
                  maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                className="input-field"
                placeholder="No maximum"
                min="0"
              />
            </div>

            {/* Pattern/Regex */}
            <div>
              <label className="block text-small font-medium text-neutral-700 mb-1">
                Pattern (Regex)
              </label>
              <input
                type="text"
                value={localField.validation?.pattern || ''}
                onChange={(e) => updateValidation({ 
                  pattern: e.target.value || undefined 
                })}
                className="input-field"
                placeholder="Enter regex pattern"
              />
            </div>

            {/* Custom Error Message */}
            <div>
              <label className="block text-small font-medium text-neutral-700 mb-1">
                Custom Error Message
              </label>
              <input
                type="text"
                value={localField.validation?.customMessage || ''}
                onChange={(e) => updateValidation({ 
                  customMessage: e.target.value || undefined 
                })}
                className="input-field"
                placeholder="Enter custom error message"
              />
            </div>
          </div>
        </div>
      )}

      {/* Default Value */}
      <div>
        <h3 className="text-ui-label text-neutral-800 mb-4">Default Value</h3>
        
        <input
          type="text"
          value={localField.defaultValue || ''}
          onChange={(e) => updateField({ 
            defaultValue: e.target.value || undefined 
          })}
          className="input-field"
          placeholder="Enter default value (optional)"
        />
      </div>

      {/* Field Type Info */}
      <div className="bg-neutral-50 rounded-medium p-4">
        <h4 className="text-small font-medium text-neutral-800 mb-2">Field Information</h4>
        <p className="text-small text-neutral-600">
          <strong>Type:</strong> {field.type}
        </p>
        <p className="text-small text-neutral-600">
          <strong>ID:</strong> {field.id}
        </p>
      </div>
    </div>
  )
}