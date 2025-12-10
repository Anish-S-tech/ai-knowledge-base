const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    originalName: String,
    fileName: String,
    fileType: String,
    fileUrl: String,
    size: Number,
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing"
    },
    numPages: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now }
  }
);

module.exports = mongoose.model("File", fileSchema);
