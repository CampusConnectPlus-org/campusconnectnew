const nodemailer = require("nodemailer");
const ics = require("ics");

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "your_email@gmail.com",
        pass: process.env.EMAIL_PASS || "your_app_password",
    },
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("❌ Email Transporter Error:", error);
    } else {
        console.log("✅ Email Server is ready to send messages");
    }
});

// Send email to admin about new participation request
const sendAdminNotification = async (adminEmail, participantData, event) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || "your_email@gmail.com",
            to: adminEmail,
            subject: `Action Required: Participation Request for ${event.title}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
            <h1>New Event Participation Request</h1>
          </div>

          <div style="padding: 20px; background-color: #f8f9fa;">
            <p style="font-size: 16px; color: #333;">Dear Admin,</p>

            <p style="font-size: 14px; color: #555;">A new student is eager to join <strong>${event.title}</strong>. Please review and take appropriate action.</p>

            <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📋 Event Details:</strong></p>
              <p style="margin: 8px 0; margin-left: 15px;">Title: ${event.title}</p>
              <p style="margin: 8px 0; margin-left: 15px;">Date: ${new Date(event.date).toLocaleDateString()}</p>
              <p style="margin: 8px 0; margin-left: 15px;">Location: ${event.location}</p>
              <p style="margin: 8px 0; margin-left: 15px;">Category: ${event.category}</p>
            </div>

            <div style="background-color: white; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>👤 Participant Details:</strong></p>
              <p style="margin: 8px 0; margin-left: 15px;">Name: ${participantData.name}</p>
              <p style="margin: 8px 0; margin-left: 15px;">Enrollment No: ${participantData.enrollmentNo}</p>
              <p style="margin: 8px 0; margin-left: 15px;">Branch & Year: ${participantData.branch} (${participantData.year} year)</p>
              <p style="margin: 8px 0; margin-left: 15px;">Email: ${participantData.email}</p>
              <p style="margin: 8px 0; margin-left: 15px;">Mobile: ${participantData.mobile || 'N/A'}</p>
            </div>

            <p style="font-size: 14px; color: #555; margin-top: 20px;">
              Please log in to your admin dashboard to review and approve/reject this participation request.
            </p>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd;">
            <p>This is an automated message from the student portal. Please do not reply to this email.</p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Admin notification email sent to:", adminEmail);
        return true;
    } catch (error) {
        console.error("Error sending admin notification email:", error);
        return false;
    }
};

{/* <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
              <p style="font-size: 12px; color: #0066cc;">
                Thank you for managing event participations!
              </p>
            </div> */}

// const sendAdminNotification = async (adminEmail, participantData, eventTitle) => {
//     try {
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: adminEmail,
//             subject: `Action Required: Participation Request for ${eventTitle}`,
//             html: `
//         <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
//           <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
//             <h2>New Participation Request</h2>
//           </div>
//           <div style="padding: 24px; color: #444;">
//             <p>A student has requested to participate in <strong>${eventTitle}</strong>.</p>
//             <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f9f9f9; border-radius: 5px;">
//               <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${participantData.name}</td></tr>
//               <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Enrollment:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${participantData.enrollmentNo}</td></tr>
//               <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Branch/Year:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${participantData.branch} (${participantData.year} Year)</td></tr>
//               <tr><td style="padding: 10px;"><strong>Email:</strong></td><td style="padding: 10px;">${participantData.email}</td></tr>
//             </table>
//             <p>Please log in to the <strong>CampusConnect+ Admin Dashboard</strong> to approve or reject this request.</p>
//           </div>
//         </div>`
//         };
//         await transporter.sendMail(mailOptions);
//         return true;
//     } catch (error) { console.error(error); return false; }
// };

// Send email to user about approval
const sendApprovalEmail = async (userEmail, userName, event) => {
    // 1. Create the Calendar Event logic
    const eventDate = new Date(event.date); // Ensure this is a valid Date object
    const calendarEvent = {
        start: [eventDate.getFullYear(), eventDate.getMonth() + 1, eventDate.getDate(), 10, 0], // Default 10 AM
        duration: { hours: 2 },
        title: event.title,
        description: `Approved participation for ${event.title} at CampusConnect+`,
        location: event.location || 'To Be Announced',
        status: 'CONFIRMED',
    };

    let calendarContent = "";
    try {
        const { error, value } = ics.createEvent(calendarEvent);
        if (error) {
            console.warn("ICS calendar creation warning:", error);
        } else {
            calendarContent = value;
        }
    } catch (icsError) {
        console.warn("ICS calendar error (non-blocking):", icsError);
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || "your_email@gmail.com",
            to: userEmail,
            subject: `You're In! See you at ${event.title}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
            <h1>✓ Participation Approved</h1>
          </div>

          <div style="padding: 20px; background-color: #f8f9fa;">
            <p style="font-size: 16px; color: #333;">Hi ${userName},</p>

            <p style="font-size: 14px; color: #555;">
              Your request to join ${event.title} has been approved! We can't wait to see you there and have you be a part of the energy.
            </p>
            <p style="font-size: 14px; color: #555;">Mark your calendar:</p>

            <div style="background-color: white; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Event:</strong> ${event.title}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Venue:</strong> ${event.location || 'To Be Announced'}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">APPROVED</span></p>
            </div>

            <p> Please arrive at least 15 minutes early for timely start. Don't forget to bring your <strong>student ID</strong>.</p>

            <p style="font-size: 14px; color: #555; margin-top: 20px;">
              We look forward to seeing you at the event. If you have any questions, please feel free to contact the organizers.
            </p>

            <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
              <p style="font-size: 12px; color: #155724;">
                We've attached a calendar invite (.ics file) to this email. You can open it to add the event to your phone's calendar.
              </p>
            </div>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd;">
            <p>This is an automated message from the student portal. Please do not reply to this email.</p>
          </div>
        </div>
      `,
            attachments: calendarContent ? [
                {
                    filename: 'event-invite.ics',
                    content: calendarContent,
                    contentType: 'text/calendar',
                }
            ] : []
        };

        await transporter.sendMail(mailOptions);
        console.log("Approval email sent to:", userEmail);
        return true;
    } catch (error) {
        console.error("Error sending approval email:", error);
        return false;
    }
};

// // Send email to user about rejection
const sendRejectionEmail = async (userEmail, userName, event, message = "") => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || "your_email@gmail.com",
            to: userEmail,
            subject: `Update regarding your request for ${event.title}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center;">
            <h1>Participation Status Update</h1>
          </div>

          <div style="padding: 20px; background-color: #f8f9fa;">
            <p style="font-size: 16px; color: #333;">Hi ${userName},</p>

            <p style="font-size: 14px; color: #555;">
              Thank you for reaching out to participate in ${event.title}. After careful consideration, we regret to inform you that your participation request for this event has been rejected.
            </p>

            <div style="background-color: white; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Event:</strong> ${event.title}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">REJECTED</span></p>
              ${message ? `<p style="margin: 5px 0;"><strong>Message:</strong> ${message}</p>` : ""}
            </div>

            <p style="font-size: 14px; color: #555; margin-top: 20px;">
              You can try to participate in other upcoming events. If you believe this is an error, please contact the organizers for clarification.
            </p>

            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
              <p style="font-size: 12px; color: #721c24;">
                We hope to see you participate in future events!
              </p>
            </div>
          </div>

          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd;">
            <p>This is an automated message from the student portal. Please do not reply to this email.</p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Rejection email sent to:", userEmail);
        return true;
    } catch (error) {
        console.error("Error sending rejection email:", error);
        return false;
    }
};
// const sendApprovalEmail = async (userEmail, userName, eventTitle) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: userEmail,
//         subject: `Confirmed: Your participation for ${eventTitle}`,
//         html: `<div style="font-family: sans-serif; max-width: 600px; border: 1px solid #d4edda;">
//             <div style="background: #28a745; color: white; padding: 20px;"><h2>Registration Confirmed!</h2></div>
//             <div style="padding: 20px;">
//                 <p>Hello ${userName},</p>
//                 <p>Your request to join <strong>${eventTitle}</strong> has been approved by the admin.</p>
//                 <p>Please keep this email for your records. We look forward to seeing you there!</p>
//             </div>
//         </div>`
//     };
//     await transporter.sendMail(mailOptions);
// };

// const sendRejectionEmail = async (userEmail, userName, eventTitle, message = "") => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: userEmail,
//         subject: `Update: Participation Request for ${eventTitle}`,
//         html: `<div style="font-family: sans-serif; max-width: 600px; border: 1px solid #f8d7da;">
//             <div style="background: #dc3545; color: white; padding: 20px;"><h2>Participation Update</h2></div>
//             <div style="padding: 20px;">
//                 <p>Hello ${userName},</p>
//                 <p>We are sorry to inform you that your request for <strong>${eventTitle}</strong> could not be approved at this time.</p>
//                 ${message ? `<div style="padding: 15px; background: #fff5f5; border-left: 4px solid #dc3545; margin: 10px 0;"><strong>Reason:</strong> ${message}</div>` : ""}
//                 <p>Feel free to apply for other upcoming events on the platform.</p>
//             </div>
//         </div>`
//     };
//     await transporter.sendMail(mailOptions);
// };

module.exports = {
    sendAdminNotification,
    sendApprovalEmail,
    sendRejectionEmail,
};
