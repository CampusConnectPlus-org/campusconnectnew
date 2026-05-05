const Scholarship = require("../models/Scholarship");

// Get all / filtered scholarships
const getScholarships = async (req, res) => {
  try {
    // Bulk-update any scholarship whose deadline has passed but is still "open"
    await Scholarship.updateMany(
      { deadline: { $lt: new Date() }, status: "open" },
      { $set: { status: "closed" } }
    );

    const { category, caste, income, percentage, gender } = req.query;
    let filter = {};

    if (category) filter.category = category;

    if (caste) {
      filter["eligibility.casteCategory"] = { $in: [caste] };
    }
    if (income) {
      filter["eligibility.maxIncome"] = { $gte: Number(income) };
    }
    if (percentage) {
      filter["eligibility.minPercentage"] = { $lte: Number(percentage) };
    }
    if (gender && gender !== "any") {
      filter["eligibility.genderRequired"] = { $in: [gender, "any"] };
    }

    const scholarships = await Scholarship.find(filter).sort({ deadline: 1 });
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add scholarship (admin only)
const addScholarship = async (req, res) => {
  try {
    console.log("User from token:", req.user); // 👈 ye add karo debug ke liye

    if (!req.user.isAdmin && req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const scholarship = await Scholarship.create(req.body);
    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete scholarship (admin only)
const deleteScholarship = async (req, res) => {
  try {
    if (!req.user.isAdmin && req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Seed default Rajasthan scholarships
const seedScholarships = async (req, res) => {
  try {
    await Scholarship.deleteMany({});
    await Scholarship.insertMany([
      {
        title: "Mukhyamantri Uchch Shiksha Scholarship",
        provider: "Rajasthan Government",
        category: "state",
        amount: "₹5,000/year",
        deadline: new Date("2026-03-31"),
        eligibility: {
          casteCategory: ["General", "OBC", "SC", "ST", "EBC"],
          maxIncome: 250000,
          minPercentage: 60,
          genderRequired: "any"
        },
        documents: ["Jan Aadhaar Card", "Bonafide Certificate", "Income Certificate", "12th Marksheet", "Fee Receipt"],
        officialLink: "https://sje.rajasthan.gov.in",
        status: "open"
      },
      {
        title: "Post Matric SC/ST Scholarship",
        provider: "Rajasthan SJE",
        category: "state",
        amount: "Full Fee + Maintenance",
        deadline: new Date("2026-03-31"),
        eligibility: {
          casteCategory: ["SC", "ST"],
          maxIncome: 250000,
          minPercentage: 0,
          genderRequired: "any"
        },
        documents: ["Jan Aadhaar Card", "Caste Certificate", "Income Certificate", "Bonafide Certificate", "Fee Receipt", "Bank Passbook"],
        officialLink: "https://sje.rajasthan.gov.in",
        status: "open"
      },
      {
        title: "Devnarayan Gurukul Scholarship",
        provider: "Rajasthan Government",
        category: "state",
        amount: "₹10,000 - ₹15,000/year",
        deadline: new Date("2026-04-30"),
        eligibility: {
          casteCategory: ["OBC"],
          maxIncome: 200000,
          minPercentage: 50,
          genderRequired: "any"
        },
        documents: ["Jan Aadhaar Card", "OBC Certificate", "Income Certificate", "Bonafide Certificate", "Marksheet"],
        officialLink: "https://sje.rajasthan.gov.in",
        status: "open"
      },
      {
        title: "Pragati Scholarship (Girls)",
        provider: "AICTE - Central Government",
        category: "central",
        amount: "₹50,000/year",
        deadline: new Date("2026-05-31"),
        eligibility: {
          casteCategory: ["General", "OBC", "SC", "ST", "EBC"],
          maxIncome: 800000,
          minPercentage: 0,
          genderRequired: "female"
        },
        documents: ["Aadhaar Card", "Income Certificate", "Bonafide Certificate", "Fee Receipt", "Bank Account Details"],
        officialLink: "https://www.aicte-india.org/bureaus/rid/pms",
        status: "open"
      },
      {
        title: "NSP Merit-cum-Means Scholarship",
        provider: "Central Government (NSP)",
        category: "central",
        amount: "₹20,000/year",
        deadline: new Date("2026-10-31"),
        eligibility: {
          casteCategory: ["General", "OBC", "SC", "ST", "EBC"],
          maxIncome: 250000,
          minPercentage: 50,
          genderRequired: "any"
        },
        documents: ["Aadhaar Card", "Income Certificate", "Bonafide Certificate", "Marksheet", "Bank Passbook"],
        officialLink: "https://scholarships.gov.in",
        status: "open"
      },
      {
        title: "HDFC Badhte Kadam Scholarship",
        provider: "HDFC Bank",
        category: "private",
        amount: "₹75,000/year",
        deadline: new Date("2026-08-31"),
        eligibility: {
          casteCategory: ["General", "OBC", "SC", "ST", "EBC"],
          maxIncome: 300000,
          minPercentage: 55,
          genderRequired: "any"
        },
        documents: ["Aadhaar Card", "Income Certificate", "Marksheet", "Admission Proof", "Bank Details"],
        officialLink: "https://www.hdfcbank.com/personal/borrow/popular-loans/educational-loan/hdfc-badhte-kadam",
        status: "open"
      },
      {
        title: "Reliance Foundation Scholarship",
        provider: "Reliance Foundation",
        category: "private",
        amount: "₹2,00,000/year",
        deadline: new Date("2026-12-31"),
        eligibility: {
          casteCategory: ["General", "OBC", "SC", "ST", "EBC"],
          maxIncome: 1500000,
          minPercentage: 60,
          genderRequired: "any"
        },
        documents: ["Aadhaar Card", "Income Certificate", "Marksheet", "Admission Letter", "Essay"],
        officialLink: "https://www.reliancefoundation.org",
        status: "open"
      }
    ]);

    res.json({ message: "Scholarships seeded!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update scholarship (admin only)
const updateScholarship = async (req, res) => {
  try {
    if (!req.user.isAdmin && req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const updated = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Scholarship not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getScholarships, addScholarship, deleteScholarship, updateScholarship, seedScholarships };