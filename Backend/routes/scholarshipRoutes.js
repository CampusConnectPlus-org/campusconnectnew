const express = require("express");
const {
  getScholarships,
  addScholarship,
  deleteScholarship,
  seedScholarships
} = require("../controllers/scholarshipController");
const auth = require("../middleware/verifyToken");

const router = express.Router();

router.get("/all", getScholarships);           // filter support hai
router.post("/add", auth, addScholarship);     // admin only
router.delete("/:id", auth, deleteScholarship); // admin only
router.post("/seed", seedScholarships);        // ek baar chalao

module.exports = router;