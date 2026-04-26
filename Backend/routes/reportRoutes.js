const express = require("express");
const { reportPost, getReports, deleteReport } = require("../controllers/reportController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// create report
router.post("/create", verifyToken, reportPost);

// get all reports
router.get("/all", getReports);

// delete a report
router.delete("/:id", verifyToken, deleteReport);

module.exports = router;