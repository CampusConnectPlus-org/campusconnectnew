const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: String,
  heroTitle: String,
  heroDescription: String,
  about: String,

  joinApplicationsOpen: {
    type: Boolean,
    default: true
  },

  joinOpenFrom: String,
  joinOpenUntil: String,
  joinClosedMessage: {
    type: String,
    default: "Applications are closed for now. Please check back later."
  },

  teamMembers: [{ name: String }],

  // NEW 👉 club members (approved registrations)
  members: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
      },
      firstName: String,
      lastName: String,
      branch: String,
      mobile: String,
      email: String,
      collegeYear: String,
      gender: String,
      dob: String,
      hobby: String,
      contribution: String,
      enrollmentNo: String,
      approvedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  achievements: [
    { title: String, icon: String }
  ],

  upcomingEvents: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
      },
      title: String,
      date: String,
      description: String
    }
  ],

  // NEW 👉 club join requests
  registrations: [
    {
      firstName: String,
      lastName: String,
      branch: String,
      mobile: String,
      email: String,
      collegeYear: String,
      gender: String,
      dob: String,
      hobby: String,
      contribution: String,
      enrollmentNo: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // NEW 👉 event participation requests (pending)
  eventParticipationRequests: [
    {
      eventTitle: String,
      firstName: String,
      lastName: String,
      branch: String,
      mobile: String,
      email: String,
      collegeYear: String,
      gender: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // NEW 👉 event participation (approved)
  eventParticipants: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
      },
      eventTitle: String,
      firstName: String,
      lastName: String,
      branch: String,
      mobile: String,
      email: String,
      collegeYear: String,
      gender: String,
      approvedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model("Club", clubSchema);