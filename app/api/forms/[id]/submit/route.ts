import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, ipAddress, userAgent } = await request.json()

    // Check if form exists and is published
    const form = await prisma.form.findFirst({
      where: {
        id: params.id,
        status: 'PUBLISHED'
      }
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found or not published' },
        { status: 404 }
      )
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        data,
        ipAddress,
        userAgent,
        formId: params.id,
      }
    })

    // TODO: Send notifications, webhooks, etc.
    // This is where you would integrate with email services, webhooks, etc.

    return NextResponse.json({ 
      message: 'Form submitted successfully',
      submissionId: submission.id 
    })
  } catch (error) {
    console.error('Submit form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}