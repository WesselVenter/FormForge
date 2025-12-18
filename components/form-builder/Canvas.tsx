'use client'

import { useState } from 'react'
import { useDrop } from 'react-dnd'
import { Edit2, Trash2, Copy, GripVertical } from 'lucide-react'
import { FormSchema, FormField } from '@/types'
import FormFieldRenderer from './FormFieldRenderer'

interface CanvasProps {
  form: FormSchema
  selectedFieldId: string | null
  onSelectField: (fieldId: string | null) => void
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
  onDeleteField: (fieldId: string) => void
  onReorderFields: (oldIndex: number, newIndex: number) => void
  onUpdateTitle: (title: string) => void
  onUpdateDescription: (description: string) => void
}

export default function Canvas({
  form,
  selectedFieldId,
  onSelectField,
  onUpdateField,
  onDeleteField,
  onReorderFields,
  onUpdateTitle,
  onUpdateDescription
}: CanvasProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)

  const [{ isOver }, drop] = useDrop({
    accept: 'field',
    drop: () => ({ type: 'canvas' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const handleFieldClick = (fieldId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectField(fieldId)
  }

  const handleCanvasClick = () => {
    onSelectField(null)
  }

  return (
    <div 
      ref={drop}
      className="flex justify-center py-8 px-4 min-h-screen"
      onClick={handleCanvasClick}
    >
      <div className={`canvas-paper w-full max-w-4xl transition-colors duration-200 ${
        isOver ? 'bg-primary-50' : 'bg-white'
      }`}>
        {/* Form Header */}
        <div className="p-8 border-b border-neutral-200">
          <div className="text-center mb-6">
            {isEditingTitle ? (
              <input
                type="text"
                value={form.title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditingTitle(false)
                }}
                className="text-display text-center w-full bg-transparent border-none outline-none text-neutral-800"
                autoFocus
              />
            ) : (
              <h1 
                className="text-display text-neutral-800 cursor-pointer hover:text-primary-600 transition-colors duration-150"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditingTitle(true)
                }}
              >
                {form.title}
              </h1>
            )}
          </div>

          {form.description && (
            <div className="text-center">
              {isEditingDescription ? (
                <textarea
                  value={form.description}
                  onChange={(e) => onUpdateDescription(e.target.value)}
                  onBlur={() => setIsEditingDescription(false)}
                  className="text-body text-neutral-600 w-full bg-transparent border-none outline-none resize-none text-center max-w-2xl mx-auto"
                  rows={3}
                  autoFocus
                />
              ) : (
                <p 
                  className="text-body text-neutral-600 cursor-pointer hover:text-primary-600 transition-colors duration-150 max-w-2xl mx-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditingDescription(true)
                  }}
                >
                  {form.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="p-8">
          {form.fields.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
                <Edit2 className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-heading-3 text-neutral-800 mb-2">Start Building Your Form</h3>
              <p className="text-body text-neutral-600 mb-6">
                Drag fields from the left panel to start building your form
              </p>
              <div className="flex items-center justify-center space-x-4 text-small text-neutral-500">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
                  <span>Drag fields here</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {form.fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`relative group transition-all duration-200 ${
                    selectedFieldId === field.id 
                      ? 'ring-2 ring-primary-500 ring-offset-2 rounded-medium' 
                      : 'hover:ring-1 hover:ring-neutral-300 hover:ring-offset-1 rounded-medium'
                  }`}
                  onClick={(e) => handleFieldClick(field.id, e)}
                >
                  {/* Field Actions */}
                  <div className="absolute -left-2 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
                    <div className="bg-white border border-neutral-200 rounded-medium shadow-sm p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteField(field.id)
                        }}
                        className="p-1 hover:bg-error hover:text-white rounded-small transition-colors duration-150"
                        title="Delete field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Field Content */}
                  <div className="pl-8">
                    <FormFieldRenderer field={field} />
                  </div>

                  {/* Field Index Indicator */}
                  <div className="absolute -right-2 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <div className="bg-primary-600 text-white text-small font-medium w-6 h-6 rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}