import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const forms = await prisma.form.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { submissions: true }
        }
      }
    })

    return NextResponse.json({ forms })
  } catch (error) {
    console.error('Get forms error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, description, schema, settings } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const form = await prisma.form.create({
      data: {
        title,
        description,
        schema: schema || {
          title,
          description,
          fields: []
        },
        settings: settings || {
          submitText: 'Submit',
          redirectUrl: null,
          thankYouMessage: 'Thank you for your submission!',
          notifications: {
            email: false,
            adminEmail: null
          }
        },
        userId: session.user.id,
      }
    })

    return NextResponse.json({ form }, { status: 201 })
  } catch (error) {
    console.error('Create form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}