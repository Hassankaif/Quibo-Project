"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { userService } from "../services/api"
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  useTheme,
  useMediaQuery,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  Skeleton,
} from "@mui/material"
import { Email, Phone, Home, MedicalServices, WorkHistory, Edit, Save, Cancel, Person } from "@mui/icons-material"

const Profile = () => {
  const { user, updateUser } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        emailId: user.emailId || "",
        phone: user.phone || "",
        address: user.address || "",
        specialization: user.specialization || "",
        experience: user.experience || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedUser = await userService.updateProfile(formData)
      updateUser(updatedUser)
      setMessage({ text: "Profile updated successfully!", type: "success" })
      setIsEditing(false)
    } catch (error) {
      setMessage({ text: error.message || "Failed to update profile", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      emailId: user.emailId || "",
      phone: user.phone || "",
      address: user.address || "",
      specialization: user.specialization || "",
      experience: user.experience || "",
    })
    setIsEditing(false)
    setMessage({ text: "", type: "" })
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return "U"
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              height: "100%",
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                {getInitials()}
              </Avatar>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {user?.role === "Doctor" ? "Dr." : ""} {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {user?.role}
              </Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                  <Email fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                  {user?.emailId || <Skeleton width={150} />}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                  <Phone fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                  {user?.phone || <Skeleton width={120} />}
                </Typography>
              </Box>

              {user?.address && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ display: "flex" }}>
                    <Home fontSize="small" sx={{ mr: 1, mt: 0.3, color: "primary.main", flexShrink: 0 }} />
                    <span>{user.address}</span>
                  </Typography>
                </Box>
              )}

              {user?.role === "Doctor" && (
                <>
                  {user?.specialization && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Specialization
                      </Typography>
                      <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                        <MedicalServices fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                        {user.specialization}
                      </Typography>
                    </Box>
                  )}

                  {user?.experience && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Experience
                      </Typography>
                      <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                        <WorkHistory fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                        {user.experience} years
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h5" component="h1" fontWeight="bold">
                Profile Information
              </Typography>

              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    sx={{
                      mr: 1,
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSubmit}
                    disabled={loading}
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
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </Box>
              )}
            </Box>

            {message.text && (
              <Alert
                severity={message.type}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
                onClose={() => setMessage({ text: "", type: "" })}
              >
                {message.text}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={!isEditing}
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
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={!isEditing}
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
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="emailId"
                    type="email"
                    value={formData.emailId}
                    onChange={handleChange}
                    required
                    disabled
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
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={!isEditing}
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
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home color="primary" />
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
                {user?.role === "Doctor" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MedicalServices color="primary" />
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Years of Experience"
                        name="experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleChange}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WorkHistory color="primary" />
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
                  </>
                )}
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile
