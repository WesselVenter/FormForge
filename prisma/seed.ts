import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const demoUser = {
  email: 'demo@formforge.com',
  name: 'Demo User',
  password: 'demo123'
}

const formTemplates = [
  {
    title: 'Contact Form',
    description: 'A simple contact form for general inquiries',
    schema: {
      title: 'Contact Us',
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          width: 'full',
          validation: {
            minLength: 2
          }
        },
        {
          id: 'field-2',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          width: 'full'
        },
        {
          id: 'field-3',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message',
          required: true,
          width: 'full',
          validation: {
            minLength: 10
          }
        }
      ]
    },
    settings: {
      submitText: 'Send Message',
      redirectUrl: null,
      thankYouMessage: 'Thank you for your message! We will get back to you soon.',
      notifications: {
        email: true,
        adminEmail: 'demo@formforge.com'
      }
    }
  },
  {
    title: 'Lead Generation Form',
    description: 'Capture leads for marketing campaigns',
    schema: {
      title: 'Get Started Today',
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true,
          width: 'half'
        },
        {
          id: 'field-2',
          type: 'text',
          label: 'Last Name',
          placeholder: 'Enter your last name',
          required: true,
          width: 'half'
        },
        {
          id: 'field-3',
          type: 'email',
          label: 'Business Email',
          placeholder: 'Enter your business email',
          required: true,
          width: 'full'
        },
        {
          id: 'field-4',
          type: 'text',
          label: 'Company Name',
          placeholder: 'Enter your company name',
          required: true,
          width: 'full'
        },
        {
          id: 'field-5',
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
        adminEmail: 'demo@formforge.com'
      }
    }
  },
  {
    title: 'Customer Feedback Form',
    description: 'Gather customer feedback and satisfaction ratings',
    schema: {
      title: 'We value your feedback',
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'Your Name',
          placeholder: 'Enter your name',
          required: true,
          width: 'full'
        },
        {
          id: 'field-2',
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          required: true,
          width: 'full'
        },
        {
          id: 'field-3',
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
          id: 'field-4',
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
        adminEmail: 'demo@formforge.com'
      }
    }
  },
  {
    title: 'Event Registration',
    description: 'Register attendees for events and conferences',
    schema: {
      title: 'Event Registration',
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          width: 'full'
        },
        {
          id: 'field-2',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          width: 'full'
        },
        {
          id: 'field-3',
          type: 'text',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: true,
          width: 'full'
        },
        {
          id: 'field-4',
          type: 'dropdown',
          label: 'Ticket Type',
          required: true,
          width: 'full',
          options: [
            { value: 'general', label: 'General Admission - $50' },
            { value: 'vip', label: 'VIP Access - $150' },
            { value: 'student', label: 'Student Discount - $25' }
          ]
        },
        {
          id: 'field-5',
          type: 'checkbox',
          label: 'Dietary Restrictions',
          required: false,
          width: 'full',
          options: [
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'vegan', label: 'Vegan' },
            { value: 'gluten_free', label: 'Gluten Free' },
            { value: 'other', label: 'Other (specify in comments)' }
          ]
        },
        {
          id: 'field-6',
          type: 'textarea',
          label: 'Additional Notes',
          placeholder: 'Any special requirements or comments...',
          required: false,
          width: 'full'
        }
      ]
    },
    settings: {
      submitText: 'Register Now',
      redirectUrl: null,
      thankYouMessage: 'Registration successful! Check your email for confirmation.',
      notifications: {
        email: true,
        adminEmail: 'demo@formforge.com'
      }
    }
  },
  {
    title: 'Newsletter Signup',
    description: 'Simple newsletter subscription form',
    schema: {
      title: 'Stay Updated',
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true,
          width: 'half'
        },
        {
          id: 'field-2',
          type: 'text',
          label: 'Last Name',
          placeholder: 'Enter your last name',
          required: true,
          width: 'half'
        },
        {
          id: 'field-3',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email address',
          required: true,
          width: 'full'
        }
      ]
    },
    settings: {
      submitText: 'Subscribe',
      redirectUrl: null,
      thankYouMessage: 'Thank you for subscribing to our newsletter!',
      notifications: {
        email: false,
        adminEmail: null
      }
    }
  },
  {
    title: 'Job Application Form',
    description: 'Comprehensive job application form',
    schema: {
      title: 'Apply for Position',
      fields: [
        {
          id: 'field-1',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
          width: 'full'
        },
        {
          id: 'field-2',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          width: 'full'
        },
        {
          id: 'field-3',
          type: 'text',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: true,
          width: 'full'
        },
        {
          id: 'field-4',
          type: 'text',
          label: 'Position Applied For',
          placeholder: 'Enter the position title',
          required: true,
          width: 'full'
        },
        {
          id: 'field-5',
          type: 'number',
          label: 'Years of Experience',
          placeholder: 'Enter years of experience',
          required: true,
          width: 'half'
        },
        {
          id: 'field-6',
          type: 'dropdown',
          label: 'Highest Education Level',
          required: true,
          width: 'half',
          options: [
            { value: 'high_school', label: 'High School' },
            { value: 'associates', label: 'Associate Degree' },
            { value: 'bachelors', label: "Bachelor's Degree" },
            { value: 'masters', label: "Master's Degree" },
            { value: 'phd', label: 'PhD' }
          ]
        },
        {
          id: 'field-7',
          type: 'file',
          label: 'Resume/CV',
          placeholder: 'Upload your resume',
          required: true,
          width: 'full',
          validation: {
            maxSize: '5MB',
            allowedTypes: ['pdf', 'doc', 'docx']
          }
        },
        {
          id: 'field-8',
          type: 'textarea',
          label: 'Cover Letter',
          placeholder: 'Tell us why you are a great fit...',
          required: false,
          width: 'full'
        }
      ]
    },
    settings: {
      submitText: 'Submit Application',
      redirectUrl: null,
      thankYouMessage: 'Application submitted successfully! We will review it and get back to you.',
      notifications: {
        email: true,
        adminEmail: 'demo@formforge.com'
      }
    }
  }
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash(demoUser.password, 12)
  
  const user = await prisma.user.upsert({
    where: { email: demoUser.email },
    update: {},
    create: {
      email: demoUser.email,
      name: demoUser.name,
    },
  })

  console.log('✅ Created demo user')

  // Create form templates
  for (const template of formTemplates) {
    await prisma.form.upsert({
      where: { 
        title_userId: {
          title: template.title,
          userId: user.id
        }
      },
      update: {},
      create: {
        title: template.title,
        description: template.description,
        schema: template.schema,
        settings: template.settings,
        status: 'DRAFT',
        userId: user.id,
      },
    })
  }

  console.log('✅ Created form templates')

  // Create a published demo form
  await prisma.form.create({
    data: {
      title: 'Demo Contact Form',
      description: 'A live demo form for testing',
      schema: {
        title: 'Contact Form Demo',
        fields: [
          {
            id: 'demo-1',
            type: 'text',
            label: 'Name',
            placeholder: 'Enter your name',
            required: true,
            width: 'full'
          },
          {
            id: 'demo-2',
            type: 'email',
            label: 'Email',
            placeholder: 'Enter your email',
            required: true,
            width: 'full'
          },
          {
            id: 'demo-3',
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
        thankYouMessage: 'Thank you for your message!',
        notifications: {
          email: true,
          adminEmail: 'demo@formforge.com'
        }
      },
      status: 'PUBLISHED',
      publishedAt: new Date(),
      userId: user.id,
    },
  })

  console.log('✅ Created published demo form')
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })