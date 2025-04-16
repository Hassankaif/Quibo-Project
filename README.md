# 🏥 Healthcare Management System

A modern full-stack web application designed to streamline healthcare management for patients, doctors, and administrators. The system supports appointment booking, prescriptions, reports, emergency contacts, and user authentication, all backed by a secure Node.js/Express.js backend and a React.js frontend.

---



## 📌 Features

### 👤 Authentication & Authorization
- Secure login and signup
- Role-based access for Patients, Doctors, and Admins
- Cookie-based session management

### 📅 Appointments
- Patients can book appointments with doctors
- Doctors can approve/reject appointments
- Appointments are visible on the dashboard

### 📝 Prescriptions
- Doctors can add prescriptions for patients
- Patients can view their prescriptions

### 📄 Reports
- Upload and view medical reports securely

### 📞 Emergency Contacts
- Patients can add, view, and manage emergency contact information

### 🧑‍⚕️ Admin Panel
- Admin can view users
- Approve or reject doctor registrations

---

## ⚙️ Tech Stack

| Frontend          | Backend               | Database   | Auth        | Styling            |
|------------------|-----------------------|------------|-------------|--------------------|
| React.js + Vite  | Node.js, Express.js   | MongoDB    | JWT + Cookies | TailwindCSS + MUI  |

---

## 📁 Project Structure

```
healthcare-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   ├── routes/
│   │   ├── appointment.js
│   │   ├── auth.js
│   │   ├── patient.js
│   │   ├── prescription.js
│   │   ├── report.js
│   │   ├── admin.js
│   │   └── profile.js
│   ├── .env
│   ├── app.js
│   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```


---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js & npm
- MongoDB (local or Atlas)
- Git

### 📦 Backend Setup

```bash
cd server
npm install

```
### Create a .env file in /server:
```bash 
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the server:
```bash
npm run dev
```

### 💻 Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 🔐 Environment Variables
In the /server/.env file:
```bash
PORT=7777
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

# 🛠️ API Endpoints
### ✅ Auth
```bash
POST /signup

POST /login

POST /logout
```


### 👤 Profile
```bash
GET /profile/view

PATCH /profile/edit
```


### 📅 Appointments
```bash
POST /appointment/book

GET /appointment/my

PATCH /appointment/approve/:appointmentId
```


### 📝 Prescriptions
```bash
POST /prescription/add

GET /prescription/my
```


### 📄 Reports
```bash
POST /report/upload

GET /report/my
```


### 🆘 Emergency Contacts
```bash
POST /patient/emergency-contact

GET /patient/emergency-contacts
```


### 🧑‍⚕️ Admin
```bash
GET /admin/users

PATCH /admin/approve-doctor/:doctorId

DELETE /admin/reject-doctor/:doctorId
```


# 🧪 Screenshots
### ✅ Login 
![page 1](frontend2\public\login.png)
### ✅ Signup
![This is an example caption](frontend2\public\Signup.png)
### 👤 User Dashboard
![This is an example caption](frontend2\public\Dashboard.png)
### 💻 Navigation Bar
![This is an example caption](frontend2\public\NavigationBar.png)
### 📅 Appointments
![page 5](frontend2\public\apponitment.png)
### 📝 Prescriptions
![page 5](frontend2\public\Prescription.png)
### 👤 Profile
![page 5](frontend2\public\profile.png)


## 🧑‍💻 Contributors
The Following Students from Rajalakshmi institute of Technology, Chennai.
1. Sanjal S
2. Hassan Kaif
3. Darshini kumar
4. Sudharshan sivakumar
5. sandhiya sakthivel
6. Sridharan S


## 🤝 Contributing
Fork the repository

Clone your fork

Create a feature branch (git checkout -b feature-name)

Commit your changes (git commit -m "feat: added xyz")

Push to your branch (git push origin feature-name)

Open a Pull Request 🚀

## 📜 License
This project is licensed under the MIT License.

## 💬 Feedback
Have ideas or issues? Feel free to open an issue or contact me directly.

