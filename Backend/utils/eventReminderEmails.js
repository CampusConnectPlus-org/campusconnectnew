const nodemailer = require("nodemailer");

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "your_email@gmail.com",
        pass: process.env.EMAIL_PASS || "your_app_password",
    },
});

/**
 * Email template for approved participants reminder
 * Reminds them to prepare and attend the event
 */
const sendParticipantReminderEmail = async (participantEmail, participantName, eventDetails) => {
    try {
        // Validate event data before sending
        const validation = validateEventData(eventDetails);
        if (!validation.isValid) {
            console.error(
                `❌ Cannot send email - missing: ${validation.missing.join(", ")}. Event: ${eventDetails.title || "Unknown"}`
            );
            return { success: false, email: participantEmail, error: `Missing event data: ${validation.missing.join(", ")}` };
        }

        const eventDate = new Date(eventDetails.date);
        const formattedDate = eventDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        // const formattedTime = eventDate.toLocaleTimeString("en-US", {
        //     hour: "2-digit",
        //     minute: "2-digit",
        // });
        const formattedTime = "10:00 AM";

        const mailOptions = {
            from: process.env.EMAIL_USER || "your_email@gmail.com",
            to: participantEmail,
            subject: `🎯 Reminder: Your Event Starts Tomorrow - ${eventDetails.title}`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎯 Event Starting Tomorrow!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Get ready for an amazing experience</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi ${participantName},</p>

            <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              We're excited to remind you that <strong>${eventDetails.title}</strong> is happening <strong>tomorrow</strong>! 
              As an approved participant, please ensure you're prepared and ready to make the most of this experience.
            </p>

            <!-- Event Details Card -->
            <div style="background-color: #f8f9fa; border-left: 5px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333; font-size: 16px;">📋 Event Details</h3>
              
              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555;">
                  <strong>📅 Date & Time:</strong><br/>
                  ${formattedDate} at ${formattedTime}
                </p>
              </div>

              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555;">
                  <strong>📍 Location:</strong><br/>
                  ${eventDetails.location || "To be announced"}
                </p>
              </div>

              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555;">
                  <strong>🏷️ Category:</strong><br/>
                  ${eventDetails.category || "General"}
                </p>
              </div>

              ${eventDetails.description ? `
              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555;">
                  <strong>📝 Description:</strong><br/>
                  ${eventDetails.description}
                </p>
              </div>
              ` : ""}
            </div>

            <!-- Preparation Tips -->
            <div style="background-color: #e8f4f8; border-left: 5px solid #06b6d4; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333; font-size: 16px;">✅ Preparation Tips</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #555; line-height: 1.8;">
                <li>Review the event description and agenda if available</li>
                <li>Arrive <strong>15 minutes early</strong> to your assigned location</li>
                <li>Bring your <strong>student ID card</strong> (mandatory)</li>
                <li>Check the weather and dress appropriately</li>
                <li>Have pen and notepad ready for any discussions or takeaways</li>
                <li>Charge your phone and bring any required materials</li>
              </ul>
            </div>

            <!-- Important Information -->
            <div style="background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #856404; font-size: 16px;">⚠️ Important Information</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #856404; line-height: 1.8;">
                <li>Attendance will be marked as part of event participation</li>
                <li>Please notify the organizers in advance if you cannot attend</li>
                <li>Be respectful and follow the event guidelines</li>
                <li>Photography/recording may take place during the event</li>
              </ul>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 25px 0;">
              <p style="font-size: 14px; color: #999; margin-bottom: 15px;">
                Questions? Check the event portal or contact the organizers
              </p>
            </div>

            <p style="font-size: 15px; color: #555; margin-top: 25px;">
              We look forward to seeing you tomorrow. Make it a great event! 🚀
            </p>

            <p style="font-size: 14px; color: #999; margin-top: 20px;">
              Best regards,<br/>
              <strong>CampusConnect+ Event Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
            <p style="margin: 0;">This is an automated reminder from the student portal</p>
            <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Participant reminder email sent to: ${participantEmail}`);
        return { success: true, email: participantEmail };
    } catch (error) {
        console.error(`❌ Error sending participant reminder email to ${participantEmail}:`, error);
        return { success: false, email: participantEmail, error: error.message };
    }
};

/**
 * Validate required event data before sending emails
 */
const validateEventData = (eventDetails) => {
    const required = {
        title: "Event title",
        date: "Event date",
        location: "Event location",
    };

    const missing = [];
    for (const [key, label] of Object.entries(required)) {
        if (!eventDetails[key]) {
            missing.push(label);
        }
    }

    if (missing.length > 0) {
        console.warn(`⚠️ Event has missing data: ${missing.join(", ")}`);
        return { isValid: false, missing };
    }

    return { isValid: true, missing: [] };
};

/**
 * Email template for non-participants invitation
 * Invites them to join as audience or participate if possible
 */
const sendNonParticipantInvitationEmail = async (studentEmail, studentName, eventDetails) => {
    try {
        // Validate event data before sending
        const validation = validateEventData(eventDetails);
        if (!validation.isValid) {
            console.error(
                `❌ Cannot send email - missing: ${validation.missing.join(", ")}. Event: ${eventDetails.title || "Unknown"}`
            );
            return { success: false, email: studentEmail, error: `Missing event data: ${validation.missing.join(", ")}` };
        }

        const eventDate = new Date(eventDetails.date);
        const formattedDate = eventDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        // const formattedTime = eventDate.toLocaleTimeString("en-US", {
        //     hour: "2-digit",
        //     minute: "2-digit",
        // });
        const formattedTime = "10:00 AM";

        const mailOptions = {
            from: process.env.EMAIL_USER || "your_email@gmail.com",
            to: studentEmail,
            subject: `🎉 You're Invited! Join Us for ${eventDetails.title} Tomorrow`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 You're Invited!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Join an exciting event happening tomorrow</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi ${studentName},</p>

            <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              We noticed you haven't registered for <strong>${eventDetails.title}</strong> happening <strong>tomorrow</strong>. 
              This is an amazing opportunity to learn, network, and have fun! We'd love to have you join us, either as a participant or as an audience member.
            </p>

            <!-- Event Highlights -->
            <div style="background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%); padding: 20px; margin: 25px 0; border-radius: 8px; color: white;">
              <h3 style="margin-top: 0; font-size: 18px;">✨ Event Highlights</h3>
              <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                ${eventDetails.details?.highlights && eventDetails.details.highlights.length > 0
                    ? eventDetails.details.highlights
                        .map((highlight) => `<li>🌟 ${highlight}</li>`)
                        .join("")
                    : `<li>💡 Gain valuable knowledge and skills</li>
                <li>🤝 Network with peers and professionals</li>
                <li>🏆 Opportunity to showcase your talents</li>
                <li>🎁 Exciting prizes and recognition</li>`}
              </ul>
            </div>

            <!-- Event Details Card -->
            <div style="background-color: #f8f9fa; border-left: 5px solid #f5576c; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333; font-size: 16px;">📋 Event Details</h3>
              
              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555;">
                  <strong>🎯 Event Name:</strong><br/>
                  ${eventDetails.title}
                </p>
              </div>

              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555;">
                  <strong>📅 Date & Time:</strong><br/>
                  ${formattedDate} at ${formattedTime}
                </p>
              </div>

              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555;">
                  <strong>📍 Location:</strong><br/>
                  ${eventDetails.location || "To be announced"}
                </p>
              </div>

              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555;">
                  <strong>🏷️ Category:</strong><br/>
                  ${eventDetails.category || "General"}
                </p>
              </div>

              ${eventDetails.description ? `
              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555;">
                  <strong>📝 Description:</strong><br/>
                  ${eventDetails.description}
                </p>
              </div>
              ` : ""}
            </div>

            <!-- Participation Options -->
            <div style="background-color: #d1e7dd; border-left: 5px solid #198754; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333; font-size: 16px;">🎯 Join Us As:</h3>
              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555; line-height: 1.8;">
                  <strong>Participant:</strong> Actively take part and compete/contribute to the event<br/>
                  <strong>Audience Member:</strong> Support and enjoy the event as a spectator
                </p>
              </div>
              <p style="font-size: 14px; color: #555; margin: 15px 0 0 0;">
                Either way, we'd love to have you there! Both roles are equally valuable.
              </p>
            </div>

            <!-- Quick Tips for Attendees -->
            <div style="background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #856404; font-size: 16px;">📌 Quick Tips</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #856404; line-height: 1.8;">
                <li>Register/Confirm your attendance as soon as possible</li>
                <li>Bring your student ID card</li>
                <li>Arrive on time to avoid missing important moments</li>
                <li>Bring a notepad and pen if you're interested in taking notes</li>
                <li>Share your experience with friends using #CampusConnect</li>
              </ul>
            </div>

            <!-- CTA Section -->
            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 15px; color: #333; margin-bottom: 15px;">
                <strong>Ready to join us?</strong>
              </p>
              <p style="font-size: 14px; color: #666; margin: 0;">
                Visit the CampusConnect+ portal to register or RSVP for the event now!
              </p>
            </div>

            <p style="font-size: 15px; color: #555; margin-top: 25px;">
              Looking forward to seeing you tomorrow. It's going to be an unforgettable event! 🌟
            </p>

            <p style="font-size: 14px; color: #999; margin-top: 20px;">
              Best regards,<br/>
              <strong>CampusConnect+ Event Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
            <p style="margin: 0;">This is an automated invitation from the student portal</p>
            <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Non-participant invitation email sent to: ${studentEmail}`);
        return { success: true, email: studentEmail };
    } catch (error) {
        console.error(`❌ Error sending non-participant invitation email to ${studentEmail}:`, error);
        return { success: false, email: studentEmail, error: error.message };
    }
};

/**
 * Email summary for admins about reminder emails sent
 */
const sendAdminSummaryEmail = async (adminEmail, eventDetails, reminderStats) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || "your_email@gmail.com",
            to: adminEmail,
            subject: `📊 Event Reminder Summary - ${eventDetails.title}`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
  
  <div style="background: linear-gradient(135deg, #003d82 0%, #001f41 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">📊 Reminder Summary</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Automated notification status report</p>
  </div>

  <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    
    <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi Admin,</p>

    <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
      The automated reminder system has finished processing emails for <strong>${eventDetails.title}</strong> scheduled for tomorrow.
    </p>

    <div style="background-color: #f8f9fa; border-left: 5px solid #003d82; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #333; font-size: 16px;">📅 Event Details</h3>
      <div style="margin: 10px 0;">
        <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Title:</strong> ${eventDetails.title}</p>
        <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()}</p>
        <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Location:</strong> ${eventDetails.location}</p>
      </div>
    </div>

    <div style="background-color: #f0fff4; border-left: 5px solid #28a745; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #333; font-size: 16px;">📧 Delivery Statistics</h3>
      <div style="margin: 10px 0;">
        <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Participant Reminders:</strong> ${reminderStats.participantEmailsSent}</p>
        <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Non-Participant Invitations:</strong> ${reminderStats.nonParticipantEmailsSent}</p>
        <hr style="border: 0; border-top: 1px solid #c3e6cb; margin: 10px 0;">
        <p style="margin: 5px 0; color: #155724; font-size: 14px;"><strong>Total Emails Sent:</strong> <strong>${reminderStats.participantEmailsSent + reminderStats.nonParticipantEmailsSent}</strong></p>
      </div>
    </div>

    ${reminderStats.failedEmails > 0 ? `
    <div style="background-color: #fff5f5; border-left: 5px solid #dc3545; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #dc3545; font-size: 16px;">⚠️ Issues Detected</h3>
      <p style="margin: 5px 0; color: #721c24; font-size: 14px;"><strong>Failed Emails:</strong> ${reminderStats.failedEmails}</p>
      <p style="margin: 5px 0; color: #721c24; font-size: 13px; opacity: 0.8;">Please review the server logs to identify invalid addresses or delivery failures.</p>
    </div>
    ` : ""}

    <p style="font-size: 15px; color: #555; margin-top: 25px;">
      All eligible students in the database have been notified accordingly.
    </p>

    <p style="font-size: 14px; color: #999; margin-top: 30px;">
      Best regards,<br/>
      <strong>CampusConnect+ Admin Portal</strong>
    </p>
  </div>

  <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
    <p style="margin: 0;">This is an automated system report from the admin portal</p>
    <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
  </div>
</div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Admin summary email sent to: ${adminEmail}`);
        return true;
    } catch (error) {
        console.error(`❌ Error sending admin summary email:`, error);
        return false;
    }
};

module.exports = {
    sendParticipantReminderEmail,
    sendNonParticipantInvitationEmail,
    sendAdminSummaryEmail,
    validateEventData,
};
