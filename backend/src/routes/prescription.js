const express = require("express");
const { userAuth, roleAuth } = require("../middlewares/auth");
const Prescription = require("../models/prescription");
const prescriptionRouter = express.Router();

prescriptionRouter.post(
  "/prescription/add",
  userAuth,
  roleAuth(["Doctor"]),
  async (req, res) => {
    try {
      const { patientId, medicine, dosage, instructions } = req.body;

      if (!patientId || !medicine || !dosage) {
        throw new Error("Missing required fields");
      }

      const prescription = new Prescription({
        doctorId: req.user._id,
        patientId,
        medicine,
        dosage,
        instructions,
      });

      await prescription.save();
      res.send("Prescription written successfully");
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

// Fix: Ensure there is no route with a URL as the path
prescriptionRouter.get("/prescription/my", userAuth, async (req, res) => {
  try {
    let prescriptions;

    if (req.user.role === "Doctor") {
      prescriptions = await Prescription.find({ doctorId: req.user._id }).populate("patientId", "firstName lastName");
    } else if (req.user.role === "Patient") {
      prescriptions = await Prescription.find({ patientId: req.user._id }).populate("doctorId", "firstName lastName");
    } else if (req.user.role === "Admin") {
      prescriptions = []; 
    } else {
      return res.status(403).send("Unauthorized access");
    }

    res.json(prescriptions);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = prescriptionRouter;