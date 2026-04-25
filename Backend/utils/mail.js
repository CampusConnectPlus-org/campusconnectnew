const nodemailer = require("nodemailer");

module.exports = async function (complaint) {

    let transporter = nodemailer.createTransport({

        service: "gmail",

        auth: {
            user: "yourgmail@gmail.com",
            pass: "appPassword"
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