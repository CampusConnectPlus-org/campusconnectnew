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
      subject: `📌 Action Required: Participation Request for ${event.title}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
  
  <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">📑 New Request</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Event Participation Application</p>
  </div>

  <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    
    <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Dear Admin,</p>

    <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
      A new student has submitted a request to join <strong>${event.title}</strong>. Please review the details below and take the necessary action through the admin dashboard.
    </p>

    <div style="background-color: #f8f9fa; border-left: 5px solid #007bff; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #333; font-size: 16px;">📋 Event Summary</h3>
      
      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>🎯 Title:</strong><br/>
          ${event.title}
        </p>
      </div>

      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>📅 Date:</strong><br/>
          ${new Date(event.date).toLocaleDateString()}
        </p>
      </div>

      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>📍 Location:</strong><br/>
          ${event.location || 'To Be Announced'}
        </p>
      </div>

      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>🏷️ Category:</strong><br/>
          ${event.category}
        </p>
      </div>
    </div>

    <div style="background-color: #f8f9fa; border-left: 5px solid #0056b3; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #333; font-size: 16px;">👤 Participant Profile</h3>
      
      <div style="margin: 10px 0;">
        <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Name:</strong> ${participantData.name}</p>
        <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Enrollment No:</strong> ${participantData.enrollmentNo}</p>
        <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Branch/Year:</strong> ${participantData.branch} (${participantData.year} year)</p>
        <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Email:</strong> ${participantData.email}</p>
        <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Mobile:</strong> ${participantData.mobile || 'N/A'}</p>
      </div>
    </div>

    <div style="background-color: #e8f4f8; border-left: 5px solid #17a2b8; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <p style="font-size: 14px; color: #0c5460; margin: 0;">
        ⚡ <strong>Required Action:</strong> Please log in to the <strong>CampusConnect+ Admin Portal</strong> to approve or reject this application.
      </p>
    </div>

    <p style="font-size: 14px; color: #999; margin-top: 30px;">
      Best regards,<br/>
      <strong>CampusConnect+ Admin Portal</strong>
    </p>
  </div>

  <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
    <p style="margin: 0;">This is an automated notification from the admin portal. Please do not reply to this email.</p>
    <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
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
      subject: `✅ You're In! See you at ${event.title}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
  
  <div style="background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">✅ Participation Approved!</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">You're officially on the list for this event</p>
  </div>

  <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    
    <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi ${userName},</p>

    <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
      Great news! Your request to join <strong>${event.title}</strong> has been approved. We can't wait to see you there and have you be a part of the energy.
    </p>

    <div style="background-color: #f8f9fa; border-left: 5px solid #28a745; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #333; font-size: 16px;">📅 Event Schedule</h3>
      
      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>🎯 Event:</strong><br/>
          ${event.title}
        </p>
      </div>

      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>📅 Date:</strong><br/>
          ${new Date(event.date).toLocaleDateString()}
        </p>
      </div>

      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>📍 Venue:</strong><br/>
          ${event.location || 'To Be Announced'}
        </p>
      </div>

      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>🏷️ Status:</strong><br/>
          <span style="color: #28a745; font-weight: bold; font-size: 14px;">APPROVED</span>
        </p>
      </div>
    </div>

    <div style="background-color: #e8f4f8; border-left: 5px solid #06b6d4; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #333; font-size: 16px;">📌 Quick Instructions</h3>
      <ul style="margin: 10px 0; padding-left: 20px; color: #555; line-height: 1.8;">
        <li>Please arrive at least <strong>15 minutes early</strong> for a timely start.</li>
        <li>Don't forget to bring your <strong>student ID card</strong>.</li>
        <li>Keep this email handy for reference on the event day.</li>
      </ul>
    </div>

    <div style="background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <p style="font-size: 13px; color: #856404; margin: 0;">
        🗓️ <strong>Calendar Sync:</strong> We've attached a calendar invite (.ics file) to this email. Open it to automatically add this event to your phone's calendar.
      </p>
    </div>

    <p style="font-size: 15px; color: #555; margin-top: 25px;">
      If you have any questions, please feel free to check the portal or contact the organizers.
    </p>

    <p style="font-size: 14px; color: #999; margin-top: 20px;">
      Best regards,<br/>
      <strong>CampusConnect+ Event Team</strong>
    </p>
  </div>

  <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
    <p style="margin: 0;">This is an automated message from the student portal. Please do not reply to this email.</p>
    <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
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
      subject: `🆕 Update regarding your request for ${event.title}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
  
  <div style="background: linear-gradient(135deg, #ed4264 0%, #dc3545 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">📩 Status Update</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Regarding your participation request</p>
  </div>

  <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    
    <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Hi ${userName},</p>

    <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
      Thank you for your interest in <strong>${event.title}</strong>. After careful consideration of all applications, we regret to inform you that your participation request has been declined at this time.
    </p>

    <div style="background-color: #f8f9fa; border-left: 5px solid #dc3545; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #333; font-size: 16px;">📋 Request Summary</h3>
      
      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>🎯 Event Name:</strong><br/>
          ${event.title}
        </p>
      </div>

      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>📅 Event Date:</strong><br/>
          ${new Date(event.date).toLocaleDateString()}
        </p>
      </div>

      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>🏷️ Status:</strong><br/>
          <span style="color: #dc3545; font-weight: bold; font-size: 14px;">NOT APPROVED</span>
        </p>
      </div>

      ${message ? `
      <div style="margin: 15px 0;">
        <p style="margin: 8px 0; color: #555;">
          <strong>📝 Organizer's Note:</strong><br/>
          ${message}
        </p>
      </div>
      ` : ""}
    </div>

    <div style="background-color: #fff3cd; border-left: 5px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #856404; font-size: 16px;">💡 Next Steps</h3>
      <p style="font-size: 14px; color: #856404; line-height: 1.6; margin: 5px 0;">
        Don't let this discourage you! Many other events are opening for registration soon. We encourage you to keep an eye on the portal for other opportunities that match your interests.
      </p>
    </div>

    <p style="font-size: 15px; color: #555; margin-top: 25px;">
      If you believe this decision was made in error or would like specific feedback, please reach out to the event organizers via the help desk.
    </p>

    <p style="font-size: 14px; color: #999; margin-top: 20px;">
      Best regards,<br/>
      <strong>CampusConnect+ Event Team</strong>
    </p>
  </div>

  <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
    <p style="margin: 0;">This is an automated message from the student portal. Please do not reply to this email.</p>
    <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
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

// Send email to participant on club membership approval
const sendClubMembershipApprovalEmail = async (participantEmail, participantName, clubName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@gmail.com",
      to: participantEmail,
      subject: `🎉 Welcome to ${clubName}! Your Membership is Approved`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Membership Approved</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Welcome to ${clubName}</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Dear ${participantName},</p>

            <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Congratulations! Your membership application for <strong>${clubName}</strong> has been approved by the club administrators.
            </p>

            <div style="background-color: #d4edda; border-left: 5px solid #28a745; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #155724; font-size: 16px;">✅ You are now a member!</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #155724; line-height: 1.8;">
                <li>Access exclusive club events and activities</li>
                <li>Connect with fellow club members</li>
                <li>Participate in club discussions and projects</li>
              </ul>
            </div>

            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Best regards,<br/>
              <strong>CampusConnect+ Club Management</strong>
            </p>
          </div>
          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
              <p style="margin: 0;">This is an automated message from the student portal. Please do not reply to this email.</p>
              <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending club membership approval email:", error);
    return false;
  }
};

// Send email to participant on club membership rejection
const sendClubMembershipRejectionEmail = async (participantEmail, participantName, clubName, rejectionMessage = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@gmail.com",
      to: participantEmail,
      subject: `Club Membership Application - ${clubName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">📋 Application Update</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${clubName} Membership</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Dear ${participantName},</p>

            <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for your interest in joining <strong>${clubName}</strong>. Unfortunately, your membership application could not be approved at this time.
            </p>

            ${rejectionMessage ? `
            <div style="background-color: #fff5f5; border-left: 5px solid #dc3545; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #721c24; font-size: 16px;">Feedback:</h3>
              <p style="margin: 0; color: #721c24; font-size: 14px;">${rejectionMessage}</p>
            </div>
            ` : ''}

            <div style="background-color: #e7f3ff; border-left: 5px solid #0066cc; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <p style="font-size: 14px; color: #003d99; margin: 0;">
                💡 You can explore other clubs and apply again in future cycles. Don't hesitate to reach out if you have questions about your application.
              </p>
            </div>

            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Best regards,<br/>
              <strong>CampusConnect+ Club Management</strong>
            </p>
          </div>
          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
              <p style="margin: 0;">This is an automated message from the student portal. Please do not reply to this email.</p>
              <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending club membership rejection email:", error);
    return false;
  }
};

// Send email to admin on new club membership request
const sendAdminClubMembershipNotification = async (adminEmail, applicantData, clubName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@gmail.com",
      to: adminEmail,
      subject: `📌 New Membership Request for ${clubName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">📋 New Request</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${clubName} Membership</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Dear Admin,</p>

            <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              A new student has applied to join <strong>${clubName}</strong>. Please review their details below.
            </p>

            <div style="background-color: #f8f9fa; border-left: 5px solid #007bff; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333; font-size: 16px;">👤 Applicant Profile</h3>
              <div style="margin: 10px 0;">
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Name:</strong> ${applicantData.firstName} ${applicantData.lastName}</p>
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Enrollment No:</strong> ${applicantData.enrollmentNo}</p>
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Branch/Year:</strong> ${applicantData.branch} (${applicantData.collegeYear} year)</p>
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Email:</strong> ${applicantData.email}</p>
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Mobile:</strong> ${applicantData.mobile || 'N/A'}</p>
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Hobby:</strong> ${applicantData.hobby || 'N/A'}</p>
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>How can contribute:</strong> ${applicantData.contribution || 'N/A'}</p>
              </div>
            </div>

            <div style="background-color: #e8f4f8; border-left: 5px solid #17a2b8; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <p style="font-size: 14px; color: #0c5460; margin: 0;">
                ⚡ <strong>Required Action:</strong> Log in to the <strong>CampusConnect+ Admin Portal</strong> to approve or reject this application.
              </p>
            </div>

            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Best regards,<br/>
              <strong>CampusConnect+ Admin Portal</strong>
            </p>
          </div>
          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
    <p style="margin: 0;">This is an automated message from the admin portal. Please do not reply to this email.</p>
    <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
  </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending admin club membership notification:", error);
    return false;
  }
};

// Send email to participant on event participation approval
const sendEventParticipationApprovalEmail = async (participantEmail, participantName, eventTitle, eventDate) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@gmail.com",
      to: participantEmail,
      subject: `✅ Event Participation Approved - ${eventTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">✅ Approved</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${eventTitle}</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Dear ${participantName},</p>

            <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Great news! Your participation request for <strong>${eventTitle}</strong> has been approved.
            </p>

            <div style="background-color: #d4edda; border-left: 5px solid #28a745; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #155724; font-size: 16px;">📅 Event Details</h3>
              <p style="margin: 8px 0; color: #155724; font-size: 14px;"><strong>Event:</strong> ${eventTitle}</p>
              <p style="margin: 8px 0; color: #155724; font-size: 14px;"><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
              <p style="margin: 8px 0; color: #155724; font-size: 14px;">Arrive 15 minutes early and bring your student ID.</p>
            </div>

            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Best regards,<br/>
              <strong>CampusConnect+ Club Management</strong>
            </p>
          </div>
          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
              <p style="margin: 0;">This is an automated message from the student portal. Please do not reply to this email.</p>
              <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending event participation approval email:", error);
    return false;
  }
};

// Send email to participant on event participation rejection
const sendEventParticipationRejectionEmail = async (participantEmail, participantName, eventTitle, rejectionMessage = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@gmail.com",
      to: participantEmail,
      subject: `Event Participation Request - ${eventTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">📋 Application Update</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${eventTitle}</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Dear ${participantName},</p>

            <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for your interest in <strong>${eventTitle}</strong>. Unfortunately, your participation request could not be approved.
            </p>

            ${rejectionMessage ? `
            <div style="background-color: #fff5f5; border-left: 5px solid #dc3545; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #721c24; font-size: 16px;">Reason:</h3>
              <p style="margin: 0; color: #721c24; font-size: 14px;">${rejectionMessage}</p>
            </div>
            ` : ''}

            <div style="background-color: #e7f3ff; border-left: 5px solid #0066cc; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <p style="font-size: 14px; color: #003d99; margin: 0;">
                💡 Check back for other upcoming events. You cannot re-apply for this same event.
              </p>
            </div>

            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Best regards,<br/>
              <strong>CampusConnect+ Club Management</strong>
            </p>
          </div>
          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
              <p style="margin: 0;">This is an automated message from the student portal. Please do not reply to this email.</p>
              <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending event participation rejection email:", error);
    return false;
  }
};

// Send email to admin on new event participation request
const sendAdminEventParticipationNotification = async (adminEmail, participantData, eventTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@gmail.com",
      to: adminEmail,
      subject: `📌 New Event Participation Request - ${eventTitle}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">📋 New Request</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${eventTitle}</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Dear Admin,</p>

            <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              A new student has applied to participate in <strong>${eventTitle}</strong>. Please review their details below.
            </p>

            <div style="background-color: #f8f9fa; border-left: 5px solid #007bff; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333; font-size: 16px;">👤 Applicant Profile</h3>
              <div style="margin: 10px 0;">
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Name:</strong> ${participantData.firstName} ${participantData.lastName}</p>
                <!-- <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Enrollment No:</strong> ${participantData.enrollmentNo}</p> -->
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Branch/Year:</strong> ${participantData.branch} (${participantData.collegeYear} year)</p>
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Email:</strong> ${participantData.email}</p>
                <p style="margin: 5px 0; color: #555; font-size: 14px;"><strong>Mobile:</strong> ${participantData.mobile || 'N/A'}</p>
              </div>
            </div>

            <div style="background-color: #e8f4f8; border-left: 5px solid #17a2b8; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <p style="font-size: 14px; color: #0c5460; margin: 0;">
                ⚡ <strong>Required Action:</strong> Log in to the <strong>CampusConnect+ Admin Portal</strong> to approve or reject this application.
              </p>
            </div>

            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Best regards,<br/>
              <strong>CampusConnect+ Admin Portal</strong>
            </p>
          </div>
          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
              <p style="margin: 0;">This is an automated message from the admin portal. Please do not reply to this email.</p>
              <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending admin event participation notification:", error);
    return false;
  }
};

// Send email to all students about new placement drive
const sendNewPlacementDriveNotification = async (studentEmails, driveData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "your_email@gmail.com",
      subject: `🎯 New Placement Drive Announced - ${driveData.company}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f7fa; padding: 20px; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎯 New Placement Drive</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">${driveData.company}</p>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Dear Student,</p>

            <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Great news! A new placement drive has been announced. Check the details below to see if you're eligible to apply.
            </p>

            <div style="background-color: #f8f9fa; border-left: 5px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333; font-size: 16px;">💼 Drive Details</h3>
              
              <div style="margin: 15px 0;">
                <p style="margin: 8px 0; color: #555;"><strong>Company:</strong> ${driveData.company}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Position:</strong> ${driveData.role}</p>
                <p style="margin: 8px 0; color: #555;"><strong>Branch:</strong> ${driveData.branch}</p>
                <p style="margin: 8px 0; color: #555;"><strong>CTC:</strong> ${driveData.package} LPA</p>
              </div>

              <div style="margin: 15px 0;">
                <h4 style="margin: 10px 0 8px 0; color: #333;">📅 Important Dates:</h4>
                ${driveData.openingDate ? `<p style="margin: 5px 0; color: #555;"><strong>Application Opens:</strong> ${new Date(driveData.openingDate).toLocaleDateString()}</p>` : ''}
                ${driveData.closingDate ? `<p style="margin: 5px 0; color: #555;"><strong>Application Closes:</strong> ${new Date(driveData.closingDate).toLocaleDateString()}</p>` : ''}
                ${driveData.date ? `<p style="margin: 5px 0; color: #555;"><strong>Drive Date:</strong> ${new Date(driveData.date).toLocaleDateString()}</p>` : ''}
              </div>

              ${driveData.venue ? `<p style="margin: 8px 0; color: #555;"><strong>Venue:</strong> ${driveData.venue}</p>` : ''}
              ${driveData.reportingTime ? `<p style="margin: 8px 0; color: #555;"><strong>Reporting Time:</strong> ${driveData.reportingTime}</p>` : ''}
            </div>

            ${driveData.additionalInstructions ? `
            <div style="background-color: #fffbeb; border-left: 5px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <h4 style="margin-top: 0; color: #92400e; font-size: 16px;">📌 Additional Instructions</h4>
              <div style="color: #92400e; font-size: 14px; line-height: 1.6;">
                ${driveData.additionalInstructions}
              </div>
            </div>
            ` : ''}

            <div style="background-color: #dbeafe; border-left: 5px solid #0284c7; padding: 20px; margin: 25px 0; border-radius: 5px;">
              <p style="font-size: 14px; color: #0c4a6e; margin: 0;">
                ⏰ <strong>Reminder:</strong> Mark your calendar and apply during the application period. Don't miss this opportunity!
              </p>
            </div>

            <p style="font-size: 14px; color: #999; margin-top: 30px;">
              Best regards,<br/>
              <strong>CampusConnect+ Placement Team</strong>
            </p>
          </div>

          <div style="background-color: #f0f2f5; padding: 15px; text-align: center; font-size: 12px; color: #999; border-radius: 0 0 5px 5px;">
            <p style="margin: 0;">This is an automated notification from student portal. Please do not reply to this email.</p>
            <p style="margin: 5px 0 0 0;">© 2026 CampusConnect+. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // Send email to each student
    for (const email of studentEmails) {
      try {
        await transporter.sendMail({ ...mailOptions, to: email });
      } catch (err) {
        console.error(`Failed to send email to ${email}:`, err);
      }
    }

    return true;
  } catch (error) {
    console.error("Error sending placement drive notifications:", error);
    return false;
  }
};

module.exports = {
  sendAdminNotification,
  sendApprovalEmail,
  sendRejectionEmail,
  sendClubMembershipApprovalEmail,
  sendClubMembershipRejectionEmail,
  sendAdminClubMembershipNotification,
  sendEventParticipationApprovalEmail,
  sendEventParticipationRejectionEmail,
  sendAdminEventParticipationNotification,
  sendNewPlacementDriveNotification,
};
