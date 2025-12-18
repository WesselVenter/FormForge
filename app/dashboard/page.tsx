import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardOverview from '@/components/dashboard/DashboardOverview'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  // Get user's forms
  const forms = await prisma.form.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: {
        select: { submissions: true }
      }
    }
  })

  // Get recent submissions
  const recentSubmissions = await prisma.submission.findMany({
    where: {
      form: {
        userId: session.user.id
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      form: {
        select: { title: true }
      }
    }
  })

  // Calculate analytics
  const totalForms = forms.length
  const publishedForms = forms.filter(f => f.status === 'PUBLISHED').length
  const totalSubmissions = forms.reduce((sum, form) => sum + form._count.submissions, 0)

  const stats = {
    totalForms,
    publishedForms,
    totalSubmissions,
    draftForms: totalForms - publishedForms
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardOverview 
        stats={stats}
        forms={forms}
        recentSubmissions={recentSubmissions}
      />
    </div>
  )
}