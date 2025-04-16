"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { prescriptionService } from "../services/api"
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  useTheme,
  useMediaQuery
} from "@mui/material"
import { format } from "date-fns"

const Prescriptions = () => {
  const { user } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [prescriptions, setPrescriptions] = useState([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    patientId: "",
    medicine: "",
    dosage: "",
    instructions: "",
  })
  const [patients, setPatients] = useState([])

  useEffect(() => {
    fetchPrescriptions()
    if (user.role === "Doctor") {
      fetchPatients()
    }
  }, [user])

  const fetchPrescriptions = async () => {
    try {
      const data = await prescriptionService.getPrescriptions(user._id)
      setPrescriptions(data)
    } catch (error) {
      console.error("Error fetching prescriptions:", error)
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:7777/users")
      const data = await response.json()
      const patientList = data.filter((user) => user.role === "Patient")
      setPatients(patientList)
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({
      patientId: "",
      medicine: "",
      dosage: "",
      instructions: "",
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      await prescriptionService.addPrescription(formData)
      handleClose()
      fetchPrescriptions()
    } catch (error) {
      console.error("Error adding prescription:", error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Prescriptions
        </Typography>
        {user.role === "Doctor" && (
          <Button variant="contained" onClick={handleOpen}>
            Write Prescription
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Medicine</TableCell>
              <TableCell>Dosage</TableCell>
              <TableCell>Instructions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription._id}>
                <TableCell>
                  {format(new Date(prescription.createdAt), "PPP")}
                </TableCell>
                <TableCell>
                  {prescription.patientId?.firstName} {prescription.patientId?.lastName}
                </TableCell>
                <TableCell>
                  {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}
                </TableCell>
                <TableCell>{prescription.medicine}</TableCell>
                <TableCell>{prescription.dosage}</TableCell>
                <TableCell>{prescription.instructions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Write Prescription</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Select Patient"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            margin="normal"
            required
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Medicine"
            name="medicine"
            value={formData.medicine}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Prescriptions

