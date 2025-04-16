import axios from 'axios';

const API_URL = 'http://localhost:7777';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Auth Services
export const authService = {
  login: async (emailId, password) => {
    const response = await api.post('/login', { emailId, password });
    return response.data;
  },
  signup: async (userData) => {
    const response = await api.post('/signup', userData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  }
};

// User Services
export const userService = {
  updateProfile: async (profileData) => {
    const response = await api.patch('/profile/edit', profileData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/profile/view');
    return response.data;
  }
};

// Appointment Services
export const appointmentService = {
  bookAppointment: async (doctorId, date) => {
    const response = await api.post('/book', { doctorId, date });
    return response.data;
  },
  getMyAppointments: async () => {
    const response = await api.get('/my');
    return response.data;
  },
  approveAppointment: async (appointmentId, status) => {
    const response = await api.patch(`/approve/${appointmentId}`, { status });
    return response.data;
  }
};

// Prescription Services
export const prescriptionService = {
  addPrescription: async (prescriptionData) => {
    const response = await api.post('/add', prescriptionData);
    return response.data;
  },
  getPrescriptions: async () => {
    const response = await api.get('/prescription/my');
    return response.data;
  }
};

// Report Services
export const reportService = {
  addReport: async (reportData) => {
    const response = await api.post('/report/upload', reportData);
    return response.data;
  },
  getReports: async () => {
    const response = await api.get('/report/my');
    return response.data;
  }
};

// Emergency Contact Services
export const emergencyContactService = {
  addContact: async (contactData) => {
    const response = await api.post('/patient/emergency-contact', contactData);
    return response.data;
  },
  getContacts: async () => {
    const response = await api.get('/patient/emergency-contacts');
    return response.data;
  }
};

// Admin Services
export const adminService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  approveDoctor: async (doctorId) => {
    const response = await api.patch(`/admin/approve-doctor/${doctorId}`);
    return response.data;
  },
  rejectDoctor: async (doctorId) => {
    const response = await api.delete(`/admin/reject-doctor/${doctorId}`);
    return response.data;
  }
};

export default api; 