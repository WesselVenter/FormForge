import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the original form
    const originalForm = await prisma.form.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!originalForm) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    // Create a copy
    const duplicatedForm = await prisma.form.create({
      data: {
        title: `${originalForm.title} (Copy)`,
        description: originalForm.description,
        schema: originalForm.schema,
        settings: originalForm.settings,
        status: 'DRAFT', // Always start as draft
        userId: session.user.id,
      }
    })

    return NextResponse.json({ form: duplicatedForm }, { status: 201 })
  } catch (error) {
    console.error('Duplicate form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}