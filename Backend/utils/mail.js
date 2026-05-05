const nodemailer = require("nodemailer");

module.exports = async function (complaint) {
    

    let transporter = nodemailer.createTransport({

        service: "gmail",

        auth: {
           user: process.env.EMAIL_USER || "your_email@gmail.com",
           pass: process.env.EMAIL_PASS || "your_app_password",
        }

    });

    await transporter.sendMail({

        from: "yourgmail@gmail.com",

        to: "admin@gmail.com",

        subject: "New Complaint",

        text: `
Complaint:
${complaint.complaintText}

Status:
Pending

Anonymous:
${complaint.anonymous}
`

    });

}