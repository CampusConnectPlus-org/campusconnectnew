const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
type:String,
require:true
    },
  enrollmentNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage:{
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: "user"
  }
});

module.exports = mongoose.model("User", userSchema);