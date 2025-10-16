-- BGF Aid Automation System Database Schema
-- PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM (
    'applicant',
    'project_officer', 
    'program_manager',
    'finance_director',
    'hospital_director',
    'executive_director',
    'ceo',
    'founder',
    'admin'
);

-- Application types enum
CREATE TYPE application_type AS ENUM (
    'small_grant',
    'high_school_scholarship',
    'excellence_scholarship',
    'medical_assistance'
);

-- Application status enum
CREATE TYPE application_status AS ENUM (
    'new_submission',
    'po_review',
    'po_approved',
    'po_rejected',
    'edit_requested',
    'manager_review',
    'manager_approved',
    'manager_rejected',
    'finance_review',
    'hospital_review',
    'finance_approved',
    'hospital_approved',
    'executive_review',
    'executive_approved',
    'executive_rejected',
    'ceo_review',
    'ceo_approved',
    'ceo_rejected',
    'founder_review',
    'founder_approved',
    'founder_rejected',
    'completed',
    'cancelled'
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'applicant',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
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

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(20) UNIQUE NOT NULL, -- Human readable ID like BGF-2024-001
    applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_po_id UUID REFERENCES users(id),
    type application_type NOT NULL,
    status application_status NOT NULL DEFAULT 'new_submission',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    amount_requested DECIMAL(12,2),
    amount_approved DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Personal Information
    personal_info JSONB NOT NULL DEFAULT '{}',
    
    -- Project/Need specific information
    project_details JSONB NOT NULL DEFAULT '{}',
    
    -- Supporting documents
    documents JSONB DEFAULT '[]', -- Array of document objects
    
    -- Workflow tracking
    current_reviewer_id UUID REFERENCES users(id),
    priority_level INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high, 4=urgent
    
    -- Comments and feedback
    po_comments TEXT,
    manager_comments TEXT,
    finance_comments TEXT,
    hospital_comments TEXT,
    executive_comments TEXT,
    ceo_comments TEXT,
    founder_comments TEXT,
    
    -- Dates
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    po_reviewed_at TIMESTAMP WITH TIME ZONE,
    manager_reviewed_at TIMESTAMP WITH TIME ZONE,
    finance_reviewed_at TIMESTAMP WITH TIME ZONE,
    hospital_reviewed_at TIMESTAMP WITH TIME ZONE,
    executive_reviewed_at TIMESTAMP WITH TIME ZONE,
    ceo_reviewed_at TIMESTAMP WITH TIME ZONE,
    founder_reviewed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Application logs table for audit trail
CREATE TABLE application_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    old_status application_status,
    new_status application_status,
    comments TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- M&E (Monitoring and Evaluation) table
CREATE TABLE monitoring_evaluation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    beneficiary_name VARCHAR(255) NOT NULL,
    beneficiary_contact VARCHAR(20),
    beneficiary_email VARCHAR(255),
    
    -- Fund disbursement tracking
    total_amount DECIMAL(12,2) NOT NULL,
    disbursed_amount DECIMAL(12,2) DEFAULT 0,
    remaining_amount DECIMAL(12,2) GENERATED ALWAYS AS (total_amount - disbursed_amount) STORED,
    
    -- Disbursement records
    disbursements JSONB DEFAULT '[]', -- Array of disbursement records
    
    -- Impact tracking
    impact_metrics JSONB DEFAULT '{}',
    progress_reports JSONB DEFAULT '[]', -- Array of progress report objects
    
    -- Follow-up tracking
    follow_up_schedule JSONB DEFAULT '[]',
    completed_follow_ups JSONB DEFAULT '[]',
    
    -- Medical specific (for medical assistance)
    hospital_service_details JSONB DEFAULT '{}',
    treatment_completion_date TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    completion_status VARCHAR(50) DEFAULT 'ongoing', -- ongoing, completed, cancelled
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- File uploads table
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_category VARCHAR(50), -- 'id_document', 'proof_document', 'academic_record', 'quotation', 'medical_report', etc.
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'telegram', 'system'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System settings table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- Whether this setting can be accessed by frontend
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Session management table
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_type ON applications(type);
CREATE INDEX idx_applications_assigned_po_id ON applications(assigned_po_id);
CREATE INDEX idx_applications_current_reviewer_id ON applications(current_reviewer_id);
CREATE INDEX idx_applications_created_at ON applications(created_at);
CREATE INDEX idx_application_logs_application_id ON application_logs(application_id);
CREATE INDEX idx_application_logs_user_id ON application_logs(user_id);
CREATE INDEX idx_application_logs_created_at ON application_logs(created_at);
CREATE INDEX idx_monitoring_evaluation_application_id ON monitoring_evaluation(application_id);
CREATE INDEX idx_file_uploads_application_id ON file_uploads(application_id);
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_is_sent ON notifications(is_sent);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_token ON user_sessions(session_token);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monitoring_evaluation_updated_at BEFORE UPDATE ON monitoring_evaluation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate application ID
CREATE OR REPLACE FUNCTION generate_application_id()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_part TEXT;
    next_seq INTEGER;
BEGIN
    year_part := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(application_id FROM 9 FOR 3) AS INTEGER)), 0) + 1
    INTO next_seq
    FROM applications
    WHERE application_id LIKE 'BGF-' || year_part || '-%';
    
    sequence_part := LPAD(next_seq::TEXT, 3, '0');
    
    RETURN 'BGF-' || year_part || '-' || sequence_part;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate application ID
CREATE OR REPLACE FUNCTION set_application_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_id IS NULL OR NEW.application_id = '' THEN
        NEW.application_id := generate_application_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_application_id_trigger BEFORE INSERT ON applications FOR EACH ROW EXECUTE FUNCTION set_application_id();