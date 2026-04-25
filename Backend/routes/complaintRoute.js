const express = require("express");
const router = express.Router();
// const nodemailer = require("nodemailer");
const Complaint = require("../models/Complaint");

// Mailtrap Configuration (Password nahi chahiye!)
// const transporter = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: "56803fd23a80d1", // Mailtrap se copy karo
//         pass: "**8b2a" // Mailtrap se copy karo
//     }
// });

// Add Complaint with Email
router.post("/add", async (req, res) => {
    try {
        const { name, email, enrollment, department, complaintText, anonymous } = req.body;

        // Validate complaint text is always required
        if (!complaintText || !complaintText.trim()) {
            return res.status(400).json({ error: "Complaint text is required" });
        }

        // For non-anonymous complaints, validate required fields
        if (!anonymous) {
            if (!email) {
                return res.status(400).json({ error: "Email required" });
            }
            if (!name || !name.trim()) {
                return res.status(400).json({ error: "Name required" });
            }
            if (!enrollment || !enrollment.trim()) {
                return res.status(400).json({ error: "Enrollment number required" });
            }
            if (!department || !department.trim()) {
                return res.status(400).json({ error: "Department required" });
            }
        }

        const complaint = new Complaint({
            userName: anonymous ? "Anonymous" : name,
            userEmail: anonymous ? "anonymous@example.com" : email,
            enrollment,
            department,
            complaintText,
            anonymous,
            status: "Pending",
            createdAt: new Date()
        });

        await complaint.save();

        // Send response immediately to user
        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully!",
            complaint
        });

        // Send emails in background (don't await)
        // User Email
        if (!anonymous && email) {
            (async () => {
                try {
                    const userEmail = {
                        from: "noreply@compusconnect.com",
                        to: email,
                        subject: "✅ Complaint Received - CompusConnect",
                        html: `
                            <div style="font-family: Arial; background-color: #f5f5f5; padding: 20px;">
                                <div style="background-color: white; padding: 20px; border-radius: 8px;">
                                    <h2 style="color: #333;">Complaint Received</h2>
                                    <p>Dear <strong>${name}</strong>,</p>
                                    <p>Your complaint has been successfully submitted to CompusConnect.</p>
                                    
                                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0;">
                                        <p><strong>Complaint ID:</strong> ${complaint._id}</p>
                                        <p><strong>Department:</strong> ${department}</p>
                                        <p><strong>Status:</strong> <span style="color: #FF9800;">Pending</span></p>
                                        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                                    </div>

                                    <p><strong>Your Complaint:</strong></p>
                                    <p style="background-color: #f0f0f0; padding: 10px; border-radius: 4px;">${complaintText}</p>

                                    <p>We will review your complaint and respond within 24 hours.</p>
                                    <p>Thank you for helping us improve!</p>
                                </div>
                            </div>
                        `
                    };

                    await transporter.sendMail(userEmail);
                    console.log(`✅ Email sent to user: ${email}`);
                } catch (emailError) {
                    console.error("⚠️ Error sending user email:", emailError);
                }
            })();
        }

        // Admin Email
        (async () => {
            try {
                const adminEmail = {
                    from: "noreply@compusconnect.com",
                    to: "admin@compusconnect.com",
                    subject: `🔔 New Complaint from ${name}`,
                    html: `
                        <div style="font-family: Arial;">
                            <h2>New Complaint Received</h2>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Department:</strong> ${department}</p>
                            <p><strong>Complaint:</strong> ${complaintText}</p>
                            <p><strong>ID:</strong> ${complaint._id}</p>
                        </div>
                `
                };

                await transporter.sendMail(adminEmail);
                console.log("✅ Admin email sent");
            } catch (emailError) {
                console.error("⚠️ Error sending admin email:", emailError);
            }
        })();

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ 
            error: error.message,
            message: "Failed to submit complaint"
        });
    }
});

// Get All Complaints
router.get("/all", async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        console.error("❌ Error fetching complaints:", error);
        res.status(500).json({ 
            error: error.message,
            message: "Failed to fetch complaints"
        });
    }
});

// Get Single Complaint by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const complaint = await Complaint.findById(id);

        if (!complaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        res.status(200).json(complaint);
    } catch (error) {
        console.error("❌ Error fetching complaint:", error);
        res.status(500).json({ 
            error: error.message,
            message: "Failed to fetch complaint"
        });
    }
});

// Update Complaint Status
router.put("/status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        res.status(200).json({
            success: true,
            message: "Complaint status updated successfully!",
            complaint: updatedComplaint
        });
    } catch (error) {
        console.error("❌ Error updating complaint status:", error);
        res.status(500).json({ 
            error: error.message,
            message: "Failed to update complaint status"
        });
    }
});

module.exports = router;