const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import routers
const authRouter = require("./routes/authentication");
const profileRouter = require("./routes/profile");
const adminRouter = require("./routes/admin");
const appointmentRouter = require("./routes/appointment");
const patientRouter = require("./routes/patient");
const prescriptionRouter = require("./routes/prescription");
const reportRouter = require("./routes/report");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Mount API routes - make sure all routes start with '/'
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/patient", patientRouter);
app.use("/api/prescriptions", prescriptionRouter);
app.use("/api/reports", reportRouter);

// Fix for the prescription issue - ensure this path doesn't conflict with the above
app.use("/api", prescriptionRouter); // This will properly handle '/api/prescription/my'

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // Handle any requests that don't match the above
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

// Connect to database
require("./db/mongoose");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;