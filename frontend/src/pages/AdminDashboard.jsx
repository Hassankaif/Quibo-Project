import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import {
  Group,
  MedicalInformation,
  Person,
  Block,
  CreditCard,
} from "@mui/icons-material";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { adminService } from "../services/api";
import moment from "moment";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalUsers = users.length;
  const doctors = users.filter((u) => u.role?.toLowerCase() === "doctor");
  const patients = users.filter((u) => u.role?.toLowerCase() === "patient");
  const admins = users.filter((u) => u.role?.toLowerCase() === "admin");
  const blocked = users.filter((u) => u.status === "blocked");
  const expired = users.filter((u) => u.licenseExpired);

  const recentActivity = [...users]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, 6)
    .map((u) => ({
      id: u._id,
      user: `${u.firstName} ${u.lastName}`,
      action: u.updatedAt !== u.createdAt ? "Updated Profile" : "New User",
      timestamp: moment(u.updatedAt || u.createdAt).format(
        "YYYY-MM-DD hh:mm A"
      ),
    }));

  const cards = [
    {
      title: "Total Users",
      count: totalUsers,
      icon: <Group color="primary" fontSize="large" />,
    },
    {
      title: "Doctors",
      count: doctors.length,
      icon: <MedicalInformation color="success" fontSize="large" />,
    },
    {
      title: "Patients",
      count: patients.length,
      icon: <Person color="warning" fontSize="large" />,
    },
    {
      title: "Blocked Users",
      count: blocked.length,
      icon: <Block color="error" fontSize="large" />,
    },
    {
      title: "Expired Licenses",
      count: expired.length,
      icon: <CreditCard color="info" fontSize="large" />,
    },
  ];

  const doughnutData = {
    labels: ["Doctors", "Patients", "Admins"],
    datasets: [
      {
        label: "Role Distribution",
        data: [doctors.length, patients.length, admins.length],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "User Signups",
        data: [1, 3, 2, 5, totalUsers],
        backgroundColor: "#42a5f5",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9fbfc", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <CircularProgress />
          <Typography variant="subtitle1" mt={2}>
            Loading data...
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} justifyContent="center" mt={1}>
            {cards.map((card, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <Paper
                  elevation={4}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    textAlign: "center",
                    height: "130px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#f1f1f1",
                      p: 1,
                      borderRadius: "50%",
                      mb: 1,
                      display: "inline-flex",
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={500}>
                    {card.title}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {card.count}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} mt={3} justifyContent="center">
            <Grid item xs={12} md={3.8}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  height: 340,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                  Role Distribution
                </Typography>
                <Box sx={{ width: "100%", maxWidth: 250 }}>
                  <Doughnut data={doughnutData} options={{ cutout: "70%" }} />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3.8}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  height: 340,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                  User Activity
                </Typography>
                <Box sx={{ width: "100%", maxWidth: 300 }}>
                  <Bar data={barData} options={barOptions} />
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={3.8}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  height: 340,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                  Recent Activity
                </Typography>
                <Box sx={{ width: "100%", maxHeight: 250, overflowY: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.8rem",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          textAlign: "left",
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <th>User</th>
                        <th>Action</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map(({ id, user, action, timestamp }) => (
                        <tr key={id}>
                          <td>{user}</td>
                          <td>{action}</td>
                          <td>{timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;
