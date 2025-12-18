-- Migration: create_core_schema
-- Created at: 1765958868

-- Create core tables for FormForge
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  schema JSONB NOT NULL,
  settings JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'DRAFT',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  session_id VARCHAR(255),
  completion_time INTEGER, -- seconds
  fields_completed INTEGER DEFAULT 0,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add analytics tracking tables
CREATE TABLE IF NOT EXISTS form_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- 'view', 'field_focus', 'submit', 'abandon'
  field_id VARCHAR(255),
  user_agent TEXT,
  ip_address INET,
  device_info JSONB,
  time_spent INTEGER DEFAULT 0, -- seconds
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add file upload tracking
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  field_id VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  upload_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add real-time tracking sessions
CREATE TABLE IF NOT EXISTS form_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_time_spent INTEGER DEFAULT 0,
  fields_interacted TEXT[], -- Array of field IDs
  device_info JSONB,
  user_agent TEXT,
  ip_address INET,
  is_completed BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_status ON forms(status);
CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_form_analytics_form_id ON form_analytics(form_id);
CREATE INDEX IF NOT EXISTS idx_form_analytics_event_type ON form_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_form_analytics_created_at ON form_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_file_uploads_form_id ON file_uploads(form_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_submission_id ON file_uploads(submission_id);
CREATE INDEX IF NOT EXISTS idx_form_sessions_form_id ON form_sessions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_sessions_session_id ON form_sessions(session_id);;