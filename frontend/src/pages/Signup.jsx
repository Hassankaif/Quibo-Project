"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Paper,
  MenuItem,
  Grid,
  InputAdornment,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Person, Email, Phone, Lock, Badge, LocalHospital, ArrowBack } from "@mui/icons-material"

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    phone: "",
    role: "Patient",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await signup(formData)
      navigate("/login")
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        py: 4,
      }}
    >
      <Container component="main" maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            width: "100%",
            borderRadius: 3,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/login")}
              sx={{
                color: "text.secondary",
                mr: 2,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              Back
            </Button>
            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  color: "white",
                  boxShadow: "0 4px 20px rgba(25, 118, 210, 0.3)",
                  mb: 2,
                }}
              >
                <LocalHospital sx={{ fontSize: 35 }} />
              </Box>
            </Box>
            <Box sx={{ width: 100 }} /> {/* Spacer for alignment */}
          </Box>

          <Typography
            component="h1"
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "text.primary" }}
          >
            Create Account
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Join our healthcare platform to manage your medical needs
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="emailId"
                  label="Email Address"
                  name="emailId"
                  autoComplete="email"
                  value={formData.emailId}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  id="role"
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.1)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                      },
                    },
                  }}
                >
                  <MenuItem value="Patient">Patient</MenuItem>
                  <MenuItem value="Doctor">Doctor</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                  background: "linear-gradient(90deg, #1565c0, #1976d2)",
                },
              }}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Typography variant="body1" color="primary" fontWeight="medium">
                  Already have an account? <span style={{ fontWeight: "bold" }}>Sign In</span>
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Signup
