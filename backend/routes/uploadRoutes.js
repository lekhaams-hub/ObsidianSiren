const express = require("express");
const upload = require("../middleware/upload");
const { handleUpload } = require("../controllers/uploadController");

const router = express.Router();

router.post("/manuscript", upload.single("file"), handleUpload);

module.exports = router;