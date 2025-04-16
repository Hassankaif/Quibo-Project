"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { appointmentService } from "../services/api"
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
  useMediaQuery,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  Alert,
  Skeleton,
  MenuItem,
  InputAdornment,
} from "@mui/material"
import {
  Add,
  CalendarMonth,
  CheckCircle,
  Close,
  Event,
  EventAvailable,
  FilterList,
  Person,
  Search,
  AccessTime,
  Cancel,
  Pending,
} from "@mui/icons-material"
import { format } from "date-fns"

const Appointments = () => {
  const { user } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchAppointments()
    if (user.role === "Patient") {
      fetchDoctors()
    }
  }, [user])

  useEffect(() => {
    // Filter appointments based on search term and status
    let filtered = [...appointments]

    if (searchTerm) {
      filtered = filtered.filter((appointment) => {
        const doctorName =
          `${appointment.doctorId?.firstName || ""} ${appointment.doctorId?.lastName || ""}`.toLowerCase()
        const patientName =
          `${appointment.patientId?.firstName || ""} ${appointment.patientId?.lastName || ""}`.toLowerCase()
        return doctorName.includes(searchTerm.toLowerCase()) || patientName.includes(searchTerm.toLowerCase())
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter)
    }

    setFilteredAppointments(filtered)
  }, [appointments, searchTerm, statusFilter])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await appointmentService.getMyAppointments()
      setAppointments(data)
      setFilteredAppointments(data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setError("Failed to load appointments. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:7777/users")
      const data = await response.json()
      const doctorList = data.filter((user) => user.role === "Doctor" && user.isApproved)
      setDoctors(doctorList)
    } catch (error) {
      console.error("Error fetching doctors:", error)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setSelectedDate("")
    setSelectedDoctor("")
  }

  const handleBookAppointment = async () => {
    try {
      setLoading(true)
      await appointmentService.bookAppointment(selectedDoctor, selectedDate)
      handleClose()
      fetchAppointments()
    } catch (error) {
      console.error("Error booking appointment:", error)
      setError("Failed to book appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveAppointment = async (appointmentId, status) => {
    try {
      setLoading(true)
      await appointmentService.approveAppointment(appointmentId, status)
      fetchAppointments()
    } catch (error) {
      console.error("Error updating appointment:", error)
      setError("Failed to update appointment status. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Get status chip color
  const getStatusChip = (status) => {
    switch (status) {
      case "Confirmed":
        return (
          <Chip icon={<CheckCircle />} label="Confirmed" size="small" color="success" sx={{ fontWeight: "medium" }} />
        )
      case "Pending":
        return <Chip icon={<Pending />} label="Pending" size="small" color="warning" sx={{ fontWeight: "medium" }} />
      case "Rejected":
        return <Chip icon={<Cancel />} label="Rejected" size="small" color="error" sx={{ fontWeight: "medium" }} />
      default:
        return <Chip label={status} size="small" variant="outlined" sx={{ fontWeight: "medium" }} />
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Appointments
        </Typography>
        {user.role === "Patient" && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              py: 1,
              px: 2,
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                background: "linear-gradient(90deg, #1565c0, #1976d2)",
              },
            }}
          >
            Book Appointment
          </Button>
        )}
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
              <TextField
                select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  minWidth: 150,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </TextField>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <Skeleton variant="rectangular" height={60} />
          <Box sx={{ p: 2 }}>
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} variant="rectangular" height={50} sx={{ my: 1, borderRadius: 1 }} />
            ))}
          </Box>
        </Paper>
      ) : filteredAppointments.length > 0 ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          {isTablet ? (
            // Card view for mobile and tablet
            <Box>
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment._id}
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: 0,
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                bgcolor: "primary.light",
                                mr: 1.5,
                                width: 40,
                                height: 40,
                              }}
                            >
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {user.role === "Patient"
                                  ? `Dr. ${appointment.doctorId?.firstName} ${appointment.doctorId?.lastName}`
                                  : `${appointment.patientId?.firstName} ${appointment.patientId?.lastName}`}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {user.role === "Patient" ? "Doctor" : "Patient"}
                              </Typography>
                            </Box>
                          </Box>
                          {getStatusChip(appointment.status)}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <Event sx={{ color: "primary.main", mr: 1 }} />
                          <Typography variant="body2">{format(new Date(appointment.date), "PPP")}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AccessTime sx={{ color: "primary.main", mr: 1 }} />
                          <Typography variant="body2">{format(new Date(appointment.date), "p")}</Typography>
                        </Box>
                      </Grid>

                      {user.role === "Doctor" &&
                        appointment.doctorId?._id === user._id &&
                        appointment.status === "Pending" && (
                          <Grid item xs={12}>
                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleApproveAppointment(appointment._id, "Confirmed")}
                                startIcon={<CheckCircle />}
                                sx={{
                                  borderRadius: 2,
                                  textTransform: "none",
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleApproveAppointment(appointment._id, "Rejected")}
                                startIcon={<Close />}
                                sx={{
                                  borderRadius: 2,
                                  textTransform: "none",
                                }}
                              >
                                Reject
                              </Button>
                            </Box>
                          </Grid>
                        )}
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            // Table view for desktop
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Patient</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Doctor</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    {user.role === "Doctor" && <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow
                      key={appointment._id}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.02)",
                        },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              bgcolor: "primary.light",
                              mr: 1.5,
                              width: 35,
                              height: 35,
                            }}
                          >
                            <Event />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {format(new Date(appointment.date), "PPP")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(appointment.date), "p")}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              bgcolor: "success.light",
                              mr: 1.5,
                              width: 35,
                              height: 35,
                            }}
                          >
                            {appointment.patientId?.firstName?.charAt(0) || "P"}
                          </Avatar>
                          <Typography>
                            {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              bgcolor: "primary.light",
                              mr: 1.5,
                              width: 35,
                              height: 35,
                            }}
                          >
                            {appointment.doctorId?.firstName?.charAt(0) || "D"}
                          </Avatar>
                          <Typography>
                            Dr. {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusChip(appointment.status)}</TableCell>
                      {user.role === "Doctor" && (
                        <TableCell>
                          {appointment.status === "Pending" && appointment.doctorId?._id === user._id && (
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Tooltip title="Approve">
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  onClick={() => handleApproveAppointment(appointment._id, "Confirmed")}
                                  sx={{
                                    minWidth: 0,
                                    borderRadius: 2,
                                  }}
                                >
                                  <CheckCircle />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => handleApproveAppointment(appointment._id, "Rejected")}
                                  sx={{
                                    minWidth: 0,
                                    borderRadius: 2,
                                  }}
                                >
                                  <Close />
                                </Button>
                              </Tooltip>
                            </Box>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <EventAvailable sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No appointments found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== "all"
              ? "Try changing your search or filter criteria"
              : user.role === "Patient"
                ? "Book your first appointment with a doctor"
                : "You don't have any appointments yet"}
          </Typography>

          {user.role === "Patient" && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpen}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                py: 1,
                px: 2,
              }}
            >
              Book Appointment
            </Button>
          )}
        </Paper>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CalendarMonth color="primary" />
          Book Appointment
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              select
              fullWidth
              label="Select Doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              margin="normal"
              required
              SelectProps={{
                native: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  Dr. {doctor.firstName} {doctor.lastName} {doctor.specialization ? `(${doctor.specialization})` : ""}
                </option>
              ))}
            </TextField>
            <TextField
              fullWidth
              type="datetime-local"
              label="Appointment Date & Time"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBookAppointment}
            variant="contained"
            disabled={!selectedDoctor || !selectedDate || loading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                background: "linear-gradient(90deg, #1565c0, #1976d2)",
              },
            }}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Appointments
