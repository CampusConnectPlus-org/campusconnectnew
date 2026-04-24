const express = require("express");
const { reportPost, getReports } = require("../controllers/reportController");
 const verifyToken = require("../middleware/verifyToken"); // baad me add karna

const router = express.Router();

// create report
router.post("/create", verifyToken, reportPost);

// get all reports
router.get("/all", getReports);

module.exports = router;