-- BGF Aid Automation System - Database Seed Data
-- Run this after schema.sql to populate with initial data

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('app_name', '"BGF Aid Automation System"', 'Application name displayed in UI', true),
('org_name', '"Bridging Gap Foundation"', 'Organization full name', true),
('org_abbreviation', '"BGF"', 'Organization abbreviation', true),
('org_email', '"info@bridginggapfoundation.org"', 'Organization contact email', true),
('org_phone', '"+263123456789"', 'Organization contact phone', true),
('org_address', '"Harare, Zimbabwe"', 'Organization address', true),
('application_types', '[
  {
    "key": "small_grant",
    "label": "Small Grant",
    "description": "Community-based initiatives",
    "max_amount": 5000,
    "currency": "USD",
    "required_documents": ["id_document", "project_proposal", "budget_breakdown"]
  },
  {
    "key": "high_school_scholarship",
    "label": "High School Scholarship", 
    "description": "Secondary education funding",
    "max_amount": 2000,
    "currency": "USD",
    "required_documents": ["id_document", "academic_records", "school_admission"]
  },
  {
    "key": "excellence_scholarship",
    "label": "Excellence Scholarship",
    "description": "Tertiary education funding for outstanding students",
    "max_amount": 10000,
    "currency": "USD", 
    "required_documents": ["id_document", "academic_records", "admission_letter", "recommendation_letter"]
  },
  {
    "key": "medical_assistance",
    "label": "Medical Assistance",
    "description": "Healthcare support via Arundel Hospital",
    "max_amount": 15000,
    "currency": "USD",
    "required_documents": ["id_document", "medical_report", "doctor_recommendation", "cost_estimate"]
  }
]', 'Available application types and their configurations', true),
('workflow_settings', '{
  "auto_assign_po": true,
  "notification_delays": {
    "immediate": 0,
    "reminder_1": 3,
    "reminder_2": 7,
    "escalation": 14
  },
  "approval_thresholds": {
    "small_grant": 1000,
    "scholarship": 5000,
    "medical": 10000
  }
}', 'Workflow configuration settings', false),
('notification_templates', '{
  "welcome_message": "Welcome to BGF Aid System. Your application journey starts here.",
  "approval_message": "Congratulations! Your application has been approved.",
  "rejection_message": "Thank you for your application. Unfortunately, it was not approved at this time.",
  "reminder_message": "This is a reminder about your pending application review."
}', 'Notification message templates', false),
('supported_languages', '[
  {"code": "en", "name": "English", "native": "English"},
  {"code": "sn", "name": "Shona", "native": "chiShona"}, 
  {"code": "nd", "name": "Ndebele", "native": "isiNdebele"}
]', 'Supported system languages', true);

-- Insert default admin user
-- Password: BGF@Admin2024! (hashed with bcrypt)
INSERT INTO users (
  id,
  email, 
  password_hash,
  first_name,
  last_name,
  phone,
  role,
  is_active,
  email_verified,
  preferred_language,
  address,
  city,
  country
) VALUES (
  uuid_generate_v4(),
  'admin@bridginggapfoundation.org',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6', -- BGF@Admin2024!
  'System',
  'Administrator', 
  '+263123456789',
  'admin',
  true,
  true,
  'en',
  'Harare',
  'Harare',
  'Zimbabwe'
);

-- Insert founders (Mr. & Mrs. Tangire)
INSERT INTO users (
  id,
  email,
  password_hash, 
  first_name,
  last_name,
  phone,
  role,
  is_active,
  email_verified,
  preferred_language
) VALUES 
(
  uuid_generate_v4(),
  'founder1@bridginggapfoundation.org',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6', -- BGF@Admin2024!
  'Mr.',
  'Tangire',
  '+263123456790',
  'founder',
  true,
  true,
  'en'
),
(
  uuid_generate_v4(),
  'founder2@bridginggapfoundation.org', 
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6', -- BGF@Admin2024!
  'Mrs.',
  'Tangire',
  '+263123456791',
  'founder',
  true,
  true,
  'en'
);

-- Insert sample staff users
INSERT INTO users (
  id,
  email,
  password_hash,
  first_name, 
  last_name,
  phone,
  role,
  is_active,
  email_verified,
  preferred_language
) VALUES
-- CEO
(
  uuid_generate_v4(),
  'ceo@bridginggapfoundation.org',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6',
  'James',
  'Makamba',
  '+263123456792',
  'ceo',
  true,
  true,
  'en'
),
-- Executive Director
(
  uuid_generate_v4(),
  'executive@bridginggapfoundation.org',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6',
  'Sarah',
  'Moyo',
  '+263123456793',
  'executive_director',
  true,
  true,
  'en'
),
-- Finance Director
(
  uuid_generate_v4(),
  'finance@bridginggapfoundation.org',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6',
  'Michael',
  'Chikwanha',
  '+263123456794',
  'finance_director',
  true,
  true,
  'en'
),
-- Hospital Director
(
  uuid_generate_v4(),
  'hospital@bridginggapfoundation.org',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6',
  'Dr. Grace',
  'Mukamuri',
  '+263123456795',
  'hospital_director',
  true,
  true,
  'en'
),
-- Program Manager
(
  uuid_generate_v4(),
  'manager@bridginggapfoundation.org',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6',
  'Patricia',
  'Ndoro',
  '+263123456796',
  'program_manager',
  true,
  true,
  'en'
),
-- Project Officers
(
  uuid_generate_v4(),
  'po1@bridginggapfoundation.org',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6',
  'Tendai',
  'Chiwenga',
  '+263123456797',
  'project_officer',
  true,
  true,
  'en'
),
(
  uuid_generate_v4(),
  'po2@bridginggapfoundation.org',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6',
  'Chipo',
  'Mubvumbi',
  '+263123456798',
  'project_officer',
  true,
  true,
  'en'
);

-- Insert sample applicants for testing
INSERT INTO users (
  id,
  email,
  password_hash,
  first_name,
  last_name,
  phone,
  role,
  is_active,
  email_verified,
  preferred_language,
  address,
  city,
  country
) VALUES
(
  uuid_generate_v4(),
  'applicant1@example.com',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6', -- password123
  'Takudzwa',
  'Mukamuri',
  '+263123456800',
  'applicant',
  true,
  true,
  'en',
  '123 Borrowdale Road',
  'Harare',
  'Zimbabwe'
),
(
  uuid_generate_v4(),
  'applicant2@example.com',
  '$2a$12$LQv3c1yqBwHNf9mKqOZPcOx8zPn0VflN3QHJkB3Hn3p2.yR5zDCW6', -- password123
  'Rudo',
  'Ncube',
  '+263123456801',
  'applicant',
  true,
  true,
  'sn',
  '456 Mbare Township',
  'Harare', 
  'Zimbabwe'
);

-- Create sample applications for demonstration
DO $$
DECLARE
    applicant1_id UUID;
    applicant2_id UUID;
    po1_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO applicant1_id FROM users WHERE email = 'applicant1@example.com';
    SELECT id INTO applicant2_id FROM users WHERE email = 'applicant2@example.com';
    SELECT id INTO po1_id FROM users WHERE email = 'po1@bridginggapfoundation.org';
    
    -- Insert sample small grant application
    INSERT INTO applications (
        id,
        applicant_id,
        assigned_po_id,
        type,
        title,
        description,
        amount_requested,
        currency,
        personal_info,
        project_details,
        status,
        priority_level
    ) VALUES (
        uuid_generate_v4(),
        applicant1_id,
        po1_id,
        'small_grant',
        'Community Borehole Project',
        'A project to install a borehole to provide clean water access to 500 families in Chitungwiza community.',
        3500.00,
        'USD',
        '{"age": 35, "gender": "male", "occupation": "Community Leader", "education": "Diploma", "dependents": 3}',
        '{"beneficiaries": 500, "location": "Chitungwiza", "duration_months": 6, "sustainability_plan": "Community committee will manage maintenance", "expected_outcomes": ["Clean water access", "Reduced waterborne diseases", "Time savings for women and children"]}',
        'po_review',
        2
    );
    
    -- Insert sample scholarship application
    INSERT INTO applications (
        id,
        applicant_id,
        type,
        title,
        description,
        amount_requested,
        currency,
        personal_info,
        project_details,
        status,
        priority_level
    ) VALUES (
        uuid_generate_v4(),
        applicant2_id,
        'excellence_scholarship',
        'Computer Science Degree Scholarship',
        'Request for financial assistance to pursue a Bachelor of Science in Computer Science at the University of Zimbabwe.',
        8000.00,
        'USD',
        '{"age": 19, "gender": "female", "education_level": "A-Level", "grades": "5 As", "family_income": "low"}',
        '{"university": "University of Zimbabwe", "program": "BSc Computer Science", "duration_years": 4, "career_goals": "Software developer to contribute to Zimbabwe tech industry", "academic_achievements": ["Valedictorian", "Mathematics Olympiad Gold Medal", "Science Fair Winner"]}',
        'new_submission',
        3
    );
END $$;

-- Insert initial notification templates  
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('email_templates', '{
  "application_submitted": {
    "subject": "Application Submitted - {{APPLICATION_ID}}",
    "body": "Dear {{APPLICANT_NAME}}, your {{APPLICATION_TYPE}} application has been submitted successfully."
  },
  "status_update": {
    "subject": "Application Status Update - {{APPLICATION_ID}}",
    "body": "Your application status has been updated to: {{NEW_STATUS}}"
  },
  "approval_notification": {
    "subject": "Application Approved - {{APPLICATION_ID}}",
    "body": "Congratulations! Your application for {{APPLICATION_TITLE}} has been approved."
  }
}', 'Email notification templates', false);

-- Log the seeding completion
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('database_seeded', '"true"', 'Indicates if initial seed data has been loaded', false),
('seed_version', '"1.0.0"', 'Version of the seed data', false),
('seed_date', '"' || CURRENT_TIMESTAMP || '"', 'Date when seed data was loaded', false);

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '✅ Database seeding completed successfully!';
    RAISE NOTICE '👤 Default admin user: admin@bridginggapfoundation.org';
    RAISE NOTICE '🔑 Default password: BGF@Admin2024!';
    RAISE NOTICE '📊 Sample data includes: % users, % applications, % settings',
        (SELECT COUNT(*) FROM users),
        (SELECT COUNT(*) FROM applications),
        (SELECT COUNT(*) FROM system_settings);
END $$;