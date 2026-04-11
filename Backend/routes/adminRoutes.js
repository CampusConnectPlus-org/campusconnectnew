// // // // adminRoutes.js



// const express = require("express");
// const router = express.Router();
// const verifyToken = require("../middleware/verifyToken");
// const isAdmin = require("../middleware/isAdmin");
// const Admin = require("../models/Admin");
// const upload = require("../middleware/Upload");
// const bcrypt = require("bcryptjs");
// const isSuperAdmin = require("../middleware/isSuperAdmin");

// // // // GET ADMINS
// // // router.get("/admins", verifyToken, isAdmin, async (req, res) => {
// // //   const admins = await Admin.find();
// // //   res.json(admins);
// // // });

// // // // profile api
// // // router.get("/profile", verifyToken, async (req, res) => {
// // //   const admin = await Admin.findById(req.user.id).select("-password");   
// // //   res.json({ admin });
// // // });

// // // // UPDATE admin profile image
// // // router.post("/profile", upload.single("profileImage"), async (req, res) => {
// // //   const imagePath = req.file.filename;  
// // //     await Admin.findByIdAndUpdate(req.body.id, {
// // //     profileImage: imagePath
// // //   });

// // //     res.send("Updated");
// // // });


// // const express = require("express");
// // const router = express.Router();
// // const bcrypt = require("bcryptjs");
// // const Admin = require("../models/Admin");

// // // const { verifyToken } = require("../middleware/auth");
// // const isSuperAdmin = require("../middleware/isSuperAdmin");


// // // ✅ Add new admin (ONLY superadmin)
// // router.post("/add-admin", verifyToken, isSuperAdmin, async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const admin = new Admin({
// //       name,
// //       email,
// //       password: hashedPassword
// //     });

// //     await admin.save();

// //     res.json({ message: "Admin added", admin });
// //   } catch (err) {
// //     res.status(500).json(err);
// //   }
// // });


// // // ✅ Get all admins
// router.get("/getAdmins",verifyToken, isAdmin, isSuperAdmin, async (req, res) => {
//     console.log("GET ADMINS HIT");
//     res.send("admin data");
//     console.log("Admin ID from token:", req.admin.id);
//   const admins = await Admin.find();
  
//   res.json(admins);
// });
// router.get("/profile", verifyToken, isSuperAdmin, isAdmin, async (req, res) => {
//   const admin = await Admin.findById(req.user.id).select("-password");
//   console.log("User",req.user);
//     // res.json({ admin });    
//   res.json(admin);
// });

// // module.exports = router;
// router.post('/addAdmin', verifyToken, isAdmin,  isSuperAdmin, upload.single("profileImage"), async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;


//     // validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ msg: "All required fields missing" });
//     }

//     // check duplicate email
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ msg: "Admin already exists" });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 👉 HANDLE IMAGE HERE

//     let profileImage = " ";
//     if (req.file) {
//       profileImage = req.file.filename; // uploaded file
//     }


//     // create user
//     const newAdmin = new Admin({
//       name,
//       email,
//       password: hashedPassword,
//       profileImage,
//       role
//     });

//     await newAdmin.save();

//     res.json({ msg: "Admin added successfully", admin: newAdmin });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });
// module.exports = router;