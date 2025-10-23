# Bibiana Staff Escalation - Chat vs Phone Calls

## Two Escalation Paths

### Path 1: CHAT ESCALATION (In-System)
Staff does NOT need to be logged in. They get **notified** and can respond.

```
User: "I need help with my application"
       ↓
Bibiana: "Let me connect you with our staff"
       ↓
[Bibiana sends alert to BGF system]
       ↓
Staff receives NOTIFICATION:
   - Email: "New escalation from John"
   - WhatsApp: "BGF Escalation: Student needs help"
   - Dashboard: Red badge showing "1 new escalation"
       ↓
Staff logs in at any time (can be hours later)
       ↓
Staff opens chat conversation with user
       ↓
Back-and-forth chat (like WhatsApp/Facebook Messenger)
       ↓
User responds when they see staff online
```

**Best for**: Non-urgent questions, follow-ups, detailed discussions

---

### Path 2: VOICE CALL ESCALATION (Phone Handoff)
Bibiana calls staff member's actual phone number or initiates voice call.

```
User: "This is urgent - I need help NOW"
       ↓
Bibiana: "Connecting you with our emergency responder"
       ↓
[Bibiana initiates phone call OR video call]
       ↓
Option A: PHONE CALL
   Staff's phone rings: +263 867 717 6485 (BGF number)
   or Staff's personal phone (if configured)
   Staff answers immediately (or missed call alerts them)
       ↓
   Real-time conversation between user and staff
       ↓

Option B: VOICE CHAT (Browser-Based)
   Staff gets browser notification
   Staff joins voice call in Staff Portal
   Real-time voice conversation
   (No phone needed - uses internet)
```

**Best for**: Emergency situations, urgent issues, immediate help needed

---

## Which Path Does Bibiana Take?

Bibiana decides based on SYSTEM PROMPT rules:

```markdown
IF user says:
   - "I need urgent help"
   - "It's an emergency"
   - "I'm in crisis"
   - "Help me NOW"
THEN → VOICE CALL (Path 2)

IF user says:
   - "I have a question"
   - "Can someone help me with..."
   - "I'm confused about..."
   - "When will I hear back?"
THEN → CHAT (Path 1)
```

---

## Implementation Details

### SCENARIO 1: Chat Escalation (Most Common)

**What Happens:**

1. **User initiates with Bibiana**
   ```
   User: "I applied for a scholarship but I don't understand the status"
   ```

2. **Bibiana recognizes it needs staff help**
   ```
   Bibiana: "This requires our team's attention. 
   Let me connect you with our education specialist."
   ```

3. **Backend API Called** (from 11Labs)
   ```
   POST /api/bibiana/escalate
   {
     user_id: "user_12345",
     user_name: "Alice Mwangi",
     user_email: "alice@email.com",
     user_phone: "+263123456789",
     issue_type: "application_status",
     conversation: "User asking about scholarship status",
     priority: "normal",
     requires_staff: true
   }
   ```

4. **Your Backend Creates Ticket**
   ```javascript
   // Backend creates in database
   const ticket = {
     id: "ESC-001",
     user: "Alice Mwangi",
     status: "open",
     assigned_to: null,
     created_at: "2024-10-21 20:58:55",
     conversation_url: "/staff/tickets/ESC-001"
   };
   ```

5. **Staff Gets Notified** (Multiple Ways)
   ```
   Email: "🔔 New escalation: Alice Mwangi needs help"
   
   WhatsApp: "BGF Alert: Alice needs help with scholarship status.
            Click to respond: bgfzim.org/staff/tickets/ESC-001"
   
   SMS: "BGF: 1 new escalation waiting. Log in to respond."
   
   Browser: Pop-up notification (if staff is on the system)
   
   Dashboard Badge: Red notification "3 escalations pending"
   ```

6. **Staff Logs In When Available**
   ```
   Staff goes to: bgfzim.org/staff
   Logs in with credentials
   Sees dashboard with "3 pending escalations"
   Clicks on Alice's ticket
   ```

7. **Chat Conversation in Staff Portal**
   ```
   Staff sees:
   ┌─────────────────────────────────────────┐
   │ Alice Mwangi - Education Scholarship    │
   │ Status: Open | Priority: Normal         │
   ├─────────────────────────────────────────┤
   │ Conversation:                           │
   │                                         │
   │ Bibiana: "Hi Alice, tell me about..."  │
   │ Alice: "I applied for scholarship..."   │
   │ Bibiana: "Let me get our specialist"   │
   │                                         │
   ├─────────────────────────────────────────┤
   │ Staff Response Area:                    │
   │ [Type your response here...]            │
   │ [Send] [Call] [Schedule Meeting]        │
   └─────────────────────────────────────────┘
   ```

8. **Staff Responds**
   ```
   Staff types: "Hi Alice, I see your application. 
   Your status is Under Review. Can you give me 
   your application reference number?"
   
   [Send]
   ```

9. **User Sees Response** (In Browser/Mobile)
   ```
   User gets notification:
   "Staff responded to your escalation"
   
   User opens app → Sees staff message
   User responds → Back-and-forth chat
   ```

10. **Resolution**
    ```
    Staff: "Your issue is resolved. Your 
    application will be reviewed by Friday."
    
    [Mark as Resolved]
    
    Ticket status changes to: "Closed"
    User gets: "Your escalation was resolved"
    ```

**Key Point**: Staff doesn't have to be logged in for the notification. They get alerts, then log in when they can.

---

### SCENARIO 2: Voice Call Escalation (Emergency)

**What Happens:**

1. **User in Crisis**
   ```
   User: "I need emergency medical help - my child is sick!"
   ```

2. **Bibiana Recognizes Emergency**
   ```
   Bibiana: "This is urgent. I'm connecting you 
   with our medical emergency team immediately."
   ```

3. **Bibiana Initiates Call**
   
   **Option A: Phone Call**
   ```
   Bibiana calls registered staff phone:
   +263 867 717 6485 (main office)
   OR +263 78 123 4567 (specific staff member)
   
   Staff hears: "BGF Emergency Escalation - 
   User needs medical help. Press 1 to accept."
   
   Staff: *presses 1*
   
   User is connected directly to staff
   Real-time conversation begins
   ```

   **Option B: Browser Voice Call**
   ```
   Staff Portal alerts: 
   "🚨 EMERGENCY CALL REQUEST - Medical Crisis"
   
   [Accept Call] [Decline]
   
   Staff clicks [Accept Call]
   
   Browser opens voice call interface
   Staff and user hear each other
   Real-time help begins
   ```

4. **During Call**
   ```
   Staff: "Tell me exactly what's happening"
   User: "My child has high fever and won't wake up"
   Staff: "We're sending an ambulance immediately.
   Where are you located?"
   
   [Call records for documentation]
   [Staff can transfer to medical specialist]
   [Location captured and sent to responder]
   ```

5. **After Call**
   ```
   Ticket auto-created:
   - Status: "Emergency Resolved"
   - Type: Medical Emergency
   - Duration: 4 min 32 sec
   - Outcome: "Ambulance dispatched"
   - Follow-up: Auto-scheduled for 24 hours
   ```

**Key Point**: Staff MUST be available to take emergency calls. Set up rotation.

---

## Configuration Needed

### For Chat Escalation:

1. **Staff Email List**
   ```
   Configure in backend:
   const STAFF_EMAILS = [
     "officer1@bgfzim.org",
     "officer2@bgfzim.org",
     "manager@bgfzim.org"
   ];
   ```

2. **Email Service** (SendGrid, AWS SES, etc.)
   ```
   Enable email notifications when ticket created
   ```

3. **WhatsApp Integration** (Optional)
   ```
   Twilio WhatsApp for mobile notifications
   ```

4. **Dashboard Notification System**
   ```
   Real-time updates when staff logs in
   WebSocket or polling for new tickets
   ```

### For Voice Call Escalation:

1. **Staff Phone Numbers**
   ```
   Configure in backend:
   const STAFF_PHONES = {
     emergency: "+263 867 717 6485",
     education: "+263 78 123 4567",
     medical: "+263 78 987 6543"
   };
   ```

2. **Call Service** (Twilio, Vonage, etc.)
   ```
   Set up VoIP integration
   Enable call routing to staff phones
   ```

3. **Browser Voice Support** (WebRTC)
   ```
   Already included with 11Labs
   Staff can answer via browser
   ```

---

## Recommended Setup

### Tier 1: Chat Escalation (Start Here)
- ✅ Easier to implement
- ✅ Staff can respond on their schedule
- ✅ Good for most questions
- ✅ Cheaper (no phone services needed)
- ✅ Works for non-emergencies

**Setup Time**: 1-2 weeks

### Tier 2: Add Voice Calls (Later)
- For emergencies (GoodSam)
- For complex issues needing real-time help
- Staff gets trained for phone support

**Setup Time**: 2-3 weeks

### Tier 3: Full Automation (Future)
- IVR (Interactive Voice Response)
- Auto-routing by issue type
- 24/7 coverage with shifts

**Setup Time**: 1-2 months

---

## Summary Table

| Feature | Chat | Voice Call |
|---------|------|-----------|
| **Staff Must Be Online** | ❌ No | ⚠️ Yes (for emergencies) |
| **Notification Method** | Email, WhatsApp, Dashboard | Phone call or browser alert |
| **Response Time** | Minutes to hours | Immediate |
| **Complexity** | Simple | Complex |
| **Cost** | Low | Medium |
| **Best For** | Questions, follow-ups | Emergencies, urgent issues |
| **User Experience** | Like WhatsApp | Like phone call |

---

## Action Items

1. **Start with Chat Escalation**
   - Create `/api/bibiana/escalate` endpoint
   - Set up email notifications
   - Add to Staff Portal dashboard

2. **Later: Add Voice Calls**
   - Set up Twilio/Vonage account
   - Configure emergency phone routing
   - Train staff on call handling

3. **Configure Bibiana System Prompt**
   - Add escalation triggers
   - Define when to use chat vs voice
   - Include staff contact info

**This gives you flexibility**: Chat for most cases, voice for emergencies. Staff gets notified either way but doesn't have to be online 24/7.
