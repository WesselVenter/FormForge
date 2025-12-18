'use client'

import { useDrag } from 'react-dnd'
import { 
  Type, 
  AlignLeft, 
  Mail, 
  Phone, 
  Hash, 
  ChevronDown, 
  Circle, 
  Square, 
  Calendar, 
  Upload, 
  Star, 
  EyeOff, 
  Minus, 
  Send 
} from 'lucide-react'
import { FieldType } from '@/types'

const fieldTypes = [
  {
    type: 'text' as FieldType,
    label: 'Text Input',
    icon: Type,
    description: 'Single line text input'
  },
  {
    type: 'textarea' as FieldType,
    label: 'Text Area',
    icon: AlignLeft,
    description: 'Multi-line text input'
  },
  {
    type: 'email' as FieldType,
    label: 'Email',
    icon: Mail,
    description: 'Email address input'
  },
  {
    type: 'phone' as FieldType,
    label: 'Phone',
    icon: Phone,
    description: 'Phone number input'
  },
  {
    type: 'number' as FieldType,
    label: 'Number',
    icon: Hash,
    description: 'Numeric input'
  },
  {
    type: 'dropdown' as FieldType,
    label: 'Dropdown',
    icon: ChevronDown,
    description: 'Select from options'
  },
  {
    type: 'radio' as FieldType,
    label: 'Radio Buttons',
    icon: Circle,
    description: 'Single choice selection'
  },
  {
    type: 'checkbox' as FieldType,
    label: 'Checkboxes',
    icon: Square,
    description: 'Multiple choice selection'
  },
  {
    type: 'date' as FieldType,
    label: 'Date Picker',
    icon: Calendar,
    description: 'Date selection'
  },
  {
    type: 'file' as FieldType,
    label: 'File Upload',
    icon: Upload,
    description: 'File attachment'
  },
  {
    type: 'rating' as FieldType,
    label: 'Rating',
    icon: Star,
    description: 'Star rating system'
  },
  {
    type: 'hidden' as FieldType,
    label: 'Hidden Field',
    icon: EyeOff,
    description: 'Hidden form field'
  },
  {
    type: 'divider' as FieldType,
    label: 'Section Divider',
    icon: Minus,
    description: 'Visual separator'
  },
  {
    type: 'submit' as FieldType,
    label: 'Submit Button',
    icon: Send,
    description: 'Form submission button'
  }
]

interface DraggableFieldProps {
  field: typeof fieldTypes[0]
}

function DraggableField({ field }: DraggableFieldProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: { fieldType: field.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const Icon = field.icon

  return (
    <div
      ref={drag}
      className={`p-4 m-3 bg-white border border-neutral-200 rounded-medium cursor-grab hover:border-primary-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-3 scale-105' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-neutral-100 rounded-medium">
          <Icon className="w-5 h-5 text-neutral-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-neutral-800 text-small">{field.label}</h3>
          <p className="text-small text-neutral-500 mt-1">{field.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function FieldLibrary() {
  return (
    <div className="p-4">
      <div className="space-y-2">
        {fieldTypes.map((field) => (
          <DraggableField key={field.type} field={field} />
        ))}
      </div>
    </div>
  )
}