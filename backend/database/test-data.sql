-- Test Data for BGF Aid System
-- Run this after the schema.sql to populate with sample data

-- Insert test users with different roles
-- Note: Password for all users is 'password123' (hashed with bcrypt rounds=12)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified, address, city, country) VALUES
-- Admin user
('550e8400-e29b-41d4-a716-446655440001', 'admin@bgf.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'System', 'Administrator', '+1234567890', 'admin', true, true, '123 Admin Street', 'Capital City', 'Country'),

-- Founder
('550e8400-e29b-41d4-a716-446655440002', 'founder@bgf.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'BGF', 'Founder', '+1234567891', 'founder', true, true, '456 Founder Avenue', 'Foundation City', 'Country'),

-- CEO
('550e8400-e29b-41d4-a716-446655440003', 'ceo@bgf.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'Chief', 'Executive', '+1234567892', 'ceo', true, true, '789 Executive Blvd', 'Business City', 'Country'),

-- Executive Director
('550e8400-e29b-41d4-a716-446655440004', 'executive@bgf.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'Executive', 'Director', '+1234567893', 'executive_director', true, true, '321 Director Lane', 'Leadership City', 'Country'),

-- Hospital Director
('550e8400-e29b-41d4-a716-446655440005', 'hospital@bgf.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'Hospital', 'Director', '+1234567894', 'hospital_director', true, true, '654 Hospital Road', 'Medical City', 'Country'),

-- Finance Director
('550e8400-e29b-41d4-a716-446655440006', 'finance@bgf.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'Finance', 'Director', '+1234567895', 'finance_director', true, true, '987 Finance Street', 'Money City', 'Country'),

-- Program Manager
('550e8400-e29b-41d4-a716-446655440007', 'manager@bgf.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'Program', 'Manager', '+1234567896', 'program_manager', true, true, '147 Management Ave', 'Program City', 'Country'),

-- Project Officer
('550e8400-e29b-41d4-a716-446655440008', 'officer@bgf.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'Project', 'Officer', '+1234567897', 'project_officer', true, true, '258 Officer Road', 'Projects City', 'Country'),

-- Applicants
('550e8400-e29b-41d4-a716-446655440009', 'john.doe@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'John', 'Doe', '+1234567898', 'applicant', true, true, '369 Applicant Street', 'Community City', 'Country'),

('550e8400-e29b-41d4-a716-446655440010', 'jane.smith@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'Jane', 'Smith', '+1234567899', 'applicant', true, true, '741 Community Lane', 'Village Town', 'Country'),

('550e8400-e29b-41d4-a716-446655440011', 'alice.johnson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'Alice', 'Johnson', '+1234567800', 'applicant', true, true, '852 Student Avenue', 'Education City', 'Country'),

('550e8400-e29b-41d4-a716-446655440012', 'bob.wilson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Ng3Nk4l9FJh8bPuS.', 'Bob', 'Wilson', '+1234567801', 'applicant', true, true, '963 Emergency Road', 'Crisis City', 'Country');

-- Insert sample applications with different statuses
INSERT INTO applications (id, applicant_id, title, description, type, status, amount_requested, priority_level, personal_info, project_details, assigned_po_id) VALUES
-- New submission
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', 'Community Garden Project', 'Establishing a community garden to provide fresh produce for local families in need. The project will create sustainable food sources and teach gardening skills to community members.', 'community_project', 'new_submission', 5000.00, 'medium', 
'{"full_name": "John Doe", "id_number": "ID123456789", "phone": "+1234567898", "email": "john.doe@email.com", "address": "369 Applicant Street, Community City", "emergency_contact": {"name": "Mary Doe", "phone": "+1234567802", "relationship": "Wife"}}',
'{"objective": "Create sustainable community garden", "beneficiaries": 50, "timeline": "6 months", "budget_breakdown": [{"item": "Garden tools", "cost": 1500, "description": "Shovels, hoes, watering cans"}, {"item": "Seeds and plants", "cost": 1000, "description": "Vegetable seeds and seedlings"}, {"item": "Soil and fertilizer", "cost": 1500, "description": "Organic soil and compost"}, {"item": "Water system", "cost": 1000, "description": "Irrigation setup"}]}',
'550e8400-e29b-41d4-a716-446655440008'),

-- Under PO review
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'Emergency Medical Treatment', 'Urgent medical assistance needed for life-saving surgery. The patient requires immediate financial support for a critical operation that cannot be delayed.', 'medical_aid', 'po_review', 15000.00, 'urgent',
'{"full_name": "Jane Smith", "id_number": "ID987654321", "phone": "+1234567899", "email": "jane.smith@email.com", "address": "741 Community Lane, Village Town", "emergency_contact": {"name": "Tom Smith", "phone": "+1234567803", "relationship": "Husband"}}',
'{"objective": "Fund emergency surgery", "beneficiaries": 1, "timeline": "Immediate", "budget_breakdown": [{"item": "Surgery costs", "cost": 12000, "description": "Hospital and surgeon fees"}, {"item": "Post-op care", "cost": 2000, "description": "Recovery and medication"}, {"item": "Medical supplies", "cost": 1000, "description": "Specialized equipment needed"}]}',
'550e8400-e29b-41d4-a716-446655440008'),

-- Approved application
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440011', 'High School Education Support', 'Scholarship support for completing high school education. This will help a promising student continue their studies and achieve their educational goals.', 'educational_aid', 'approved', 2000.00, 'high',
'{"full_name": "Alice Johnson", "id_number": "ID456789123", "phone": "+1234567800", "email": "alice.johnson@email.com", "address": "852 Student Avenue, Education City", "emergency_contact": {"name": "Robert Johnson", "phone": "+1234567804", "relationship": "Father"}}',
'{"objective": "Complete high school education", "beneficiaries": 1, "timeline": "12 months", "budget_breakdown": [{"item": "School fees", "cost": 1200, "description": "Tuition for final year"}, {"item": "Books and supplies", "cost": 400, "description": "Textbooks and materials"}, {"item": "Transportation", "cost": 300, "description": "Daily commute to school"}, {"item": "Examination fees", "cost": 100, "description": "Final examination costs"}]}',
'550e8400-e29b-41d4-a716-446655440008'),

-- Completed application
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440012', 'Small Business Startup', 'Starting a small local business to provide employment and services to the community. This will create jobs and stimulate local economic growth.', 'business_aid', 'completed', 8000.00, 'medium',
'{"full_name": "Bob Wilson", "id_number": "ID789123456", "phone": "+1234567801", "email": "bob.wilson@email.com", "address": "963 Emergency Road, Crisis City", "emergency_contact": {"name": "Lisa Wilson", "phone": "+1234567805", "relationship": "Sister"}}',
'{"objective": "Start small retail business", "beneficiaries": 10, "timeline": "8 months", "budget_breakdown": [{"item": "Initial inventory", "cost": 4000, "description": "Products to stock the store"}, {"item": "Equipment", "cost": 2000, "description": "Cash register, shelving, etc."}, {"item": "Store setup", "cost": 1500, "description": "Renovation and decoration"}, {"item": "Working capital", "cost": 500, "description": "Initial operating expenses"}]}',
'550e8400-e29b-41d4-a716-446655440008'),

-- Manager review stage
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440009', 'Infrastructure Development', 'Building a community center that will serve as a hub for local activities, meetings, and educational programs for residents of all ages.', 'infrastructure', 'manager_review', 25000.00, 'high',
'{"full_name": "John Doe", "id_number": "ID123456789", "phone": "+1234567898", "email": "john.doe@email.com", "address": "369 Applicant Street, Community City", "emergency_contact": {"name": "Mary Doe", "phone": "+1234567802", "relationship": "Wife"}}',
'{"objective": "Build community center", "beneficiaries": 200, "timeline": "12 months", "budget_breakdown": [{"item": "Construction materials", "cost": 18000, "description": "Building supplies and materials"}, {"item": "Labor costs", "cost": 5000, "description": "Construction workers"}, {"item": "Equipment and furniture", "cost": 1500, "description": "Tables, chairs, basic equipment"}, {"item": "Permits and fees", "cost": 500, "description": "Government permits and fees"}]}',
'550e8400-e29b-41d4-a716-446655440008');

-- Insert some application logs
INSERT INTO application_logs (id, application_id, user_id, action, old_status, new_status, comments) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', 'create', null, 'new_submission', 'Application created by applicant'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'create', null, 'new_submission', 'Urgent medical application submitted'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', 'assign', 'new_submission', 'po_review', 'Assigned to project officer for review'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440011', 'create', null, 'new_submission', 'Education support application'),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'approve', 'founder_review', 'approved', 'Excellent academic record, approved for funding');

-- Insert some notifications
INSERT INTO notifications (recipient_id, application_id, type, title, message) VALUES
('550e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440001', 'system', 'Application Submitted', 'Your application "Community Garden Project" has been submitted successfully and is now under review.'),
('550e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440002', 'system', 'Application Under Review', 'Your application "Emergency Medical Treatment" is now being reviewed by our project officer.'),
('550e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440003', 'system', 'Application Approved', 'Congratulations! Your application "High School Education Support" has been approved for funding.'),
('550e8400-e29b-41d4-a716-446655440008', null, 'system', 'New Applications to Review', 'You have 2 new applications pending your review in the BGF Aid System.');

-- Update some applications with review comments and timestamps
UPDATE applications SET 
    po_comments = 'Initial review completed. Documentation looks good, moving to manager review.',
    po_review_at = CURRENT_TIMESTAMP - INTERVAL '2 days'
WHERE id = '650e8400-e29b-41d4-a716-446655440005';

UPDATE applications SET 
    po_comments = 'Urgent case verified. Medical documentation provided. Recommending approval.',
    po_review_at = CURRENT_TIMESTAMP - INTERVAL '1 day',
    manager_comments = 'Medical emergency confirmed. Fast-track approval recommended.',
    manager_review_at = CURRENT_TIMESTAMP - INTERVAL '12 hours'
WHERE id = '650e8400-e29b-41d4-a716-446655440002';

UPDATE applications SET 
    po_comments = 'Student has excellent academic record. Strong recommendation for support.',
    po_review_at = CURRENT_TIMESTAMP - INTERVAL '5 days',
    manager_comments = 'Approved. Student shows great potential.',
    manager_review_at = CURRENT_TIMESTAMP - INTERVAL '4 days',
    founder_comments = 'Education is our priority. Approved for full amount.',
    founder_review_at = CURRENT_TIMESTAMP - INTERVAL '3 days',
    amount_approved = 2000.00,
    completed_at = CURRENT_TIMESTAMP - INTERVAL '2 days'
WHERE id = '650e8400-e29b-41d4-a716-446655440003';

UPDATE applications SET 
    po_comments = 'Business plan is solid. Good community impact potential.',
    po_review_at = CURRENT_TIMESTAMP - INTERVAL '30 days',
    manager_comments = 'Approved for pilot program.',
    manager_review_at = CURRENT_TIMESTAMP - INTERVAL '28 days',
    finance_comments = 'Budget reviewed and approved. Funds disbursed.',
    finance_review_at = CURRENT_TIMESTAMP - INTERVAL '25 days',
    amount_approved = 8000.00,
    completed_at = CURRENT_TIMESTAMP - INTERVAL '20 days'
WHERE id = '650e8400-e29b-41d4-a716-446655440004';