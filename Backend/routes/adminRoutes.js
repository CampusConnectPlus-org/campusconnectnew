// adminRoutes.js

// const express = require("express");
// const router = express.Router();
// const verifyToken = require("../middleware/verifyToken");
// const isAdmin = require("../middleware/isAdmin");
// const User = require("../models/User");

// router.delete('/users/:id', verifyToken, async (req, res) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ msg: "Access denied" });
//     }

//     await User.findByIdAndDelete(req.params.id);
//     res.json({ msg: "User deleted" });
// });