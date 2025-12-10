const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../utils/cloudinaryStorage");
const { uploadFile } = require("../controllers/file.controller");

// POST /api/files/upload
router.post("/upload", auth, upload.single("file"), uploadFile);

module.exports = router;
