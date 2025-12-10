const File = require("../models/File");

const uploadFile = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const file = await File.create({
      userId: req.userId,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      fileUrl: req.file.path,
      size: req.file.size,
      status: "processing"
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file
    });

  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { uploadFile };
