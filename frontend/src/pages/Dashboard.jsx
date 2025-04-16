"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { appointmentService, prescriptionService } from "../services/api"
import {
  Container,
  Typography,
  Grid,
  Box,
  useTheme,
  useMediaQuery,
  Alert,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  LinearProgress,
  Divider,
  Paper,
  Skeleton,
} from "@mui/material"
import {
  CalendarToday,
  LocalHospital,
  Description,
  Person,
  ContactPhone,
  AccessTime,
  CheckCircle,
  PendingActions,
  MedicalServices,
  HealthAndSafety,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const { user } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    appointments: 0,
    prescriptions: 0,
    reports: 0,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [upcomingAppointments, setUpcomingAppointments] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError("")
        const appointments = await appointmentService.getMyAppointments()
        const prescriptions = await prescriptionService.getPrescriptions()

        // Filter upcoming appointments (for demo purposes)
        const upcoming = appointments.filter((app) => app.status === "Confirmed").slice(0, 3)
        setUpcomingAppointments(upcoming)

        setStats({
          appointments: appointments.length,
          prescriptions: prescriptions.length,
          reports: Math.floor(Math.random() * 5), // Simulated data
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        setError("Failed to load dashboard statistics. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  const menuItems = [
    {
      title: "Appointments",
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      path: "/appointments",
      count: stats.appointments,
      color: "#4CAF50",
      bgColor: "rgba(76, 175, 80, 0.08)",
    },
    {
      title: "Prescriptions",
      icon: <LocalHospital sx={{ fontSize: 40 }} />,
      path: "/prescriptions",
      count: stats.prescriptions,
      color: "#2196F3",
      bgColor: "rgba(33, 150, 243, 0.08)",
    },
    {
      title: "Medical Reports",
      icon: <Description sx={{ fontSize: 40 }} />,
      path: "/reports",
      count: stats.reports,
      color: "#FF9800",
      bgColor: "rgba(255, 152, 0, 0.08)",
    },
    {
      title: "My Profile",
      icon: <Person sx={{ fontSize: 40 }} />,
      path: "/profile",
      color: "#9C27B0",
      bgColor: "rgba(156, 39, 176, 0.08)",
    },
    {
      title: "Emergency Contacts",
      icon: <ContactPhone sx={{ fontSize: 40 }} />,
      path: "/patient/emergency-contacts",
      color: "#F44336",
      bgColor: "rgba(244, 67, 54, 0.08)",
    },
  ]

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ mb: 4, display: "flex", flexDirection: "column" }}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1" fontWeight="bold" sx={{ mb: 1 }}>
          {getGreeting()}, {user?.firstName}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ mb: 4 }}>
          <LinearProgress sx={{ borderRadius: 1 }} />
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  color: "white",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant={isMobile ? "h6" : "h5"} fontWeight="medium" gutterBottom>
                      {user?.role === "Doctor" ? "Doctor Dashboard" : "Patient Portal"}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      {user?.role === "Doctor"
                        ? "Manage your appointments, create prescriptions, and upload medical reports for your patients."
                        : "Track your health information, appointments, and prescriptions all in one place."}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: "auto",
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      }}
                    >
                      <HealthAndSafety sx={{ fontSize: 40 }} />
                    </Avatar>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "rgba(25, 118, 210, 0.03)" }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {loading ? <Skeleton width={40} sx={{ mx: "auto" }} /> : stats.appointments}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Appointments
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {loading ? <Skeleton width={40} sx={{ mx: "auto" }} /> : stats.prescriptions}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Prescriptions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {loading ? <Skeleton width={40} sx={{ mx: "auto" }} /> : stats.reports}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reports
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              Upcoming Appointments
            </Typography>

            {loading ? (
              <Grid container spacing={2}>
                {[1, 2].map((item) => (
                  <Grid item xs={12} key={item}>
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                      <Skeleton variant="rectangular" height={100} />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : upcomingAppointments.length > 0 ? (
              <Grid container spacing={2}>
                {upcomingAppointments.map((appointment, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid rgba(0,0,0,0.05)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={2} sm={1}>
                          <Avatar
                            sx={{
                              bgcolor: "primary.light",
                              width: 40,
                              height: 40,
                            }}
                          >
                            <AccessTime />
                          </Avatar>
                        </Grid>
                        <Grid item xs={10} sm={7}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {user.role === "Patient"
                              ? `Dr. ${appointment.doctorId?.firstName} ${appointment.doctorId?.lastName}`
                              : `${appointment.patientId?.firstName} ${appointment.patientId?.lastName}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(appointment.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "left", sm: "right" } }}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              fontWeight: "medium",
                              bgcolor: "success.light",
                              color: "success.dark",
                            }}
                          >
                            <CheckCircle sx={{ fontSize: 16, mr: 0.5 }} />
                            Confirmed
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {new Date(appointment.date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.05)",
                  textAlign: "center",
                  bgcolor: "rgba(0,0,0,0.01)",
                }}
              >
                <PendingActions sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                <Typography color="text.secondary">No upcoming appointments scheduled</Typography>
              </Paper>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
            Quick Access
          </Typography>

          <Grid container spacing={2}>
            {menuItems.map((item) => (
              <Grid item key={item.title} xs={6} md={4} lg={6}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    borderRadius: 3,
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      borderColor: item.color,
                    },
                  }}
                >
                  <CardActionArea sx={{ height: "100%", p: 1 }} onClick={() => navigate(item.path)}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          mx: "auto",
                          mb: 2,
                          color: item.color,
                          bgcolor: item.bgColor,
                        }}
                      >
                        {item.icon}
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        component="h2"
                        fontWeight="medium"
                        color="text.primary"
                        gutterBottom
                      >
                        {item.title}
                      </Typography>

                      {item.count !== undefined && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ color: item.color }}>
                              {loading ? <Skeleton width={30} /> : item.count}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <MedicalServices sx={{ color: "primary.main", mr: 1.5, fontSize: 24 }} />
                <Typography variant="h6" fontWeight="bold">
                  Health Tips
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Regular exercise can help reduce stress, improve sleep quality, and boost your immune system.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remember to stay hydrated and maintain a balanced diet for optimal health.
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard
