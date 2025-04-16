"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const AdminPanel = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/admin/users")
        setUsers(response.data)
      } catch (err) {
        setError("Failed to fetch users")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleApproveDoctor = async (doctorId) => {
    try {
      setLoading(true)
      const response = await axios.patch(`/admin/approve-doctor/${doctorId}`)

      setMessage({ text: response.data, type: "success" })

      // Update doctor status in the list
      setUsers((prev) => prev.map((user) => (user._id === doctorId ? { ...user, isApproved: true } : user)))
    } catch (err) {
      setMessage({ text: err.response?.data || "Failed to approve doctor", type: "danger" })
    } finally {
      setLoading(false)
    }
  }

  const handleRejectDoctor = async (doctorId) => {
    try {
      setLoading(true)
      const response = await axios.delete(`/admin/reject-doctor/${doctorId}`)

      setMessage({ text: response.data, type: "success" })

      // Remove doctor from the list
      setUsers((prev) => prev.filter((user) => user._id !== doctorId))
    } catch (err) {
      setMessage({ text: err.response?.data || "Failed to reject doctor", type: "danger" })
    } finally {
      setLoading(false)
    }
  }

  if (loading && !users.length) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  // Filter doctors that need approval
  const pendingDoctors = users.filter((user) => user.role === "Doctor" && !user.isApproved)

  // Filter approved doctors
  const approvedDoctors = users.filter((user) => user.role === "Doctor" && user.isApproved)

  // Filter patients
  const patients = users.filter((user) => user.role === "Patient")

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {message.text && <div className={`alert alert-${message.type} mb-4`}>{message.text}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <h2 className="text-xl font-semibold p-6 border-b">Pending Doctor Approvals</h2>

        {pendingDoctors.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No pending doctor approvals.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>License Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDoctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </td>
                    <td>{doctor.email}</td>
                    <td>{doctor.specialization || "N/A"}</td>
                    <td>{doctor.licenseNumber || "N/A"}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveDoctor(doctor._id)}
                          className="btn btn-secondary btn-sm"
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectDoctor(doctor._id)}
                          className="btn btn-danger btn-sm"
                          disabled={loading}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Approved Doctors</h2>

          {approvedDoctors.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No approved doctors.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialization</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedDoctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </td>
                      <td>{doctor.email}</td>
                      <td>{doctor.specialization || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Registered Patients</h2>

          {patients.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No registered patients.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient._id}>
                      <td>
                        {patient.firstName} {patient.lastName}
                      </td>
                      <td>{patient.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

