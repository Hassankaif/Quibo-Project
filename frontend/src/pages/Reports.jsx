"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { reportService } from "../services/api"
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

const Reports = () => {
  const { user } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [reports, setReports] = useState([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    treatment: "",
    notes: ""
  })
  const [patients, setPatients] = useState([])

  useEffect(() => {
    fetchReports()
    if (user.role === "Doctor") {
      fetchPatients()
    }
  }, [user])

  const fetchReports = async () => {
    try {
      const data = await reportService.getReports(user._id)
      setReports(data)
    } catch (error) {
      console.error("Error fetching reports:", error)
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:7777/users")
      const data = await response.json()
      const patientList = data.filter(user => user.role === "Patient")
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
      diagnosis: "",
      treatment: "",
      notes: ""
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      await reportService.addReport(formData)
      handleClose()
      fetchReports()
    } catch (error) {
      console.error("Error adding report:", error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Medical Reports
        </Typography>
        {user.role === "Doctor" && (
          <Button variant="contained" onClick={handleOpen}>
            Create Report
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
              <TableCell>Diagnosis</TableCell>
              <TableCell>Treatment</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report._id}>
                <TableCell>
                  {format(new Date(report.createdAt), "PPP")}
                </TableCell>
                <TableCell>
                  {report.patientId?.firstName} {report.patientId?.lastName}
                </TableCell>
                <TableCell>
                  {report.doctorId?.firstName} {report.doctorId?.lastName}
                </TableCell>
                <TableCell>{report.diagnosis}</TableCell>
                <TableCell>{report.treatment}</TableCell>
                <TableCell>{report.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Medical Report</DialogTitle>
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
            label="Diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Treatment"
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
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

export default Reports

