const { triggerEventReminderManually } = require("../utils/eventReminderService");

/**
 * Manual API endpoint to trigger event reminders
 * POST /api/events/reminders/trigger
 * Optional query: ?eventId=<id> to send reminders for specific event
 */
const manualTriggerReminders = async (req, res) => {
    try {
        const { eventId } = req.query;

        console.log("🔧 Manual reminder trigger initiated...");

        const result = await triggerEventReminderManually(eventId);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: `Successfully processed ${result.eventsProcessed} event(s)`,
                data: {
                    eventsProcessed: result.eventsProcessed,
                    reminderStats: result.reminderStats,
                },
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message || result.error,
            });
        }
    } catch (error) {
        console.error("Error in manual trigger reminders:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/**
 * Get reminder scheduler status and next scheduled run
 * GET /api/events/reminders/status
 */
const getReminderStatus = async (req, res) => {
    try {
        const nextRun = new Date();
        nextRun.setHours(nextRun.getHours() + 24); // Rough estimate

        return res.status(200).json({
            success: true,
            data: {
                status: "running",
                scheduledTime: process.env.EVENT_REMINDER_TIME || "0 8 * * * (8:00 AM daily)",
                message: "Event reminder scheduler is active and monitoring for upcoming events",
                note: "Reminders are sent 24 hours before event start time",
            },
        });
    } catch (error) {
        console.error("Error getting reminder status:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = {
    manualTriggerReminders,
    getReminderStatus,
};
