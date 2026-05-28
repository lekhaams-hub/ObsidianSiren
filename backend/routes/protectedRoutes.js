const express = require("express");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

const router = express.Router();

router.get("/profile", verifyFirebaseToken, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Protected route accessed successfully.",
      user: req.user,
    });
  } catch (error) {
    console.error("Protected route error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to access protected route.",
    });
  }
});

module.exports = router;