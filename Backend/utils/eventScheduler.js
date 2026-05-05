const cron = require("node-cron");
const { processAllEventReminders } = require("./eventReminderService");

/**
 * Initialize the event reminder scheduler
 * This will run the reminder check at 8:00 AM every day
 * Adjust the cron expression based on your timezone and preferred time
 */
const initEventReminderScheduler = () => {
    // Cron expression: "0 8 * * *" means every day at 8:00 AM
    // You can adjust this to your preference:
    // "0 9 * * *" = 9:00 AM
    // "0 20 * * *" = 8:00 PM
    // "0 */6 * * *" = Every 6 hours
    // "*/30 * * * *" = Every 30 minutes

    const REMINDER_TIME = process.env.EVENT_REMINDER_TIME || "0 8 * * *"; // Default: 8 AM daily

    try {
        const task = cron.schedule(REMINDER_TIME, async () => {
            console.log(
                `\n⏰ Event Reminder Scheduler triggered at ${new Date().toISOString()}`
            );
            await processAllEventReminders();
        });

        console.log(`✅ Event Reminder Scheduler initialized`);
        console.log(`⏰ Scheduled Time: ${REMINDER_TIME} (cron expression)`);
        console.log(`📝 Will check for events 24 hours before start time daily\n`);

        return task;
    } catch (error) {
        console.error("❌ Error initializing Event Reminder Scheduler:", error);
        return null;
    }
};

/**
 * Optional: Schedule reminder at a specific custom time
 * @param {string} cronExpression - Cron expression for when to run
 */
const scheduleCustomReminder = (cronExpression) => {
    try {
        const task = cron.schedule(cronExpression, async () => {
            console.log(
                `\n⏰ Custom Event Reminder triggered at ${new Date().toISOString()}`
            );
            await processAllEventReminders();
        });

        console.log(`✅ Custom reminder scheduled with expression: ${cronExpression}`);
        return task;
    } catch (error) {
        console.error("❌ Error scheduling custom reminder:", error);
        return null;
    }
};

/**
 * Optional: For development/testing - run reminders immediately
 */
const runReminderImmediately = async () => {
    console.log("\n🔧 Running reminders immediately (Testing)");
    await processAllEventReminders();
};

module.exports = {
    initEventReminderScheduler,
    scheduleCustomReminder,
    runReminderImmediately,
};
