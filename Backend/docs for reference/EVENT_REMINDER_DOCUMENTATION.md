# Event Reminder Email System - Documentation

## Overview

The Event Reminder Email System automatically sends targeted email reminders to students 24 hours before an event starts. The system sends **different emails based on participation status**:

- **Participant Reminders**: For approved participants - reminds them to prepare and attend
- **Non-Participant Invitations**: For non-participants - invites them to join as participants or audience members

## How It Works

### Automatic Processing
- **Scheduled Check**: Runs daily at 8:00 AM (configurable via `EVENT_REMINDER_TIME` environment variable)
- **Event Detection**: Identifies all events scheduled to start in the next 24 hours
- **Participant Segmentation**: Automatically separates participants from non-participants
- **Email Dispatch**: Sends tailored emails to both groups simultaneously

### Processing Flow
```
Daily Scheduler (8 AM)
    ↓
Find Events in Next 24 Hours
    ↓
├─→ Get Approved Participants → Send Reminder Emails
│
└─→ Get Non-Participants → Send Invitation Emails

Email Results → Logged with Success/Failure Status
```

## Email Types & Content

### 1. Participant Reminder Email 📧

**Sent To**: Students with `approved` status in EventParticipation

**Subject**: 🎯 Reminder: Your Event Starts Tomorrow - [Event Title]

**Content Includes**:
- Warm greeting with participant's name
- Event title, date, time, location
- Event category
- Event description
- **Preparation Tips**:
  - Arrive 15 minutes early
  - Bring student ID card
  - Check weather and dress appropriately
  - Prepare notepad and pen
  - Charge phone and bring required materials
- **Important Information**:
  - Attendance will be marked
  - Instructions to notify if cannot attend
  - Code of conduct reminders
  - Photography/recording notice
- Calendar event attachment (ICS file)
- Visual hierarchy with gradient headers and color-coded sections

### 2. Non-Participant Invitation Email 📧

**Sent To**: All registered students who are NOT approved participants

**Subject**: 🎉 You're Invited! Join Us for [Event Title] Tomorrow

**Content Includes**:
- Friendly greeting with student's name
- Invitation message highlighting the opportunity
- **Event Highlights**:
  - Learning opportunity
  - Networking benefits
  - Talent showcase opportunity
  - Prizes and recognition
- Event details (name, date/time, location, category, description)
- **Participation Options**:
  - Join as a participant (active role)
  - Join as audience member (spectator role)
- **Quick Tips**:
  - Register/Confirm ASAP
  - Bring student ID
  - Arrive on time
  - Bring notepad if interested in notes
  - Share on social media with #CampusConnect
- Professional design with invitation-style formatting
- Call-to-action button directing to registration portal

### 3. Email Features (Both Types)

**Design Elements**:
- Responsive HTML templates
- Gradient headers with event-specific color schemes
- Color-coded sections for better scannability
- Professional footer with branding
- Clear visual hierarchy
- Mobile-friendly formatting

**Attachments**:
- Calendar invitation (ICS) file for participants
- One-click add-to-calendar functionality

**Metadata**:
- Timestamp of email send
- Event details preservation
- User information recording
- Success/failure tracking

## Email Content Information

### Included Information

#### Event Details
- **Event Title**: The name of the event
- **Date & Time**: Formatted date and time of event
- **Location**: Venue or location details
- **Category**: Event type (technical, cultural, fest, sports, workshop, etc.)
- **Description**: Full event description if available
- **Banner Image**: Reference if available

#### Participant Information (in reminders)
- Student name
- Enrollment number
- Year and branch
- Contact email
- Mobile number (if available)

#### Participant Information (in invitations)
- Student name
- Options for joining (participant/audience)
- Invitation emphasis

#### Additional Context
- Time until event
- Preparation guidelines
- Behavioral expectations
- What to bring
- What to expect

## Configuration

### Environment Variables

Add to your `.env` file:

```env
# Email Configuration (already required for emailService)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Event Reminder Scheduler Configuration
EVENT_REMINDER_TIME="0 8 * * *"  # Cron expression for daily 8 AM check
# Examples:
# "0 9 * * *"     = 9:00 AM daily
# "0 20 * * *"    = 8:00 PM daily  
# "0 */6 * * *"   = Every 6 hours
# "*/30 * * * *"  = Every 30 minutes
```

### Cron Expression Format

Standard cron format: `[minute] [hour] [day] [month] [day-of-week]`

- `*` = any value
- `0 8 * * *` = 08:00, every day
- `0 8 * * 1-5` = 08:00, Monday-Friday
- `0 */3 * * *` = Every 3 hours
- `30 9 * * *` = 09:30, every day

## API Endpoints

### 1. Manual Trigger Reminders

**Endpoint**: `POST /api/events/reminders/trigger`

**Purpose**: Manually trigger reminder emails (useful for testing or immediate sends)

**Query Parameters**:
- `eventId` (optional): Send reminders for specific event only

**Examples**:
```bash
# Trigger for all events in next 24 hours
curl -X POST http://localhost:5000/api/events/reminders/trigger

# Trigger for specific event
curl -X POST http://localhost:5000/api/events/reminders/trigger?eventId=<event_id>
```

**Response**:
```json
{
  "success": true,
  "message": "Successfully processed 1 event(s)",
  "data": {
    "eventsProcessed": 1,
    "reminderStats": [
      {
        "eventId": "...",
        "eventTitle": "Tech Conference 2026",
        "participantEmailsSent": 45,
        "nonParticipantEmailsSent": 320,
        "failedEmails": 2,
        "timestamp": "2026-04-27T10:30:00.000Z"
      }
    ]
  }
}
```

### 2. Get Scheduler Status

**Endpoint**: `GET /api/events/reminders/status`

**Purpose**: Check if scheduler is running and get configuration details

**Response**:
```json
{
  "success": true,
  "data": {
    "status": "running",
    "scheduledTime": "0 8 * * * (8:00 AM daily)",
    "message": "Event reminder scheduler is active and monitoring for upcoming events",
    "note": "Reminders are sent 24 hours before event start time"
  }
}
```

## Database Queries

The system uses the following database queries:

### Find Events in Next 24 Hours
```javascript
Event.find({
  date: { $gte: now, $lte: next24Hours },
  status: "upcoming"
})
```

### Get Approved Participants
```javascript
EventParticipation.find({
  event: eventId,
  status: "approved"
})
```

### Get Non-Participants
```javascript
// Gets all users who are NOT approved participants
User.find({
  _id: { $nin: [list of participant user IDs] }
})
```

## Email Limits

- **Non-Participant Emails**: Limited to 500 per event to avoid spam
- **Participant Emails**: All approved participants receive emails
- **Retry Logic**: Failed emails are logged but not automatically retried

## Logging

### Console Logs
The system provides detailed console logging:

```
🚀 Starting Event Reminder Processing
⏰ Timestamp: 2026-04-27T08:00:00.000Z
📅 Found 3 events in next 24 hours

📧 Processing reminders for event: Tech Conference
👥 Found 45 approved participants
✅ Sent 45 participant reminder emails
👥 Found 1250 non-participating students
✅ Sent 500 non-participant invitation emails
⚠️ Limited invitations sent. Total non-participants: 1250

📊 Email Summary for Tech Conference:
   ✓ Participant Reminders: 45
   ✓ Non-Participant Invitations: 500
   ✗ Failed Emails: 2
   📧 Total Emails Sent: 545

✅ Event Reminder Processing Complete
📊 Events Processed: 3
📧 Total Emails Sent: 1547
```

## Error Handling

### Common Issues

1. **No events found in next 24 hours**
   - System logs and skips processing
   - No emails sent

2. **Failed email delivery**
   - Individual failures are logged with email address
   - Processing continues for other recipients
   - Admin notified of failures

3. **Database connection issues**
   - Scheduler waits for connection
   - Logs critical errors
   - Retries on next scheduled run

4. **Invalid email addresses**
   - Skipped automatically
   - Logged with details

## Testing

### Manual Testing

1. **Create a test event** scheduled for tomorrow
2. **Manually trigger reminders**:
   ```bash
   curl -X POST http://localhost:5000/api/events/reminders/trigger?eventId=<test_event_id>
   ```
3. **Check email accounts** for both participant and non-participant test users
4. **Verify email content** matches expectations

### Monitoring

- Monitor console logs during scheduler runs
- Check email delivery logs
- Track failed email counts
- Monitor system resources during sending

## Security Considerations

1. **Email Validation**: Invalid emails are skipped
2. **Rate Limiting**: Non-participants limited to 500 per event
3. **Access Control**: Manual trigger endpoint can be protected with authentication
4. **Data Privacy**: Personal information only sent to relevant recipients
5. **Logging**: All sends logged for audit trail

## Performance Notes

- **Processing Time**: ~2-5 seconds per event (varies with participant count)
- **Memory**: Minimal (~50MB for 1000 emails)
- **Database Load**: Light queries with proper indexing
- **Email API Load**: Distributed over sending period

## Future Enhancements

Potential improvements:
- [ ] SMS reminders as alternative
- [ ] Multiple reminder waves (7 days, 3 days, 24 hours)
- [ ] WhatsApp notifications (already have Twilio setup)
- [ ] Email preference management
- [ ] Analytics dashboard for email metrics
- [ ] Personalized recommendations for non-participants
- [ ] Integration with calendar systems (Google Calendar, Outlook)
- [ ] A/B testing for email templates
- [ ] Attendance tracking post-event

## Troubleshooting

### Reminders Not Sending

1. **Check scheduler status**:
   ```bash
   curl http://localhost:5000/api/events/reminders/status
   ```

2. **Check environment variables** in `.env`:
   - `EMAIL_USER` and `EMAIL_PASS` configured
   - `EVENT_REMINDER_TIME` in valid cron format

3. **Check MongoDB connection**: Verify events and users exist in database

4. **Check email service**: Verify Gmail app password is correct

5. **Manual trigger test**:
   ```bash
   curl -X POST http://localhost:5000/api/events/reminders/trigger
   ```

### Emails Not Received

1. Check spam/junk folder
2. Verify email addresses in database
3. Check Gmail sending limits (Gmail allows ~500 emails/day per account)
4. Review console logs for specific errors

## Files Created

```
Backend/
├── utils/
│   ├── eventReminderEmails.js      # Email templates
│   ├── eventReminderService.js     # Core reminder logic
│   └── eventScheduler.js           # Cron scheduler setup
├── controllers/
│   └── eventReminderController.js  # API endpoints
└── routes/
    └── eventRoutes.js              # Added reminder routes
```

## Dependencies Added

- `node-cron: ^3.0.3` - Task scheduler
