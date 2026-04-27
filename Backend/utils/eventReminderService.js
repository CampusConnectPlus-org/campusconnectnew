const Event = require("../models/Event");
const EventParticipation = require("../models/EventParticipation");
const User = require("../models/User");
const Admin = require("../models/Admin");
const {
    sendParticipantReminderEmail,
    sendNonParticipantInvitationEmail,
    sendAdminSummaryEmail,
} = require("./eventReminderEmails");

/**
 * Get all events starting in the next 24 hours
 */
const getEventsInNext24Hours = async () => {
    try {
        const now = new Date();
        const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const events = await Event.find({
            date: {
                $gte: now,
                $lte: next24Hours,
            },
            status: "upcoming", // Only upcoming events
        });

        return events;
    } catch (error) {
        console.error("Error fetching events in next 24 hours:", error);
        return [];
    }
};

/**
 * Get all participants for an event (approved only)
 */
const getEventParticipants = async (eventId) => {
    try {
        const participants = await EventParticipation.find({
            event: eventId,
            status: "approved", // Only approved participants
        });

        return participants;
    } catch (error) {
        console.error(`Error fetching participants for event ${eventId}:`, error);
        return [];
    }
};

/**
 * Get all non-participants (excludes only approved participants)
 * Excludes by email address to avoid duplicates
 * @param {string} eventId - The event ID
 * @param {array} approvedParticipantEmails - Array of approved participant emails to exclude
 */
const getNonParticipants = async (eventId, approvedParticipantEmails = []) => {
    try {
        // Get all users except those with emails in the approved participants list
        const nonParticipants = await User.find({
            email: { $nin: approvedParticipantEmails },
        });

        return nonParticipants;
    } catch (error) {
        console.error(`Error fetching non-participants for event ${eventId}:`, error);
        return [];
    }
};

/**
 * Send reminder emails for a specific event
 */
const sendEventReminderEmails = async (event) => {
    console.log(`\n📧 Processing reminders for event: ${event.title}`);

    const stats = {
        eventId: event._id,
        eventTitle: event.title,
        participantEmailsSent: 0,
        nonParticipantEmailsSent: 0,
        failedEmails: 0,
        timestamp: new Date(),
    };

    try {
        // Get participants
        const participants = await getEventParticipants(event._id);
        console.log(`👥 Found ${participants.length} approved participants`);

        // Prepare event data object to pass to email functions
        const eventDataToSend = {
            title: event.title,
            date: event.date,
            location: event.location,
            category: event.category,
            description: event.description,
            bannerImage: event.bannerImage,
            details: event.details || { highlights: [] },
        };

        // Send emails to participants
        const participantEmailResults = await Promise.all(
            participants.map((participant) =>
                sendParticipantReminderEmail(participant.email, participant.name, eventDataToSend)
            )
        );

        // Count successful participant emails
        const successfulParticipantEmails = participantEmailResults.filter((r) => r.success);
        stats.participantEmailsSent = successfulParticipantEmails.length;
        stats.failedEmails += participantEmailResults.filter((r) => !r.success).length;

        console.log(
            `✅ Sent ${stats.participantEmailsSent} participant reminder emails`
        );

        // Extract emails of approved participants to exclude them from invitations
        const approvedParticipantEmails = participants.map((p) => p.email);
        console.log(`📧 Approved participant emails to exclude: ${approvedParticipantEmails.join(", ")}`);

        // Get non-participants (excluding approved participants by email)
        const nonParticipants = await getNonParticipants(event._id, approvedParticipantEmails);
        console.log(`👥 Found ${nonParticipants.length} non-participating students`);

        // Send emails to non-participants (limit to reasonable number to avoid spam)
        // You can adjust this threshold based on your needs
        const maxNonParticipantEmails = 500; // Limit to 500 students per event
        const nonParticipantsToEmail = nonParticipants.slice(0, maxNonParticipantEmails);

        const nonParticipantEmailResults = await Promise.all(
            nonParticipantsToEmail.map((student) =>
                sendNonParticipantInvitationEmail(student.email, student.name, eventDataToSend)
            )
        );

        // Count successful non-participant emails
        const successfulNonParticipantEmails = nonParticipantEmailResults.filter(
            (r) => r.success
        );
        stats.nonParticipantEmailsSent = successfulNonParticipantEmails.length;
        stats.failedEmails += nonParticipantEmailResults.filter((r) => !r.success).length;

        console.log(
            `✅ Sent ${stats.nonParticipantEmailsSent} non-participant invitation emails`
        );

        // Log any failed emails with reasons
        const failedParticipantEmails = participantEmailResults.filter((r) => !r.success);
        if (failedParticipantEmails.length > 0) {
            console.warn(`⚠️ Failed participant emails: ${failedParticipantEmails.length}`);
            failedParticipantEmails.forEach((failed) => {
                console.warn(`   - ${failed.email}: ${failed.error}`);
            });
        }

        const failedNonParticipantEmails = nonParticipantEmailResults.filter((r) => !r.success);
        if (failedNonParticipantEmails.length > 0) {
            console.warn(`⚠️ Failed non-participant emails: ${failedNonParticipantEmails.length}`);
            failedNonParticipantEmails.forEach((failed) => {
                console.warn(`   - ${failed.email}: ${failed.error}`);
            });
        }

        if (nonParticipants.length > maxNonParticipantEmails) {
            console.log(
                `⚠️ Limited invitations sent. Total non-participants: ${nonParticipants.length}`
            );
        }

        // Log summary
        console.log(`\n📊 Email Summary for ${event.title}:`);
        console.log(`   ✓ Participant Reminders: ${stats.participantEmailsSent}`);
        console.log(`   ✓ Non-Participant Invitations: ${stats.nonParticipantEmailsSent}`);
        console.log(
            `   ✗ Failed Emails: ${stats.failedEmails}`
        );
        console.log(
            `   📧 Total Emails Sent: ${stats.participantEmailsSent + stats.nonParticipantEmailsSent}`
        );

        // NEW: Trigger Admin Summary Email
        console.log(`\n📤 Sending summary report to admin: ${adminEmail}`);

        const admins = await Admin.find();
        for (const admin of admins) {
            await sendAdminSummaryEmail(adminEmail, eventDataToSend, {
                participantEmailsSent: stats.participantEmailsSent,
                nonParticipantEmailsSent: stats.nonParticipantEmailsSent,
                failedEmails: stats.failedEmails
            });
        }

        return stats;
    } catch (error) {
        console.error(`❌ Error processing event reminders for ${event.title}:`, error);
        stats.failedEmails = -1; // Indicate critical error
        return stats;
    }
};

/**
 * Process all events in next 24 hours and send reminders
 */
const processAllEventReminders = async () => {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 Starting Event Reminder Processing");
    console.log("=".repeat(60));
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

    try {
        // Get events in next 24 hours
        const upcomingEvents = await getEventsInNext24Hours();
        console.log(`\n📅 Found ${upcomingEvents.length} events in next 24 hours\n`);

        if (upcomingEvents.length === 0) {
            console.log("ℹ️  No events found for tomorrow. Skipping reminder process.");
            console.log("=".repeat(60) + "\n");
            return { success: true, eventsProcessed: 0, reminderStats: [] };
        }

        // Process each event
        const allStats = [];
        for (const event of upcomingEvents) {
            const stats = await sendEventReminderEmails(event);
            allStats.push(stats);
        }

        console.log("\n" + "=".repeat(60));
        console.log("✅ Event Reminder Processing Complete");
        console.log("=".repeat(60));
        console.log(`📊 Events Processed: ${upcomingEvents.length}`);
        console.log(
            `📧 Total Emails Sent: ${allStats.reduce(
                (sum, s) => sum + s.participantEmailsSent + s.nonParticipantEmailsSent,
                0
            )}`
        );
        console.log("=".repeat(60) + "\n");

        return { success: true, eventsProcessed: upcomingEvents.length, reminderStats: allStats };
    } catch (error) {
        console.error("❌ Critical error in event reminder processing:", error);
        console.log("=".repeat(60) + "\n");
        return { success: false, error: error.message, eventsProcessed: 0, reminderStats: [] };
    }
};

/**
 * Manual trigger function for testing (can be called via API if needed)
 */
const triggerEventReminderManually = async (eventId = null) => {
    try {
        let events;

        if (eventId) {
            // Get specific event
            const event = await Event.findById(eventId);
            if (!event) {
                return { success: false, message: "Event not found" };
            }
            events = [event];
        } else {
            // Get all events in next 24 hours
            events = await getEventsInNext24Hours();
        }

        console.log(`\n🔧 Manual Event Reminder Trigger - Processing ${events.length} event(s)`);

        const allStats = [];
        for (const event of events) {
            const stats = await sendEventReminderEmails(event);
            allStats.push(stats);
        }

        return { success: true, eventsProcessed: events.length, reminderStats: allStats };
    } catch (error) {
        console.error("❌ Error in manual event reminder trigger:", error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getEventsInNext24Hours,
    getEventParticipants,
    getNonParticipants,
    sendEventReminderEmails,
    processAllEventReminders,
    triggerEventReminderManually,
};
