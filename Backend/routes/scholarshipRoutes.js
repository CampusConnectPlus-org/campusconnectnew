const express = require("express");
const {
  getScholarships,
  addScholarship,
  deleteScholarship,
  updateScholarship,
  seedScholarships
} = require("../controllers/scholarshipController");
const auth = require("../middleware/verifyToken");

const router = express.Router();

router.get("/all", getScholarships);           // filter support hai
router.post("/add", auth, addScholarship);     // admin only
router.delete("/:id", auth, deleteScholarship); // admin only
router.put("/:id", auth, updateScholarship);    // admin only — edit scholarship
router.post("/seed", seedScholarships);        // ek baar chalao

module.exports = router;