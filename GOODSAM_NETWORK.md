# 🕊️ GoodSam Network - Good Samaritan Help System

## Overview

The **GoodSam Network** is a complete humanitarian + faith response system integrated into the BGF Aid Platform. It's a modern, digital incarnation of the Good Samaritan parable - connecting people in distress with real helpers (pastors, counselors, nurses, volunteers) instantly, 24/7.

### Vision
When anyone in Zimbabwe needs prayer, counseling, food, or emergency aid, they can reach out instantly — and the GoodSam Network alerts real helpers nearby. No one is left unseen.

## 🏗️ System Architecture

### Three Layers of GoodSam

#### **Layer 1: Frontline Connection** 
The "Need Help Now" page - open to everyone. It's the visible face where anyone can say "I need help" and choose what kind.

#### **Layer 2: Backend Intelligence**
The engine that receives requests, stores them, and alerts responders. Powered by PostgreSQL database with real-time notifications.

#### **Layer 3: BGF Dashboard**
Inside your staff/admin portal, see:
- Incoming GoodSam requests (live)
- Who responded (pastor, elder, staff)
- Follow-up reports
- Weekly impact stats

---

## 📊 Database Schema

### Core Tables

#### `goodsam_responders`
Stores verified helpers in the network
```sql
- id: UUID (Primary Key)
- user_id: UUID (References users)
- responder_type: VARCHAR (pastor, elder, nurse, counselor, volunteer, social_worker, mental_health_provider)
- organization: VARCHAR
- is_verified: BOOLEAN
- availability_status: VARCHAR (available, busy, offline)
- specializations: JSONB (array of skills)
- completed_cases: INTEGER
```

#### `goodsam_help_requests`
Help requests from people in need
```sql
- id: UUID (Primary Key)
- requester_id: UUID (References users)
- help_type: VARCHAR (prayer, counseling, emergency_aid, medical_support, food_aid, shelter_support, financial_help, spiritual_guidance, emotional_support, other)
- urgency_level: VARCHAR (low, medium, high, critical)
- title: VARCHAR(255)
- description: TEXT
- status: VARCHAR (pending, assigned, in_progress, resolved, closed, archived)
- location_description: VARCHAR
- latitude, longitude: DECIMAL
- contact_phone: VARCHAR
- is_anonymous: BOOLEAN
- preferred_contact_method: VARCHAR (phone, email, whatsapp, in_person)
```

#### `goodsam_cases`
Tracks response and follow-up for each request
```sql
- id: UUID (Primary Key)
- help_request_id: UUID
- assigned_responder_id: UUID
- status: VARCHAR (unassigned, assigned, acknowledged, in_progress, completed, abandoned, escalated)
- outcome: VARCHAR
- is_followup_needed: BOOLEAN
- completed_at: TIMESTAMP
```

#### `goodsam_case_updates`
Log of interactions and progress
```sql
- id: UUID
- case_id: UUID
- responder_id: UUID
- update_type: VARCHAR (initial_contact, phone_call, visit, prayer_session, counseling, aid_provided, referral, escalation, completion, follow_up, other)
- message: TEXT
- created_at: TIMESTAMP
```

#### `goodsam_notifications`
Real-time alerts to responders
```sql
- id: UUID
- responder_id: UUID
- help_request_id: UUID
- notification_type: VARCHAR (new_request, assignment, urgent_alert, reassignment, system_update)
- is_read: BOOLEAN
- is_acknowledged: BOOLEAN
```

---

## 🌐 API Endpoints

### Help Request Routes

#### `POST /api/v1/goodsam/help-request`
Create a new help request
```json
{
  "help_type": "counseling",
  "urgency_level": "high",
  "title": "Need emotional support",
  "description": "Going through a difficult time...",
  "location_description": "Harare, CBD",
  "contact_phone": "+263776000000",
  "preferred_contact_method": "phone",
  "is_anonymous": false
}
```

#### `GET /api/v1/goodsam/help-requests`
List all help requests with filtering
```
?status=pending&help_type=counseling&urgency_level=critical&limit=50&offset=0
```

#### `GET /api/v1/goodsam/help-requests/:id`
Get detailed help request with case info

### Responder Routes

#### `POST /api/v1/goodsam/responders/register`
Register as a responder
```json
{
  "responder_type": "pastor",
  "organization": "Faith Church",
  "service_area": "Harare CBD",
  "bio": "Experienced in pastoral counseling",
  "specializations": ["counseling", "prayer_support"]
}
```

#### `GET /api/v1/goodsam/responders/verified`
Get all verified responders
```
?responder_type=counselor&availability_status=available
```

### Case Management Routes

#### `POST /api/v1/goodsam/cases/:caseId/acknowledge`
Responder accepts a case

#### `POST /api/v1/goodsam/cases/:caseId/updates`
Add progress update
```json
{
  "update_type": "phone_call",
  "message": "Called and provided counseling for 30 minutes"
}
```

#### `GET /api/v1/goodsam/cases/:caseId/updates`
Get case history

#### `POST /api/v1/goodsam/cases/:caseId/complete`
Mark case as complete
```json
{
  "outcome": "Person provided with counseling and emotional support",
  "is_followup_needed": true
}
```

### Notification Routes

#### `GET /api/v1/goodsam/notifications`
Get responder notifications
```
?unread_only=true
```

#### `POST /api/v1/goodsam/notifications/:notificationId/read`
Mark notification as read

### Dashboard Routes

#### `GET /api/v1/goodsam/dashboard/stats`
Get GoodSam analytics and statistics

---

## 💻 Frontend Pages

### 1. **Help Request Page** (`/goodsam`)
- **Purpose**: Main entry point for people seeking help
- **Features**:
  - 10 types of help (prayer, counseling, emergency, medical, food, shelter, financial, spiritual, emotional, other)
  - Urgency levels (low, medium, high, critical)
  - Location input
  - Anonymous option
  - Contact preferences
  - Real-time validation

### 2. **Responder Dashboard** (`/goodsam/responder-dashboard`)
- **Purpose**: Interface for pastors, counselors, nurses, volunteers
- **Features**:
  - Live notifications of new help requests
  - Case details with requester location and urgency
  - Accept/acknowledge cases
  - Add progress updates
  - View case history
  - Auto-refresh every 30 seconds

### 3. **Admin Dashboard** (`/goodsam/admin-dashboard`)
- **Purpose**: Monitoring and analytics for leadership
- **Features**:
  - Real-time KPIs (total requests, pending, active, completed)
  - Charts by help type and urgency
  - Completion rates
  - Responder count
  - Critical request alerts
  - System overview information

---

## 🚀 Setup & Deployment

### 1. Database Setup
The schema is automatically created when running:
```bash
cd backend
npm run setup-db
```

This creates all GoodSam tables with proper indexes and constraints.

### 2. Running the System

**Development:**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Production Build:**
```bash
npm run build
```

### 3. Environment Variables
Required in `.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bgf_aid_system
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## 🧠 Workflow: How GoodSam Works

### Step 1: Someone Needs Help
- Opens the app
- Navigates to `/goodsam` or clicks "Need Help Now"
- Selects help type (prayer, counseling, etc.)
- Chooses urgency level
- Provides description and contact info

### Step 2: Request Logged & Responders Alerted
- System creates help request in database
- Creates associated case (unassigned)
- **Immediately** sends notifications to 5 available responders matching the help type
- Notifications include help type, urgency, and title

### Step 3: Responders See Alerts
- Responders access `/goodsam/responder-dashboard`
- See notification badge with unread count
- Click notification to view full details
- See location, contact method, and full description

### Step 4: Responder Accepts Case
- Responder clicks "I Will Help"
- System assigns responder to case
- Case status changes to "acknowledged"
- Notification auto-refreshes

### Step 5: Interaction & Follow-up
- Responder calls, visits, or prays with person
- Adds updates to track interaction type and notes
- Can mark as completed with outcome
- System tracks completion for reporting

### Step 6: Admin Monitoring
- Leadership views `/goodsam/admin-dashboard`
- Sees live stats on all requests
- Monitors critical requests
- Reviews completion rates
- Plans follow-up support

---

## 👥 User Roles in GoodSam

| Role | What They Do | Example |
|------|-------------|---------|
| **Member/Citizen** | Sends help request | "I need prayer for my daughter's illness" |
| **Pastor/Elder** | Receives alerts, responds | Calls person, provides spiritual guidance |
| **Counselor** | Handles counseling requests | Provides emotional support via phone |
| **Nurse** | Handles medical requests | Assesses and refers to medical care |
| **Volunteer** | General responders | Helps with food aid, physical assistance |
| **BGF Staff** | Assigns, monitors, follows up | Ensures proper case management |
| **Admin/Leadership** | Views analytics and reports | Reports impact to donors, plans strategy |

---

## 🔐 Security & Privacy

✅ **Verified Responders Only**: Only approved pastors, counselors, and volunteers can respond  
✅ **Anonymous Option**: Requesters can choose anonymity  
✅ **Encrypted Data**: Phone numbers and personal info protected  
✅ **Audit Logs**: All interactions tracked for accountability  
✅ **Role-Based Access**: Each role sees only what they need  
✅ **Database Constraints**: Foreign keys ensure data integrity  

---

## 📈 Integration with BGF Aid System

**GoodSam complements the BGF Aid System:**

| Aspect | BGF Aid System | GoodSam Network |
|--------|---|---|
| Timeline | Long-term support | Immediate help |
| Process | Application forms | Real-time SOS |
| Funding | Programs & grants | Human response |
| Admin | Back-office management | Frontline compassion |
| Output | Reports to donors | Reports to heaven 🌤️ |

**Integration Points:**
- A GoodSam case can trigger a BGF aid application
- Follow-up data from GoodSam feeds into BGF reports
- Responders are managed as BGF volunteers
- Analytics combine for complete impact picture

---

## 🗂️ File Structure

```
bgf-aid-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── goodsamController.ts       ← All GoodSam business logic
│   │   ├── routes/
│   │   │   └── goodsamRoutes.ts           ← API endpoint definitions
│   │   └── server.ts                      ← Modified to include GoodSam routes
│   ├── database/
│   │   └── schema.sql                     ← Includes GoodSam tables
│   └── setup-database.js
│
├── frontend/
│   ├── src/app/goodsam/
│   │   ├── page.tsx                       ← Help request form
│   │   ├── responder-dashboard/
│   │   │   └── page.tsx                   ← Responder interface
│   │   └── admin-dashboard/
│   │       └── page.tsx                   ← Admin monitoring
│   └── src/app/layout.tsx
│
└── GOODSAM_NETWORK.md                     ← This file
```

---

## 📱 Quick Start Guide

### For Someone Seeking Help
1. Go to `http://localhost:3000/goodsam`
2. Select type of help needed
3. Set urgency level
4. Fill in description
5. Click "Send Help Request"
6. Wait for responder contact

### For a Responder
1. Register at responder registration page
2. Wait for admin verification
3. Go to `http://localhost:3000/goodsam/responder-dashboard`
4. See incoming requests in real-time
5. Click notification to view details
6. Click "I Will Help" to accept
7. Add updates as you help
8. Mark as complete

### For Admin/Leadership
1. Go to `http://localhost:3000/goodsam/admin-dashboard`
2. View real-time statistics
3. Monitor critical requests
4. Review completion rates
5. Export data for reporting

---

## 🔄 Real-World Example

**Scenario**: Sarah is going through depression and needs counseling

1. **Sarah (Requester)**: Opens app, goes to `/goodsam`
2. **Sarah**: Selects "Counseling", sets urgency to "High", describes her situation, provides phone number
3. **System**: Creates request, finds 3 verified counselors available, sends them notifications
4. **Pastor Moyo (Responder)**: Gets notification on his dashboard
5. **Moyo**: Sees Sarah's request, clicks to view details
6. **Moyo**: Clicks "I Will Help"
7. **Moyo**: Calls Sarah, provides 45 minutes of spiritual and emotional counseling
8. **Moyo**: Adds update: "Provided counseling, prayed together, referred to church support group"
9. **System**: Tracks the interaction, marks case as complete
10. **Admin**: Sees in dashboard: 1 critical request resolved, 45-min counseling session logged
11. **BGF**: Later, if Sarah needs ongoing support, can link to education or financial aid programs

---

## 🎯 Success Metrics

Monitor GoodSam effectiveness through:
- **Response Time**: How quickly responders acknowledge requests
- **Completion Rate**: % of requests that reach resolution
- **Requester Satisfaction**: Follow-up feedback scores
- **Responder Activity**: Number of cases handled per responder
- **Coverage by Type**: Which help types are most requested
- **Critical Response**: How fast critical requests are addressed
- **Follow-up Rate**: % requiring ongoing BGF support

---

## 🔧 Troubleshooting

**Problem**: Responders not receiving notifications
- **Solution**: Check `goodsam_responders` table for `is_verified = true` status
- Verify responder's `availability_status = 'available'`

**Problem**: Help requests not being created
- **Solution**: Ensure user is authenticated (has valid token)
- Check database connection and schema exists
- Verify required fields are provided

**Problem**: Dashboard showing no stats
- **Solution**: Run `GET /api/v1/goodsam/dashboard/stats`
- Check database has help requests
- Verify user has admin role

---

## 📞 Support & Development

For questions or issues:
1. Check the database schema in `backend/database/schema.sql`
2. Review controller logic in `backend/src/controllers/goodsamController.ts`
3. Check frontend pages in `frontend/src/app/goodsam/`
4. Review API responses in frontend network calls

---

## 🙏 Theological Foundation

"A lawyer stood up to test Jesus. 'Teacher,' he asked, 'what must I do to inherit eternal life?'...

Jesus replied: 'A man was going down from Jerusalem to Jericho, when he was attacked by robbers. They stripped him of his clothes, beat him and went away, leaving him half dead. A priest happened to be going down the same road, and when he saw the man, he passed by on the other side. So too, a Levite, when he came to the place and saw him, passed by on the other side. But a Samaritan, as he traveled, came where the man was; and when he saw him, he took pity on him. He went to him and bandaged his wounds, pouring on oil and wine. Then he put the man on his own donkey, brought him to an inn and took care of him.'"

**The GoodSam Network embodies this principle**: Seeing those in need, stopping to help, and following up on their recovery. In the digital age, through your BGF platform.

---

**Version**: 1.0.0  
**Created**: 2025  
**Status**: Production Ready  
**Integration**: Complete with BGF Aid System
