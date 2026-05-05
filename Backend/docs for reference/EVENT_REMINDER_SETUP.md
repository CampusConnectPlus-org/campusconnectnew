# Event Reminder System - Quick Setup Guide

## What's New?

The system now automatically sends email reminders 24 hours before events start. Two types of emails are sent:

1. **To Approved Participants**: Reminders to prepare and attend
2. **To Non-Participants**: Invitations to join as participant or audience

## Installation Steps

### 1. Install Dependencies

```bash
cd Backend
npm install node-cron
```

Or if you want to install all dependencies fresh:
```bash
npm install
```

### 2. Configure Environment Variables

Add these to your `.env` file in the Backend folder:

```env
# Email Configuration (if not already set)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Event Reminder Scheduler (optional - uses defaults if not set)
EVENT_REMINDER_TIME="0 8 * * *"
# This runs the scheduler at 8:00 AM every day
# Change to different times as needed:
# "0 9 * * *"   = 9:00 AM
# "0 20 * * *"  = 8:00 PM
# "0 */6 * * *" = Every 6 hours
```

### 3. Start the Server

```bash
npm start
# or
node server.js
```

You should see in console:
```
✅ Event Reminder Scheduler initialized
⏰ Scheduled Time: 0 8 * * * (cron expression)
📝 Will check for events 24 hours before start time daily
```

## Testing the System

### Test 1: Check Scheduler Status

```bash
curl http://localhost:5000/api/events/reminders/status
```

Expected response:
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

### Test 2: Manually Trigger Reminders

Create an event scheduled for tomorrow, then trigger reminders:

```bash
curl -X POST http://localhost:5000/api/events/reminders/trigger
```

Check your email accounts (both participant and non-participant test accounts) for reminder emails.

### Test 3: Trigger for Specific Event

```bash
curl -X POST "http://localhost:5000/api/events/reminders/trigger?eventId=<your_event_id>"
```

## Email Content Sent

### Participant Reminder Email 📧
- Event details (date, time, location)
- Preparation tips (arrive early, bring ID, etc.)
- Important guidelines (attendance tracking, photography notice)
- Calendar event attachment for easy scheduling

### Non-Participant Invitation Email 📧
- Event highlights and benefits
- Full event details
- Options to join as participant or audience
- Tips for attending
- Call-to-action to register

## Automatic Schedule

By default, the system:
- **Runs Daily at 8:00 AM** (configurable)
- **Checks for events starting in next 24 hours**
- **Sends reminders to all participants**
- **Sends invitations to all non-participants** (limited to 500 per event to avoid spam)
- **Logs all sending activity** to console

## Files Added/Modified

**New Files**:
- `utils/eventReminderEmails.js` - Email templates
- `utils/eventReminderService.js` - Core logic
- `utils/eventScheduler.js` - Scheduler setup
- `controllers/eventReminderController.js` - API endpoints
- `EVENT_REMINDER_DOCUMENTATION.md` - Full documentation

**Modified Files**:
- `routes/eventRoutes.js` - Added reminder routes
- `server.js` - Initialize scheduler on startup
- `package.json` - Added node-cron dependency

## Troubleshooting

### Reminders not sending?

1. **Check the logs**: Look for error messages mentioning scheduler or emails
2. **Verify email credentials**: Test with the existing email sending features
3. **Manual trigger test**: Run `curl -X POST http://localhost:5000/api/events/reminders/trigger` to test immediately
4. **Check MongoDB**: Ensure events and users exist in database

### Gmail-specific issues?

- Use an **App Password** (not your regular Gmail password)
- Enable **2-Factor Authentication** on your Gmail account
- Ensure your App Password is correct in `.env`

### Emails going to spam?

- They're legitimate system emails, but:
- Check spam/junk folder
- Emails may be filtered by recipients' email providers
- This is normal for automated emails

## Next Steps

1. ✅ Install node-cron: `npm install node-cron`
2. ✅ Add EMAIL_USER and EMAIL_PASS to `.env` (if not already done)
3. ✅ Start your server: `node server.js`
4. ✅ Test with manual trigger: `curl -X POST http://localhost:5000/api/events/reminders/trigger`
5. ✅ Create test events and check email delivery

## Support

For detailed information:
- See `EVENT_REMINDER_DOCUMENTATION.md` for complete documentation
- Check console logs for real-time feedback
- Monitor email accounts for delivery confirmation

---

**Note**: Emails will only be sent for:
- Events with `status: "upcoming"`
- Events scheduled to start within 24 hours
- Participants with `status: "approved"`
- Users with valid email addresses
