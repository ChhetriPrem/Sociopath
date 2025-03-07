const express = require("express");
const { upload } = require("../config/cloudinary"); // Import upload config
const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
