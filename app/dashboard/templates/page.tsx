import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TemplatesGrid from '@/components/templates/TemplatesGrid'

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Template data (could be moved to database later)
  const templates = [
    {
      id: 'contact-form',
      title: 'Contact Form',
      description: 'A simple contact form for general inquiries',
      category: 'Communication',
      thumbnail: null,
      schema: {
        title: 'Contact Us',
        description: 'Get in touch with us',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: true,
            width: 'full'
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email',
            required: true,
            width: 'full'
          },
          {
            id: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'Enter your message',
            required: true,
            width: 'full'
          }
        ]
      },
      settings: {
        submitText: 'Send Message',
        redirectUrl: null,
        thankYouMessage: 'Thank you for your message! We will get back to you soon.',
        notifications: {
          email: true,
          adminEmail: null
        }
      }
    },
    {
      id: 'lead-generation',
      title: 'Lead Generation',
      description: 'Capture leads for marketing campaigns',
      category: 'Marketing',
      thumbnail: null,
      schema: {
        title: 'Get Started Today',
        description: 'Join thousands of satisfied customers',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'First Name',
            placeholder: 'Enter your first name',
            required: true,
            width: 'half'
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'Last Name',
            placeholder: 'Enter your last name',
            required: true,
            width: 'half'
          },
          {
            id: 'email',
            type: 'email',
            label: 'Business Email',
            placeholder: 'Enter your business email',
            required: true,
            width: 'full'
          },
          {
            id: 'company',
            type: 'text',
            label: 'Company Name',
            placeholder: 'Enter your company name',
            required: true,
            width: 'full'
          },
          {
            id: 'size',
            type: 'dropdown',
            label: 'Company Size',
            required: true,
            width: 'full',
            options: [
              { value: '1-10', label: '1-10 employees' },
              { value: '11-50', label: '11-50 employees' },
              { value: '51-200', label: '51-200 employees' },
              { value: '201-1000', label: '201-1000 employees' },
              { value: '1000+', label: '1000+ employees' }
            ]
          }
        ]
      },
      settings: {
        submitText: 'Get Started',
        redirectUrl: null,
        thankYouMessage: 'Thank you! We will contact you shortly.',
        notifications: {
          email: true,
          adminEmail: null
        }
      }
    },
    {
      id: 'feedback-form',
      title: 'Customer Feedback',
      description: 'Gather customer feedback and satisfaction ratings',
      category: 'Feedback',
      thumbnail: null,
      schema: {
        title: 'We value your feedback',
        description: 'Help us improve our service',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Your Name',
            placeholder: 'Enter your name',
            required: true,
            width: 'full'
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter your email',
            required: true,
            width: 'full'
          },
          {
            id: 'satisfaction',
            type: 'radio',
            label: 'How satisfied are you with our service?',
            required: true,
            width: 'full',
            options: [
              { value: 'very_satisfied', label: 'Very Satisfied' },
              { value: 'satisfied', label: 'Satisfied' },
              { value: 'neutral', label: 'Neutral' },
              { value: 'dissatisfied', label: 'Dissatisfied' },
              { value: 'very_dissatisfied', label: 'Very Dissatisfied' }
            ]
          },
          {
            id: 'comments',
            type: 'textarea',
            label: 'Additional Comments',
            placeholder: 'Share your thoughts...',
            required: false,
            width: 'full'
          }
        ]
      },
      settings: {
        submitText: 'Submit Feedback',
        redirectUrl: null,
        thankYouMessage: 'Thank you for your feedback!',
        notifications: {
          email: true,
          adminEmail: null
        }
      }
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <TemplatesGrid templates={templates} />
    </div>
  )
}