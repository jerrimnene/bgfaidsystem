-- BGF Aid System Database Schema
-- Run this file to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'applicant' CHECK (role IN (
        'applicant', 'project_officer', 'program_manager', 'finance_director', 
        'hospital_director', 'executive_director', 'ceo', 'founder', 'admin'
    )),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    profile_picture_url TEXT,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "telegram": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create user sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'medical_aid', 'educational_aid', 'emergency_aid', 'business_aid',
        'community_project', 'infrastructure', 'other'
    )),
    status VARCHAR(50) NOT NULL DEFAULT 'new_submission' CHECK (status IN (
        'new_submission', 'po_review', 'manager_review', 'finance_review',
        'hospital_review', 'executive_review', 'ceo_review', 'founder_review',
        'approved', 'rejected', 'edit_requested', 'disbursed', 'completed'
    )),
    amount_requested DECIMAL(15,2),
    amount_approved DECIMAL(15,2),
    priority_level VARCHAR(20) DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
    personal_info JSONB NOT NULL DEFAULT '{}',
    project_details JSONB NOT NULL DEFAULT '{}',
    assigned_po_id UUID REFERENCES users(id),
    current_reviewer_id UUID REFERENCES users(id),
    po_comments TEXT,
    manager_comments TEXT,
    finance_comments TEXT,
    hospital_comments TEXT,
    executive_comments TEXT,
    ceo_comments TEXT,
    founder_comments TEXT,
    po_review_at TIMESTAMP WITH TIME ZONE,
    manager_review_at TIMESTAMP WITH TIME ZONE,
    finance_review_at TIMESTAMP WITH TIME ZONE,
    hospital_review_at TIMESTAMP WITH TIME ZONE,
    executive_review_at TIMESTAMP WITH TIME ZONE,
    ceo_review_at TIMESTAMP WITH TIME ZONE,
    founder_review_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create application files table
CREATE TABLE IF NOT EXISTS application_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_category VARCHAR(50) DEFAULT 'document',
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create application logs table
CREATE TABLE IF NOT EXISTS application_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    comments TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'telegram', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);

CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_type ON applications(type);
CREATE INDEX IF NOT EXISTS idx_applications_assigned_po_id ON applications(assigned_po_id);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);

CREATE INDEX IF NOT EXISTS idx_application_files_application_id ON application_files(application_id);
CREATE INDEX IF NOT EXISTS idx_application_files_uploaded_by ON application_files(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_application_logs_application_id ON application_logs(application_id);
CREATE INDEX IF NOT EXISTS idx_application_logs_user_id ON application_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_application_logs_created_at ON application_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- GoodSam Network: Help Request System Tables
-- This is the real-time humanitarian + faith response system

-- Create goodsam_responders table
-- Verified pastors, elders, nurses, volunteers, counselors
CREATE TABLE IF NOT EXISTS goodsam_responders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    responder_type VARCHAR(50) NOT NULL CHECK (responder_type IN (
        'pastor', 'elder', 'nurse', 'counselor', 'volunteer', 'social_worker', 'mental_health_provider'
    )),
    organization VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    service_area VARCHAR(255),
    availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
    specializations JSONB DEFAULT '[]',
    bio TEXT,
    completed_cases INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create goodsam_help_requests table
-- The SOS requests from people in need
CREATE TABLE IF NOT EXISTS goodsam_help_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    help_type VARCHAR(100) NOT NULL CHECK (help_type IN (
        'prayer', 'counseling', 'emergency_aid', 'medical_support', 'food_aid', 
        'shelter_support', 'financial_help', 'spiritual_guidance', 'emotional_support', 'other'
    )),
    urgency_level VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'assigned', 'in_progress', 'resolved', 'closed', 'archived'
    )),
    location_description VARCHAR(500),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    contact_phone VARCHAR(20),
    is_anonymous BOOLEAN DEFAULT FALSE,
    preferred_contact_method VARCHAR(50) DEFAULT 'phone' CHECK (preferred_contact_method IN ('phone', 'email', 'whatsapp', 'in_person')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create goodsam_cases table
-- Tracks the response and follow-up of each help request
CREATE TABLE IF NOT EXISTS goodsam_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    help_request_id UUID NOT NULL REFERENCES goodsam_help_requests(id) ON DELETE CASCADE,
    assigned_responder_id UUID REFERENCES goodsam_responders(id),
    status VARCHAR(20) NOT NULL DEFAULT 'unassigned' CHECK (status IN (
        'unassigned', 'assigned', 'acknowledged', 'in_progress', 'completed', 'abandoned', 'escalated'
    )),
    assignment_notes TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    outcome VARCHAR(255),
    is_followup_needed BOOLEAN DEFAULT TRUE,
    followup_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create goodsam_case_updates table
-- Log of interactions and progress updates
CREATE TABLE IF NOT EXISTS goodsam_case_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES goodsam_cases(id) ON DELETE CASCADE,
    responder_id UUID REFERENCES goodsam_responders(id),
    update_type VARCHAR(50) NOT NULL CHECK (update_type IN (
        'initial_contact', 'phone_call', 'visit', 'prayer_session', 'counseling', 
        'aid_provided', 'referral', 'escalation', 'completion', 'follow_up', 'other'
    )),
    message TEXT,
    supporting_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create goodsam_notifications table
-- Real-time alerts to responders
CREATE TABLE IF NOT EXISTS goodsam_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    responder_id UUID NOT NULL REFERENCES goodsam_responders(id) ON DELETE CASCADE,
    help_request_id UUID NOT NULL REFERENCES goodsam_help_requests(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN (
        'new_request', 'assignment', 'urgent_alert', 'reassignment', 'system_update'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for GoodSam tables
CREATE INDEX IF NOT EXISTS idx_goodsam_responders_user_id ON goodsam_responders(user_id);
CREATE INDEX IF NOT EXISTS idx_goodsam_responders_is_verified ON goodsam_responders(is_verified);
CREATE INDEX IF NOT EXISTS idx_goodsam_responders_availability ON goodsam_responders(availability_status);

CREATE INDEX IF NOT EXISTS idx_goodsam_help_requests_requester_id ON goodsam_help_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_goodsam_help_requests_status ON goodsam_help_requests(status);
CREATE INDEX IF NOT EXISTS idx_goodsam_help_requests_urgency ON goodsam_help_requests(urgency_level);
CREATE INDEX IF NOT EXISTS idx_goodsam_help_requests_help_type ON goodsam_help_requests(help_type);
CREATE INDEX IF NOT EXISTS idx_goodsam_help_requests_created_at ON goodsam_help_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_goodsam_cases_help_request_id ON goodsam_cases(help_request_id);
CREATE INDEX IF NOT EXISTS idx_goodsam_cases_assigned_responder ON goodsam_cases(assigned_responder_id);
CREATE INDEX IF NOT EXISTS idx_goodsam_cases_status ON goodsam_cases(status);

CREATE INDEX IF NOT EXISTS idx_goodsam_case_updates_case_id ON goodsam_case_updates(case_id);
CREATE INDEX IF NOT EXISTS idx_goodsam_case_updates_created_at ON goodsam_case_updates(created_at);

CREATE INDEX IF NOT EXISTS idx_goodsam_notifications_responder_id ON goodsam_notifications(responder_id);
CREATE INDEX IF NOT EXISTS idx_goodsam_notifications_is_read ON goodsam_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_goodsam_notifications_created_at ON goodsam_notifications(created_at);

-- Update user roles to include GoodSam responders
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN (
    'applicant', 'project_officer', 'program_manager', 'finance_director', 
    'hospital_director', 'executive_director', 'ceo', 'founder', 'admin', 'responder'
));

-- Create triggers for goodsam updated_at timestamps
CREATE TRIGGER update_goodsam_responders_updated_at BEFORE UPDATE ON goodsam_responders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goodsam_help_requests_updated_at BEFORE UPDATE ON goodsam_help_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goodsam_cases_updated_at BEFORE UPDATE ON goodsam_cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('system_name', '"BGF Aid Automation System"', 'System name displayed in the UI', true),
('system_version', '"1.0.0"', 'Current system version', true),
('max_file_size', '10485760', 'Maximum file upload size in bytes (10MB)', false),
('allowed_file_types', '["pdf", "doc", "docx", "jpg", "jpeg", "png", "gif"]', 'Allowed file extensions', false),
('email_notifications', 'true', 'Enable email notifications', false),
('sms_notifications', 'false', 'Enable SMS notifications', false)
ON CONFLICT (setting_key) DO NOTHING;
