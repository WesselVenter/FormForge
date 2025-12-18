'use client'

import { useState, useRef } from 'react'
import { FormField } from '@/types'
import { Upload, X, File, Image, FileText } from 'lucide-react'

interface AdvancedFileUploadProps {
  field: FormField
  value?: File | null
  onChange: (file: File | null) => void
  onError?: (error: string) => void
}

export default function AdvancedFileUpload({ 
  field, 
  value, 
  onChange, 
  onError 
}: AdvancedFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allowedTypes = field.validation?.allowedTypes || ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif']
  const maxSize = field.validation?.maxSize || '10MB'

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-8 h-8 text-blue-500" />
    if (file.type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    return <File className="w-8 h-8 text-neutral-500" />
  }

  const validateFile = (file: File): string | null => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !allowedTypes.includes(extension)) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }

    const maxSizeBytes = parseSize(maxSize)
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSize} limit`
    }

    return null
  }

  const parseSize = (size: string): number => {
    const units = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 }
    const match = size.match(/^(\d+)\s*(B|KB|MB|GB)$/i)
    if (!match) return 10 * 1024 * 1024 // Default 10MB
    return parseInt(match[1]) * units[match[2].toUpperCase() as keyof typeof units]
  }

  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      onError?.(validationError)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      // Upload to Supabase via edge function
      const formData = new FormData()
      formData.append('file', file)
      formData.append('formId', 'current-form-id')
      formData.append('fieldId', field.id)

      const response = await fetch('/api/file-upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const result = await response.json()
        onChange(file)
      } else {
        const error = await response.json()
        onError?.(error.error?.message || 'Upload failed')
      }
    } catch (error) {
      onError?.('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeFile = () => {
    setPreview(null)
    onChange(null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (value) {
    return (
      <div className="space-y-4">
        {/* Uploaded File Preview */}
        <div className="relative bg-neutral-50 rounded-medium p-4 border border-neutral-200">
          <div className="flex items-center space-x-4">
            {preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded-medium"
              />
            ) : (
              getFileIcon(value)
            )}
            
            <div className="flex-1">
              <p className="font-medium text-neutral-800">{value.name}</p>
              <p className="text-small text-neutral-600">
                {formatFileSize(value.size)} • {value.type}
              </p>
            </div>
            
            <button
              onClick={removeFile}
              className="p-2 text-neutral-500 hover:text-error hover:bg-red-50 rounded-medium transition-colors duration-150"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Upload Progress (if uploading) */}
        {isUploading && (
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-medium p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-primary-400 bg-primary-50' 
            : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
        } ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={allowedTypes.map(type => `.${type}`).join(',')}
          onChange={handleFileInputChange}
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
            <Upload className={`w-6 h-6 ${isDragging ? 'text-primary-600' : 'text-neutral-500'}`} />
          </div>
          
          <div>
            <p className="text-body text-neutral-700 mb-2">
              {isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-small text-neutral-500">
              {allowedTypes.join(', ').toUpperCase()} up to {maxSize}
            </p>
          </div>
        </div>

        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-medium flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-small text-neutral-600">Uploading... {uploadProgress}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}