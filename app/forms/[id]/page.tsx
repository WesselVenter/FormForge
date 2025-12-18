import { prisma } from '@/lib/prisma'
import PublicForm from '@/components/forms/PublicForm'
import { notFound } from 'next/navigation'

export default async function PublicFormPage({
  params
}: {
  params: { id: string }
}) {
  const form = await prisma.form.findFirst({
    where: {
      id: params.id,
      status: 'PUBLISHED'
    }
  })

  if (!form) {
    notFound()
  }

  return <PublicForm form={form} />
}