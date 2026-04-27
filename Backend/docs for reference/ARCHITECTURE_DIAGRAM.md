# Event Reminder System - Architecture & Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CAMPUSCONNECT+ BACKEND                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           EVENT REMINDER SYSTEM (NEW)                 │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │                                                        │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │   eventScheduler.js (node-cron)             │    │    │
│  │  │   ├─ Daily Trigger at 8 AM                  │    │    │
│  │  │   ├─ Configurable time (cron expression)    │    │    │
│  │  │   └─ Calls eventReminderService.js          │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  │                      ↓                               │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │   eventReminderService.js                    │    │    │
│  │  │   ├─ getEventsInNext24Hours()                │    │    │
│  │  │   ├─ getEventParticipants()                  │    │    │
│  │  │   ├─ getNonParticipants()                    │    │    │
│  │  │   ├─ sendEventReminderEmails()               │    │    │
│  │  │   └─ processAllEventReminders()              │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  │          ↙              ↓              ↘             │    │
│  │    (Participant)   (Queries)   (Non-Participant)    │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │   eventReminderEmails.js                    │    │    │
│  │  │   ├─ sendParticipantReminderEmail()         │    │    │
│  │  │   ├─ sendNonParticipantInvitationEmail()    │    │    │
│  │  │   ├─ sendAdminSummaryEmail()                │    │    │
│  │  │   └─ Gmail Transport (nodemailer)           │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  │                      ↓                               │    │
│  │  ┌──────────────────────────────────────────────┐    │    │
│  │  │   eventReminderController.js (API)          │    │    │
│  │  │   ├─ manualTriggerReminders()                │    │    │
│  │  │   └─ getReminderStatus()                     │    │    │
│  │  └──────────────────────────────────────────────┘    │    │
│  │                                                      │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              DATABASE MODELS (MongoDB)                │    │
│  │  ├─ Event                                             │    │
│  │  ├─ EventParticipation                               │    │
│  │  ├─ User                                              │    │
│  │  └─ (All queried for reminders)                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Processing Flow Diagram

```
START (8 AM Daily)
    ↓
[eventScheduler.js]
    ↓
[Trigger processAllEventReminders()]
    ↓
┌─────────────────────────────────────┐
│ Query Events in Next 24 Hours       │
│ Status = "upcoming"                 │
│ Date: now → now + 24 hours          │
└─────────────────────────────────────┘
    ↓
    ├─→ No Events Found → [LOG] → END
    │
    └─→ Events Found → [LOOP through each]
             ↓
        ┌──────────────────────────────┐
        │ For Each Event:              │
        ├──────────────────────────────┤
        │ 1. Query Participants        │
        │    (status = "approved")     │
        │ 2. Send Reminder Emails      │
        │ 3. Query Non-Participants    │
        │    (status ≠ "approved")     │
        │ 4. Send Invitation Emails    │
        │ 5. Record Statistics         │
        └──────────────────────────────┘
             ↓
        [STATS COLLECTION]
             ↓
    ┌─────────────────────────┐
    │ Compile Summary:        │
    │ - Total Emails Sent     │
    │ - Participants Notified │
    │ - Non-Participants Info │
    │ - Failed Emails Count   │
    └─────────────────────────┘
             ↓
    ┌─────────────────────────┐
    │ [LOG SUMMARY]           │
    │ - Print console output  │
    │ - Show statistics       │
    │ - Record timestamps     │
    └─────────────────────────┘
             ↓
           END
```

## 📧 Email Decision Tree

```
EVENT FOUND (within 24 hours)
    ↓
    ├─→ PARTICIPANTS (status = "approved")
    │   ├─→ Send: REMINDER EMAIL 📧
    │   │   ├─ Event details
    │   │   ├─ Preparation tips
    │   │   ├─ Important guidelines
    │   │   └─ Calendar attachment
    │   │
    │   ├─ Success? → [LOG] ✅
    │   └─ Failed?  → [LOG & RETRY] ❌
    │
    └─→ NON-PARTICIPANTS (all others)
        ├─→ Limit to 500 per event (spam prevention)
        │
        ├─→ Send: INVITATION EMAIL 📧
        │   ├─ Event highlights
        │   ├─ Full event details
        │   ├─ Participation options
        │   ├─ Tips for attending
        │   └─ Registration link
        │
        ├─ Success? → [LOG] ✅
        └─ Failed?  → [LOG & RETRY] ❌
```

## 🗄️ Database Query Sequence

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: Find Upcoming Events (Next 24 Hours)            │
├─────────────────────────────────────────────────────────┤
│ db.events.find({                                        │
│   date: { $gte: now, $lte: now + 24h },                │
│   status: "upcoming"                                    │
│ })                                                      │
│                                                         │
│ Returns: [Event1, Event2, ...]                          │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 2: For Each Event, Get Participants               │
├─────────────────────────────────────────────────────────┤
│ db.eventparticipations.find({                           │
│   event: eventId,                                       │
│   status: "approved"                                    │
│ }).populate('user')                                    │
│                                                         │
│ Returns: [{name, email, enrollmentNo, ...}, ...]       │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 3: Get All Non-Participants                        │
├─────────────────────────────────────────────────────────┤
│ participantIds = [participant._id for all]             │
│                                                         │
│ db.users.find({                                         │
│   _id: { $nin: participantIds }                         │
│ }).limit(500)                                          │
│                                                         │
│ Returns: [{name, email, enrollmentNo, ...}, ...]       │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ STEP 4: Send Emails & Record Statistics                │
├─────────────────────────────────────────────────────────┤
│ Results = {                                             │
│   eventId: "...",                                       │
│   participantEmailsSent: 45,                            │
│   nonParticipantEmailsSent: 500,                        │
│   failedEmails: 2,                                      │
│   timestamp: "2026-04-27T08:00:00Z"                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

## 🔌 API Endpoints Architecture

```
┌─────────────────────────────────────────────────────────┐
│             EVENT REMINDER API ENDPOINTS               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ GET /api/events/reminders/status                       │
│   └─→ eventReminderController.getReminderStatus()      │
│       └─→ Returns: { status, scheduledTime, message }  │
│                                                         │
│ POST /api/events/reminders/trigger                     │
│   └─→ eventReminderController.manualTriggerReminders() │
│       └─→ eventReminderService.triggerEventReminderManually()
│           └─→ Returns: { success, eventsProcessed }   │
│                                                         │
│ POST /api/events/reminders/trigger?eventId=<id>       │
│   └─→ (Same as above, but for specific event)         │
│       └─→ Returns: { success, reminderStats }         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📊 Data Flow for Single Event

```
Event Created Tomorrow at 3 PM
    ↓
[8 AM - NEXT DAY]
    ↓
Scheduler Triggers
    ↓
[EVENT MATCHED] ✓ (within 24 hours)
    ↓
┌─────────────────────────────┐
│ QUERY PARTICIPANTS          │
├─────────────────────────────┤
│ Filter: status="approved"   │
│ Count: 125 found            │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ SEND 125 REMINDERS          │
├─────────────────────────────┤
│ Each Email:                 │
│ ✓ Participant name          │
│ ✓ Event details             │
│ ✓ Prep tips                 │
│ ✓ Calendar attachment       │
│                             │
│ Result: 125 sent, 0 failed  │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ QUERY NON-PARTICIPANTS      │
├─────────────────────────────┤
│ Filter: NOT in participants │
│ Count: 2,850 found          │
│ Limit: 500 for spam control │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ SEND 500 INVITATIONS        │
├─────────────────────────────┤
│ Each Email:                 │
│ ✓ Student name              │
│ ✓ Event highlights          │
│ ✓ Join options              │
│ ✓ Registration link         │
│                             │
│ Result: 500 sent, 0 failed  │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ RECORD STATISTICS           │
├─────────────────────────────┤
│ Participant Reminders: 125  │
│ Non-Participant Invites: 500│
│ Failed Emails: 0            │
│ Total Sent: 625             │
│ Timestamp: 2026-04-27 08:00 │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ LOG RESULTS                 │
├─────────────────────────────┤
│ Console output with stats   │
│ Complete processing log     │
│ Success confirmation        │
└─────────────────────────────┘
```

## 🔄 Configuration & Execution Flow

```
server.js starts
    ↓
MongoDB connects
    ↓
[Initialize Event Reminder Scheduler]
    ↓
Cron expression loaded: "0 8 * * *"
    ↓
Scheduler monitoring started
    ↓
Server listens on port 5000
    ↓
┌────────────────────────────────┐
│ WAITING FOR NEXT TRIGGER TIME  │
│ (8:00 AM)                      │
└────────────────────────────────┘
    ↓
[8:00 AM arrives]
    ↓
[Event Reminder Process Runs]
    ↓
Back to monitoring...
```

## 📈 Scalability Architecture

```
Current Configuration:
- Participant Reminders: Unlimited
- Non-Participant Invites: 500/event
- Processing Speed: 2-5 sec/event
- Memory Usage: ~50MB/1000 emails

Scalability Options:
├─ Increase batch size
├─ Use job queue (Bull, RabbitMQ)
├─ Implement retry logic
├─ Add email template caching
├─ Use database indexing optimization
└─ Deploy multiple scheduler instances
```

## 🔒 Security Architecture

```
┌─────────────────────────────────┐
│  REQUEST → API Endpoint         │
├─────────────────────────────────┤
│ Validation Layer:               │
│ ├─ Input validation             │
│ ├─ Query parameter sanitization │
│ └─ Email format verification    │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│  SERVICE Layer                  │
├─────────────────────────────────┤
│ Business Logic:                 │
│ ├─ Permission checks            │
│ ├─ Data access control          │
│ └─ Error handling               │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│  DATABASE Layer                 │
├─────────────────────────────────┤
│ Data Protection:                │
│ ├─ Index on event date          │
│ ├─ Participant status check     │
│ └─ User data validation         │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│  EMAIL Layer                    │
├─────────────────────────────────┤
│ Sending Security:               │
│ ├─ .env credentials only        │
│ ├─ No logging of passwords      │
│ └─ TLS/SSL encryption           │
└─────────────────────────────────┘
```

## 📝 File Dependencies

```
server.js
├── depends on: eventScheduler.js
│   └── depends on: eventReminderService.js
│       ├── depends on: eventReminderEmails.js
│       ├── depends on: Event (model)
│       ├── depends on: EventParticipation (model)
│       └── depends on: User (model)
│
eventRoutes.js
├── depends on: eventReminderController.js
│   └── depends on: eventReminderService.js
│       └── (same as above)
```

---

**Diagram Type**: Architecture & Flow Diagrams
**Version**: 1.0
**Last Updated**: April 27, 2026
