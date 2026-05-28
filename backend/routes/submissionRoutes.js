const express = require("express");
const {
  createSubmission,
  getSubmissions,
} = require("../controllers/submissionController");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

const router = express.Router();

router.post("/", createSubmission);
router.get("/", verifyFirebaseToken, getSubmissions);

module.exports = router;