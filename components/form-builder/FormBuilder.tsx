'use client'

import { useState, useCallback } from 'react'
import { useDrop } from 'react-dnd'
import FieldLibrary from './FieldLibrary'
import Canvas from './Canvas'
import FieldSettings from './FieldSettings'
import { FormField, FormSchema } from '@/types'
import { v4 as uuidv4 } from 'uuid'

interface FormBuilderProps {
  initialForm?: FormSchema
  onSave: (form: FormSchema) => Promise<void>
  onPublish?: () => void
  formTitle?: string
  formDescription?: string
}

export default function FormBuilder({ 
  initialForm, 
  onSave, 
  onPublish,
  formTitle = 'Untitled Form',
  formDescription = ''
}: FormBuilderProps) {
  const [form, setForm] = useState<FormSchema>(initialForm || {
    title: formTitle,
    description: formDescription,
    fields: []
  })
  
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  const [{ isOver }, drop] = useDrop({
    accept: 'field',
    drop: (item: { fieldType: string }) => {
      const newField: FormField = {
        id: uuidv4(),
        type: item.fieldType as any,
        label: getDefaultLabel(item.fieldType),
        placeholder: getDefaultPlaceholder(item.fieldType),
        required: false,
        width: 'full'
      }
      addField(newField)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const getDefaultLabel = (fieldType: string): string => {
    const labels: Record<string, string> = {
      text: 'Text Input',
      textarea: 'Text Area',
      email: 'Email Address',
      phone: 'Phone Number',
      number: 'Number',
      dropdown: 'Select Option',
      radio: 'Radio Buttons',
      checkbox: 'Checkboxes',
      date: 'Date',
      file: 'File Upload',
      rating: 'Rating',
      submit: 'Submit Button'
    }
    return labels[fieldType] || 'New Field'
  }

  const getDefaultPlaceholder = (fieldType: string): string => {
    const placeholders: Record<string, string> = {
      text: 'Enter text...',
      textarea: 'Enter your message...',
      email: 'Enter your email',
      phone: 'Enter phone number',
      number: 'Enter a number'
    }
    return placeholders[fieldType] || ''
  }

  const addField = useCallback((field: FormField) => {
    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, field]
    }))
    setSelectedFieldId(field.id)
    setIsDirty(true)
  }, [])

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }))
    setIsDirty(true)
  }, [])

  const deleteField = useCallback((fieldId: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }))
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null)
    }
    setIsDirty(true)
  }, [selectedFieldId])

  const reorderFields = useCallback((oldIndex: number, newIndex: number) => {
    setForm(prev => {
      const newFields = [...prev.fields]
      const [movedField] = newFields.splice(oldIndex, 1)
      newFields.splice(newIndex, 0, movedField)
      return {
        ...prev,
        fields: newFields
      }
    })
    setIsDirty(true)
  }, [])

  const updateFormTitle = useCallback((title: string) => {
    setForm(prev => ({
      ...prev,
      title
    }))
    setIsDirty(true)
  }, [])

  const updateFormDescription = useCallback((description: string) => {
    setForm(prev => ({
      ...prev,
      description
    }))
    setIsDirty(true)
  }, [])

  const handleSave = async () => {
    await onSave(form)
    setIsDirty(false)
  }

  const selectedField = selectedFieldId 
    ? form.fields.find(field => field.id === selectedFieldId)
    : null

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Left Sidebar - Field Library */}
      <div className="w-80 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-heading-3 text-neutral-800 mb-2">Field Library</h2>
          <p className="text-small text-neutral-600">
            Drag fields to the canvas to build your form
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <FieldLibrary />
        </div>
      </div>

      {/* Center Canvas */}
      <div 
        ref={drop}
        className={`flex-1 overflow-y-auto ${isOver ? 'bg-primary-50' : 'bg-neutral-50'}`}
      >
        <Canvas
          form={form}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
          onUpdateField={updateField}
          onDeleteField={deleteField}
          onReorderFields={reorderFields}
          onUpdateTitle={updateFormTitle}
          onUpdateDescription={updateFormDescription}
        />
      </div>

      {/* Right Sidebar - Field Settings */}
      <div className="w-80 bg-white border-l border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-heading-3 text-neutral-800">Properties</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {selectedField ? (
            <FieldSettings
              field={selectedField}
              onUpdate={(updates) => updateField(selectedField.id, updates)}
            />
          ) : (
            <div className="p-6 text-center">
              <p className="text-small text-neutral-600">
                Select a field to edit its properties
              </p>
            </div>
          )}
        </div>
        
        {/* Save Actions */}
        <div className="p-6 border-t border-neutral-200 space-y-3">
          <button
            onClick={handleSave}
            className="w-full btn-primary"
            disabled={!isDirty}
          >
            Save Form
          </button>
          
          {onPublish && (
            <button
              onClick={onPublish}
              className="w-full btn-secondary"
              disabled={form.fields.length === 0}
            >
              Publish Form
            </button>
          )}
        </div>
      </div>
    </div>
  )
}