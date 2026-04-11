const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: String,
  heroTitle: String,
  heroDescription: String,
  about: String,

  teamMembers: [{ name: String }],

  achievements: [
    { title: String, icon: String }
  ],

  upcomingEvents: [
 {
   _id:{
     type: mongoose.Schema.Types.ObjectId,
     auto:true
   },
   title:String,
   date:String,
   description:String
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

  // NEW 👉 event participation
  eventParticipants: [
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
  ]
});

module.exports = mongoose.model("Club", clubSchema);