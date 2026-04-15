const express = require("express");
const router = express.Router();


const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const User = require("../models/User");
const Alumni = require("../models/Alumni");
const upload = require("../middleware/Upload");
const Admin = require("../models/Admin");


const bcrypt = require("bcryptjs");



// GET USERS
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});


// profile api
router.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("password");

  res.json({ user });
});

// admin profile api
router.get("/api/profile", verifyToken, async (req, res) => {
  const admin = await Admin.findById(req.user.id).select("-password");

  res.json(admin);
});
// UPDATE admin profile image
// router.post("/admin/profile", upload.single("image"), async (req, res) => {
//   const imagePath = req.file.filename;

//   await Admin.findByIdAndUpdate(req.body.id, {
//     profileImage: imagePath
//   });

//   res.send("Updated");
// });


// DELETE USER
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  console.log("DELETE HIT:", req.params.id);

  try {
    const user = await User.findByIdAndDelete(req.params.id);

    console.log("DELETED USER:", user);

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ msg: "Error deleting user" });
  }
});

// ADD USER
router.post('/users', verifyToken, isAdmin, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, enrollmentNumber, email, password, role } = req.body;


    // validation
    if (!name || !enrollmentNumber || !email || !password) {
      return res.status(400).json({ msg: "All required fields missing" });
    }

    // check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👉 HANDLE IMAGE HERE

    let profileImage = " ";
    if (req.file) {
      profileImage = req.file.filename; // uploaded file
    }


    // create user
    const newUser = new User({
      name,
      enrollmentNumber,
      email,
      password: hashedPassword,
      profileImage,
      role
    });

    await newUser.save();

    res.json({ msg: "User added successfully", user: newUser });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// edit user
router.put("/update/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      name: req.body.name,
      enrollmentNumber: req.body.enrollmentNumber,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password ? await bcrypt.hash(req.body.password, 10) : undefined
    };
// agar new image upload hua hai toh usko updateData mein add kar do, warna purani image rehne do
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

// ADD ALUMNI
router.post(
  "/alumni",
  verifyToken,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, role, batch, desc, email, linkedin } = req.body;

      if (!name) {
        return res.status(400).json({ msg: "Name is required" });
      }

      let image = "";
      if (req.file) {
        image = req.file.filename;
      }

      const newAlumni = new Alumni({
        name,
        role,
        batch,
        desc,
        email,
        image,
        linkedin,

      });

      await newAlumni.save();

      res.json({ msg: "Alumni added successfully", alumni: newAlumni });

    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);


// DELETE ALUMNI
router.delete('/alumni/:id', verifyToken, isAdmin, async (req, res) => {
  // console.log("DELETE HIT:", );

  console.log("DELETE HIT:", req.params.id);

  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);

    console.log("DELETED ALUMNI:", alumni);

    res.json({ msg: "Alumni deleted" });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ msg: "Error deleting alumni" });
  }
});

// update alumni
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      name: req.body.name,
      role: req.body.role,
      batch: req.body.batch,
      desc: req.body.desc,
      email: req.body.email,
      linkedin: req.body.linkedin,
    };
// agar new image upload hua hai toh usko updateData mein add kar do, warna purani image rehne do
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedAlumni = await Alumni.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedAlumni);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

