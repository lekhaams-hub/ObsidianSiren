const express = require("express");
const router = express.Router();

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const requireAdmin = require("../middleware/requireAdmin");

const {
  getAllSubmissions,
  updateSubmissionStatus,
} = require("../controllers/submissionController");

router.get(
  "/submissions",
  verifyFirebaseToken,
  requireAdmin,
  getAllSubmissions
);

router.patch(
  "/submissions/:id/status",
  verifyFirebaseToken,
  requireAdmin,
  updateSubmissionStatus
);

module.exports = router;