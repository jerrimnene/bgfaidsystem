-- BGF Aid Management System - Demo Data Seeding
-- Clear existing data first (optional - comment out if you want to keep existing data)
TRUNCATE TABLE application_logs, applications, users CASCADE;

-- Insert demo users with properly hashed passwords
-- Note: Using a simple hash for demo - in production use proper bcrypt
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active) VALUES
-- Admin user
(uuid_generate_v4(), 'admin@bgf.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'System', 'Admin', '+263777000001', 'admin', true),

-- Management users
(uuid_generate_v4(), 'project.officer@bgf.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'John', 'Smith', '+263777000002', 'project_officer', true),
(uuid_generate_v4(), 'program.manager@bgf.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'Sarah', 'Johnson', '+263777000003', 'program_manager', true),
(uuid_generate_v4(), 'finance.director@bgf.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'Michael', 'Brown', '+263777000004', 'finance_director', true),
(uuid_generate_v4(), 'hospital.director@bgf.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'Dr. Lisa', 'Williams', '+263777000005', 'hospital_director', true),
(uuid_generate_v4(), 'executive.director@bgf.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'David', 'Taylor', '+263777000006', 'executive_director', true),
(uuid_generate_v4(), 'ceo@bgf.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'Jennifer', 'Anderson', '+263777000007', 'ceo', true),

-- Founders
(uuid_generate_v4(), 'founder.male@bgf.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'Robert', 'Davis', '+263777000008', 'founder', true),
(uuid_generate_v4(), 'founder.female@bgf.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'Mary', 'Wilson', '+263777000009', 'founder', true),

-- Test applicants
(uuid_generate_v4(), 'applicant1@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'Grace', 'Mukamuri', '+263777100001', 'applicant', true),
(uuid_generate_v4(), 'applicant2@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'Tadiwa', 'Chikwanha', '+263777100002', 'applicant', true),
(uuid_generate_v4(), 'applicant3@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewbOZYKu0YvR7U5u', 'Tendai', 'Moyo', '+263777100003', 'applicant', true);

-- Insert some sample applications for testing workflow
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
) VALUES
(
  uuid_generate_v4(),
  (SELECT id FROM users WHERE email = 'applicant1@test.com'),
  'high_school_scholarship',
  'High School Education Support',
  'Request for financial assistance to complete my final year of high school',
  800.00,
  'USD',
  '{"age": 17, "grade": "Form 4", "school": "Chisipite Senior School"}',
  '{"academic_performance": "Grade A average", "financial_need": "Family unable to afford fees", "career_goals": "Medicine"}',
  'new_submission',
  1
),
(
  uuid_generate_v4(),
  (SELECT id FROM users WHERE email = 'applicant2@test.com'),
  'medical_assistance',
  'Emergency Surgery Assistance',
  'Urgent medical assistance needed for heart surgery',
  2500.00,
  'USD',
  '{"age": 45, "condition": "Heart disease", "hospital": "Arundel Hospital"}',
  '{"medical_details": "Requires urgent cardiac surgery", "family_situation": "Single mother of 3", "unable_to_pay": "Lost job due to illness"}',
  'po_review',
  3
),
(
  uuid_generate_v4(),
  (SELECT id FROM users WHERE email = 'applicant3@test.com'),
  'small_grant',
  'Community Garden Project',
  'Small grant for starting a vegetable garden to feed orphans',
  150.00,
  'USD',
  '{"community": "Epworth", "beneficiaries": 25, "organization": "Epworth Community Trust"}',
  '{"project_scope": "Growing vegetables for orphanage", "sustainability": "Training community members", "impact": "Feed 25 orphans daily"}',
  'manager_review',
  2
);

-- Assign Project Officer to applications
UPDATE applications 
SET assigned_po_id = (SELECT id FROM users WHERE role = 'project_officer' LIMIT 1)
WHERE status IN ('po_review', 'edit_requested');

-- Insert some application logs for workflow history
INSERT INTO application_logs (application_id, user_id, action, old_status, new_status, comments) VALUES
(
  (SELECT id FROM applications WHERE title = 'Emergency Surgery Assistance'),
  (SELECT id FROM users WHERE email = 'applicant2@test.com'),
  'submit',
  '',
  'new_submission',
  'Initial application submission'
),
(
  (SELECT id FROM applications WHERE title = 'Emergency Surgery Assistance'),
  (SELECT id FROM users WHERE role = 'project_officer' LIMIT 1),
  'review',
  'new_submission',
  'po_review',
  'Application looks good, forwarding for manager review'
);

-- Insert some system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('org_name', '"Bridging Gap Foundation"', 'Organization name', true),
('org_email', '"info@bridginggapfoundation.org"', 'Contact email', true),
('org_phone', '"+263123456789"', 'Contact phone', true),
('max_application_amount', '5000', 'Maximum application amount in USD', false),
('application_deadline', '"2024-12-31"', 'Application deadline', true);

-- Success message
SELECT 'Demo data seeded successfully!' as result;
SELECT COUNT(*) || ' users created' as users FROM users;
SELECT COUNT(*) || ' applications created' as applications FROM applications;