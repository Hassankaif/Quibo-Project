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
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material"
import { Email, Lock, Visibility, VisibilityOff, LocalHospital } from "@mui/icons-material"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      await login(email, password)
      navigate("/")
    } catch (err) {
      setError("Invalid email or password")
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
      <Container component="main" maxWidth="sm">
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

          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                boxShadow: "0 4px 20px rgba(25, 118, 210, 0.3)",
              }}
            >
              <LocalHospital sx={{ fontSize: 40 }} />
            </Box>
          </Box>

          <Typography
            component="h1"
            variant="h4"
            align="center"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "text.primary" }}
          >
            Welcome Back
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Sign in to access your healthcare portal
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
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

            <Box sx={{ textAlign: "right", mb: 2 }}>
              <Typography variant="body2" color="primary" sx={{ cursor: "pointer", fontWeight: 500 }}>
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                mb: 3,
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Typography variant="body1" color="primary" fontWeight="medium">
                  Don't have an account? <span style={{ fontWeight: "bold" }}>Sign Up</span>
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
