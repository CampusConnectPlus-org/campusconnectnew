// server.js
require("dotenv").config();
// const dns = require("node:dns");
// dns.setServers(['8.8.8.8', '8.8.4.4'])
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
// const adminRoutes = require("./routes/adminRoutes");
const placementRoutes = require("./routes/placementRoutes");
const eventRoutes = require("./routes/eventRoutes");
const clubRoutes = require("./routes/clubs");
const app = express();
app.use(express.json());
app.use(cors());
// app.use("/uploads", express.static("uploads"));

const feedRoutes = require("./routes/feedRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reportRoutes = require("./routes/reportRoutes");

// mongoose.connect("mongodb://127.0.0.1:27017/alumniDB");
mongoose.connect("mongodb+srv://gujarrajendra015_db_user:project1020@cluster0.nehqfmw.mongodb.net/test?appName=Cluster0")
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    // Drop the unique index on PlacedStudent.enrollmentNo if it exists
    try {
      const PlacedStudent = require("./models/PlacedStudent");
      const indexes = await PlacedStudent.collection.getIndexes();
      if (indexes.enrollmentNo_1) {
        await PlacedStudent.collection.dropIndex("enrollmentNo_1");
        console.log("✓ Dropped unique index on enrollmentNo");
      }
    } catch (err) {
      // Silently handle any errors
      if (err.message && !err.message.includes("ns not found")) {
        console.log("Index check result:", err.message);
      }
    }
  })
  .catch((err) => { console.error("Error connecting to MongoDB Atlas:", err) });

// const User = require("./models/User");
const Alumni = require("./models/Alumni");
// const Admin = require("./models/Admin");
console.log("API KEY:", process.env.OPENROUTER_API_KEY);

// const Alumni = mongoose.model("Alumni", {
//   name: String,
//   role: String,
//   batch: Number,
//   company: String,
//   position: String,
//    desc:String

// });
// async function createAlumni() {

//   const newAlumni = new Alumni(
//   {
//        name: "Sourabh Purbia",
//     role: "Founder & CEO, Creative Upaay",
//     batch: "CSE(2019)",
//     desc: "Sourabh Purbia, Founder of Creative Upaay.",
//     image: "alumnisimage/sourabh.jpeg",
//     linkedin:"https://www.linkedin.com/in/sourabhpurbia/"
//   }
// );

//   await newAlumni.save();

//   console.log("Alumni Saved");
// }

// createAlumni();

// async function createUser() {

//   const newUser = new User(
//   {
//     name:"Rajendra Kumar",
//     enrollmentNumber: "2022/CTAE/327",
//     email: "gujarrajendra8955@gmail.com",
//     password: "123456",
//     profileImage:"/images/rajendra.jpeg"
//   }
// );

//   await newUser.save();

//   console.log("User Saved");
// }

// createUser();
// const bcrypt = require("bcryptjs");
// const User = require("./models/User");

// async function createUser(name,enrollmentNumber, email, password,profileImage) {
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = new User({
//     name,
//     enrollmentNumber,
//     email,
//     password: hashedPassword,
//     profileImage
//   });

//   await user.save();
//   console.log("User added:", user);
// }

// // Direct function call
// createUser("Rajendra Kumar","2022/CTAE/327", "gujarrajendra8955@gmail.com", "123456","/images/rajendra.jpeg");

// ADD NEW ADMIN DATA
// const bcrypt = require("bcryptjs");
// // const Admin = require("./models/Admin");

// async function createUser(name, email, password,profileImage) {
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const admin = new Admin({
//     name,
//     email,
//     password: hashedPassword,
//     profileImage,
//     role: "admin"
//   });

//   await admin.save();
//   console.log("Admin added:", admin);
// }

// // Direct function call
// createUser("Rajendra Kumar","gujarrajendra8977@gmail.com", "123456","rajendra.jpeg");

// async function createSuperAdmin() {
//   const hashedPassword = await bcrypt.hash("123456", 10);

//   const admin = new Admin({

//     name: "Super Admin",
//     email: "superadmin@example.com",
//     password: hashedPassword,
//     role: "superadmin"
//   });
//   await admin.save();
//   console.log("Super Admin added:", admin);
// }
// createSuperAdmin();

// API to get alumni
app.get("/alumni", async (req, res) => {
  const data = await Alumni.find();
  res.json(data);
});

app.use("/api/auth", authRoutes);
app.use("/admin", userRoutes);
app.use("/api/placements", placementRoutes);
// app.use("/api/admin", adminRoutes);
app.use("/images", require("express").static("images"));
app.use("/uploads", express.static("uploads"));
app.use("/alumniimage", express.static("alumniimage"));
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/feed", feedRoutes); // posts
app.use("/api/comments", commentRoutes); // comments
app.use("/api/report", reportRoutes);

// app.post("/login", async (req, res) => {

//   const {enrollmentNumber, password } = req.body;
//   const user = await User.findOne({enrollmentNumber});
//   if(!user){
//     return res.json({message:"User not found"});
//   }

//   const isMatch = await bcrypt.compare(password,user.password);

//   if(!isMatch){
//     return res.json({message:"Wrong password"});
//   }

//   const token = jwt.sign({id:user._id},
//     "secretkey",
//     {expiresIn:"id"}
//   );

//   res.json({token:token,
//     user:{
//       name:user.name,
//       enrollmentNumber:user.enrollmentNumber
//     }
//   });
// try {

//   // check if user exists
//   const user = await User.findOne({ enrollmentNumber: enrollmentNumber, password : password });

//   if (user) {
//      res.json({
//       success: true,
//       message:"Login successful",
//       user:user
//       // userId:user._id
//       });
//   }
//   else{
//       res.json({
//           success:false,
//           message : "Invalid enrollmentNumber or password"

//       })
//   }

// } catch (error) {
//   res.status(500).json({ message: "Server error" });
// }

// });

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
