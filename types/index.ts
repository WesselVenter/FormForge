// Form Field Types
export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'email' 
  | 'phone' 
  | 'number' 
  | 'dropdown' 
  | 'radio' 
  | 'checkbox' 
  | 'date' 
  | 'file' 
  | 'rating' 
  | 'hidden' 
  | 'divider' 
  | 'submit'

export type FieldWidth = 'full' | 'half' | 'third'

export interface FieldOption {
  value: string
  label: string
}

export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  customMessage?: string
}

export interface ConditionalLogic {
  fieldId: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: string | number
  action: 'show' | 'hide'
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  width: FieldWidth
  validation?: FieldValidation
  defaultValue?: string | number | boolean
  options?: FieldOption[]
  conditionalLogic?: ConditionalLogic[]
  style?: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }
}

// Form Schema
export interface FormSchema {
  title: string
  description?: string
  fields: FormField[]
}

// Form Settings
export interface FormSettings {
  submitText: string
  redirectUrl?: string | null
  thankYouMessage?: string
  notifications: {
    email: boolean
    adminEmail?: string | null
  }
  styling?: {
    primaryColor?: string
    backgroundColor?: string
    textColor?: string
    fontFamily?: string
    customCSS?: string
  }
  integrations?: {
    webhooks?: string[]
    googleSheets?: boolean
    slack?: boolean
    zapier?: boolean
  }
  security?: {
    honeypot?: boolean
    recaptcha?: boolean
    rateLimit?: number
  }
}

// Form Status
export type FormStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

// Form Data
export interface Form {
  id: string
  title: string
  description?: string
  schema: FormSchema
  settings: FormSettings
  status: FormStatus
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
}

// Form Submission
export interface FormSubmission {
  id: string
  data: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  formId: string
}

// Drag and Drop Types
export interface DragItem {
  type: string
  fieldType: FieldType
  id: string
}

// Canvas Types
export interface CanvasField extends FormField {
  isDragging?: boolean
  isSelected?: boolean
}

// Template Types
export interface FormTemplate {
  id: string
  title: string
  description: string
  schema: FormSchema
  category: string
  thumbnail?: string
}

// Analytics Types
export interface FormAnalytics {
  totalSubmissions: number
  conversionRate: number
  submissionsByDate: Array<{
    date: string
    count: number
  }>
  fieldAnalytics: Array<{
    fieldId: string
    fieldLabel: string
    completionRate: number
    averageTime: number
  }>
}

// Integration Types
export interface Integration {
  id: string
  name: string
  type: 'webhook' | 'email' | 'sheets' | 'slack' | 'zapier'
  config: Record<string, any>
  isActive: boolean
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form Builder Context Types
export interface FormBuilderState {
  form: FormSchema
  selectedFieldId: string | null
  isDirty: boolean
  previewMode: 'desktop' | 'tablet' | 'mobile'
}

export type FormBuilderAction = 
  | { type: 'ADD_FIELD'; field: FormField }
  | { type: 'UPDATE_FIELD'; fieldId: string; updates: Partial<FormField> }
  | { type: 'DELETE_FIELD'; fieldId: string }
  | { type: 'REORDER_FIELDS'; oldIndex: number; newIndex: number }
  | { type: 'SELECT_FIELD'; fieldId: string | null }
  | { type: 'UPDATE_FORM_TITLE'; title: string }
  | { type: 'UPDATE_FORM_DESCRIPTION'; description: string }
  | { type: 'RESET_FORM' }
  | { type: 'SET_PREVIEW_MODE'; mode: 'desktop' | 'tablet' | 'mobile' }