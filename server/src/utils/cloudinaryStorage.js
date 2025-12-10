const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "knowledge_base_uploads",
    resource_type: "raw" // allows PDFs
  }
});

const upload = multer({ storage });

module.exports = upload;
