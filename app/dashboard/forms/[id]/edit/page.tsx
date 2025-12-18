import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import FormBuilder from '@/components/form-builder/FormBuilder'
import { FormSchema, FormSettings } from '@/types'
import { toast } from 'react-hot-toast'

export default async function EditFormPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const form = await prisma.form.findFirst({
    where: {
      id: params.id,
      userId: session.user.id
    }
  })

  if (!form) {
    redirect('/dashboard/forms')
  }

  const handleSave = async (schema: FormSchema) => {
    'use server'
    
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/forms/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schema,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save form')
      }

      return { success: true }
    } catch (error) {
      console.error('Save form error:', error)
      throw error
    }
  }

  const handlePublish = async () => {
    'use server'
    
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/forms/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'PUBLISHED',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to publish form')
      }

      return { success: true }
    } catch (error) {
      console.error('Publish form error:', error)
      throw error
    }
  }

  return (
    <FormBuilder
      initialForm={form.schema as FormSchema}
      onSave={handleSave}
      onPublish={handlePublish}
      formTitle={form.title}
      formDescription={form.description || ''}
    />
  )
}