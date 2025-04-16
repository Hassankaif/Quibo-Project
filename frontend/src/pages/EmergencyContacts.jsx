"use client"

import { useState, useEffect } from "react"
import { emergencyContactService } from "../services/api"
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  InputAdornment,
  Skeleton,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material"
import {
  Add,
  ContactPhone,
  Person,
  Phone,
  Contacts,
  Delete,
  Edit,
  PersonAdd,
  FamilyRestroom,
} from "@mui/icons-material"

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState({ text: "", type: "" })

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relation: "",
  })

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      // Using the service from your API services
      const data = await emergencyContactService.getContacts()
      setContacts(data || [])
    } catch (err) {
      setError("Failed to fetch emergency contacts")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      // Using the service from your API services
      await emergencyContactService.addContact(formData)

      setMessage({ text: "Emergency contact added successfully", type: "success" })

      // Reset form
      setFormData({
        name: "",
        phone: "",
        relation: "",
      })

      // Refresh contacts
      fetchContacts()
    } catch (err) {
      setMessage({ text: err.response?.data || "Failed to add emergency contact", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Emergency Contacts
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add and manage your emergency contacts for quick access during emergencies
        </Typography>
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

      <Grid container spacing={4}>
        <Grid item xs={12} md={5} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <PersonAdd sx={{ color: "primary.main", mr: 1.5, fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold">
                Add New Contact
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
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

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                margin="normal"
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

              <TextField
                fullWidth
                label="Relationship"
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FamilyRestroom color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<Add />}
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                    background: "linear-gradient(90deg, #1565c0, #1976d2)",
                  },
                }}
              >
                {loading ? "Adding..." : "Add Emergency Contact"}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7} lg={8}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ContactPhone sx={{ color: "primary.main", mr: 1.5, fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold">
                My Emergency Contacts
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ p: 3 }}>
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} variant="rectangular" height={50} sx={{ my: 1, borderRadius: 1 }} />
                ))}
              </Box>
            ) : contacts.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Phone Number</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Relationship</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow
                        key={contact._id}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(0,0,0,0.02)",
                          },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Person color="primary" sx={{ mr: 1 }} />
                            {contact.name}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Phone color="primary" sx={{ mr: 1 }} />
                            {contact.phone}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <FamilyRestroom color="primary" sx={{ mr: 1 }} />
                            {contact.relation}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex" }}>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                color="primary"
                                sx={{
                                  mr: 1,
                                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                sx={{
                                  "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Contacts sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No emergency contacts found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add your first emergency contact using the form
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default EmergencyContacts
