import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function FormAnalyticsPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Get form details
  const form = await prisma.form.findFirst({
    where: {
      id: params.id,
      userId: session.user.id
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      _count: {
        select: { submissions: true }
      }
    }
  })

  if (!form) {
    redirect('/dashboard/forms')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/dashboard/forms"
            className="btn-ghost flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Forms</span>
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display text-neutral-800 mb-2">{form.title}</h1>
            <p className="text-body text-neutral-600">
              {form.description} • Created {new Date(form.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-small text-neutral-600">Total Submissions</p>
              <p className="text-2xl font-bold text-neutral-800">
                {form._count.submissions}
              </p>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-small font-medium ${
              form.status === 'PUBLISHED' 
                ? 'bg-green-100 text-green-700' 
                : form.status === 'DRAFT'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-neutral-100 text-neutral-700'
            }`}>
              {form.status}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <AdvancedAnalytics formId={form.id} />
    </div>
  )
}