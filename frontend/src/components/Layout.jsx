"use client"

import { Outlet } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
  Tooltip,
  ListItemButton,
} from "@mui/material"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import {
  Dashboard,
  CalendarToday,
  LocalHospital,
  Description,
  Person,
  ContactPhone,
  Menu as MenuIcon,
  Notifications,
  Settings,
  Logout,
  ChevronLeft,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

const Layout = () => {
  const { user, logout } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleClose()
    await logout()
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Appointments", icon: <CalendarToday />, path: "/appointments" },
    { text: "Prescriptions", icon: <LocalHospital />, path: "/prescriptions" },
    { text: "Reports", icon: <Description />, path: "/reports" },
    { text: "Profile", icon: <Person />, path: "/profile" },
    { text: "Emergency Contacts", icon: <ContactPhone />, path: "/patient/emergency-contacts" },
  ]

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      setDrawerOpen(false)
    }
  }

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return "U"
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`
  }

  // Get current page name
  const getCurrentPageName = () => {
    const path = window.location.pathname
    if (path === "/") return "Dashboard"

    const item = menuItems.find((item) => item.path === path)
    return item ? item.text : "Page"
  }

  const drawerContent = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
          HMS Portal
        </Typography>
        {isMobile && (
          <IconButton onClick={toggleDrawer} size="small">
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      {user && (
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <Avatar
            sx={{
              width: 70,
              height: 70,
              mb: 1.5,
              bgcolor: "primary.main",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            {getInitials()}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {user.role === "Doctor" ? "Dr." : ""} {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {user.role}
          </Typography>
        </Box>
      )}

      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem disablePadding key={item.text}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 0,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  bgcolor: window.location.pathname === item.path ? "primary.main" : "transparent",
                  transition: "all 0.2s ease-in-out",
                },
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
                ...(window.location.pathname === item.path && {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  color: window.location.pathname === item.path ? "primary.main" : "text.secondary",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: window.location.pathname === item.path ? "bold" : "regular",
                  color: window.location.pathname === item.path ? "primary.main" : "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2, borderTop: "1px solid rgba(0, 0, 0, 0.08)" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "rgba(220, 0, 78, 0.08)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              color: "error.main",
              fontWeight: "medium",
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "text.primary",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Toolbar>
          {user && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{
                mr: 2,
                color: "text.secondary",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocalHospital sx={{ color: "primary.main", mr: 1.5, fontSize: 28 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" },
              }}
            >
              Healthcare Management
            </Typography>
          </Box>

          {user && (
            <Box sx={{ ml: { xs: 1, md: 4 } }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "medium",
                  color: "text.secondary",
                  display: { xs: "none", md: "block" },
                }}
              >
                {getCurrentPageName()}
              </Typography>
            </Box>
          )}

          {user && (
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
              <Tooltip title="Notifications">
                <IconButton
                  color="inherit"
                  sx={{
                    ml: 1,
                    color: "text.secondary",
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Settings">
                <IconButton
                  color="inherit"
                  sx={{
                    ml: 1,
                    color: "text.secondary",
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <Settings />
                </IconButton>
              </Tooltip>

              <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", ml: 2 }}>
                <Typography variant="body2" sx={{ mr: 1, color: "text.secondary" }}>
                  {user.role === "Doctor" ? "Dr." : ""} {user.firstName}
                </Typography>
              </Box>

              <IconButton
                size="medium"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{
                  ml: 1,
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <Avatar
                  sx={{
                    width: 35,
                    height: 35,
                    bgcolor: "primary.main",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  {getInitials()}
                </Avatar>
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 180,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose()
                    navigate("/profile")
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose()
                    navigate("/settings")
                  }}
                  sx={{ py: 1.5 }}
                >
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: "error.main" }}>
                  <ListItemIcon>
                    <Logout fontSize="small" color="error" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {user && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          variant={isMobile ? "temporary" : "persistent"}
          sx={{
            width: drawerOpen && !isMobile ? 280 : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 280,
              boxSizing: "border-box",
              borderRight: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: isMobile ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Container
        maxWidth={false}
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          ml: drawerOpen && !isMobile ? "280px" : 0,
          width: drawerOpen && !isMobile ? "calc(100% - 280px)" : "100%",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          backgroundColor: "white",
          color: "text.secondary",
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          ml: drawerOpen && !isMobile ? "280px" : 0,
          width: drawerOpen && !isMobile ? "calc(100% - 280px)" : "100%",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth={false}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Healthcare Management System | All Rights Reserved
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default Layout
