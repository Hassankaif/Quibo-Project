const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// Import routers
const authRouter = require("./routes/authentication");
const profileRouter = require("./routes/profile");
const adminRouter = require("./routes/admin");
const appointmentRouter = require("./routes/appointment");
const patientRouter = require("./routes/patient");
const prescriptionRouter = require("./routes/prescription");
const reportRouter = require("./routes/report");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Connect to MongoDB
require("./config/database"); // Make sure this file exists and properly connects to your database

// Mount API routes with proper prefixes
app.use("/api/auth", authRouter);
app.use("/api", profileRouter); // Will handle /api/profile/view and /api/profile/edit
app.use("/api/admin", adminRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/patient", patientRouter);
app.use("/api", prescriptionRouter); // Will handle /api/prescription/my
app.use("/api/report", reportRouter);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
const fs = require("fs");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files for uploads
app.use("/uploads", express.static(uploadsDir));

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React frontend app
  const frontendBuildPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendBuildPath));

  // Handle any requests that don't match the above
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;