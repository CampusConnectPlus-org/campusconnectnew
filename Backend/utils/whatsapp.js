const twilio = require("twilio");

const client = twilio(
    process.env.SID,
    process.env.TOKEN
);

module.exports = async function (complaint) {

    await client.messages.create({

        from: 'whatsapp:+14155238886',

        to: 'whatsapp:+91xxxxxxxxxx',

        body: `New Complaint:
${complaint.complaintText}`

    });

}