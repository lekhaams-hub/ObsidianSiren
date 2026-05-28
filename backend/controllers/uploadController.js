const handleUpload = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "File upload failed.",
    });
  }
};

module.exports = { handleUpload };