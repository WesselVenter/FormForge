// Mock Supabase client for local development without Supabase dependency
// In production, uncomment the lines below and install @supabase/supabase-js
/*
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://noytpxrmagkfrmegxujt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5veXRweHJtYWdrZnJtZWd4dWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3ODkyNzMsImV4cCI6MjA1MDM2NTI3M30.O4gN3b6s6qXzN2w5lP8cP7kX9zY2wX3mF8jR5yV4tM0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
*/

// Mock implementation for local development
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        gte: (column: string, value: any) => ({
          lte: (column: string, value: any) => ({
            data: [],
            error: null
          })
        }),
        data: [],
        error: null
      }),
      data: [],
      error: null
    }),
    insert: (data: any) => ({
      data: null,
      error: null
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        data: null,
        error: null
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        data: null,
        error: null
      })
    })
  }),
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => ({
        data: null,
        error: null
      }),
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://example.com/${path}` }
      })
    })
  },
  sql: (query: string) => ({})
}