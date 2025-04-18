const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS — allow all origins for now (you can later restrict this to your frontend URL)
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Routes
const authRouter = require("./routes/authentication");
const profileRouter = require("./routes/profile");
const appointmentRouter = require("./routes/appointment");
const reportRouter = require("./routes/report");
const adminRouter = require("./routes/admin");
const prescriptionRouter = require("./routes/prescription");
const patientRouter = require("./routes/patient");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", appointmentRouter);
app.use("/", reportRouter);
app.use("/", adminRouter);
app.use("/", prescriptionRouter);
app.use("/", patientRouter);



// Serve static files from frontend/dist
app.use(express.static(path.resolve(__dirname, "../../../frontend/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../../../frontend/dist/index.html"));
// });



// Connect to database and start server
connectDB()
  .then(() => {
    console.log("Database Connected");
    const PORT = process.env.PORT || 7777;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database:", err);
  });
