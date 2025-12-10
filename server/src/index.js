// src/index.js
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// ⭐ IMPORT CLOUDINARY CONFIG (this was missing)
require("./config/cloudinary");  

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// File routes
const fileRoutes = require("./routes/file.routes");
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.json({ message: "AI Knowledge Base API running" });
});

// Error fallback
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
