import React, { useState, useEffect } from "react";
import "./ComplaintPage.css";
import axios from "axios";
import { Navigate } from "react-router-dom";

function ComplaintPage() {
  // Check if user is logged in and not an admin
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin");
  
  // If no token, redirect to login (ProtectedRoute will handle this)
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If user is admin, redirect to home
  if (admin) {
    return <Navigate to="/" />;
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enrollment: "",
    department: "",
    complaintText: "",
    anonymous: false
  });

  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [allComplaints, setAllComplaints] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  // Fetch all complaints periodically
  useEffect(() => {
    const interval = setInterval(fetchAllComplaints, 3000);
    return () => clearInterval(interval);
  }, [userEmail]);

  const fetchAllComplaints = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/complaints/all"
      );
      if (userEmail) {
        // Filter complaints by user email (for non-anonymous complaints)
        const userComplaints = res.data.filter(
          c => c.userEmail === userEmail || c.userEmail === "anonymous@example.com"
        );
        setAllComplaints(userComplaints);
      } else {
        setAllComplaints(res.data);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({...formData,[name]:type === "checkbox"  ? checked  : value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      enrollment: "",
      department: "",
      complaintText: "",
      anonymous: false
    });
    setSubmittedComplaint(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.complaintText.trim()) {
      alert("Please write your complaint");
      return;
    }

    if (!formData.anonymous) {
      if (!formData.name.trim()) {
        alert("Please enter your name");
        return;
      }
      if (!formData.email.trim()) {
        alert("Please enter your email");
        return;
      }
      if (!formData.enrollment.trim()) {
        alert("Please enter your enrollment number");
        return;
      }
      if (!formData.department.trim()) {
        alert("Please enter your department");
        return;
      }
    }

    console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/complaints/add",
        formData
      );
      alert("Complaint Submitted Successfully!");
      setSubmittedComplaint({
        id: response.data.complaint._id,
        email: formData.email
      });
      setUserEmail(formData.email || "anonymous@example.com");
      fetchAllComplaints();
      resetForm();
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.error || "Error submitting complaint");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Pending":
        return "#FF9800";
      case "In Progress":
        return "#2196F3";
      case "Resolved":
        return "#4CAF50";
      default:
        return "#999";
    }
  };

  const getStatusEmoji = (status) => {
    switch(status) {
      case "Pending":
        return "⏳";
      case "In Progress":
        return "🔄";
      case "Resolved":
        return "✅";
      default:
        return "❓";
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px", minHeight: "100vh" }}>
      {/* Left Side - Form */}
      <div style={{ flex: 1, minWidth: "400px" }}>
        <div className="complaint-container">
          <h2> Register Complaint </h2>

          <form onSubmit={handleSubmit}>
            <label className="ac">
              Anonymous Complaint
            </label>

            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={(e)=>
              setFormData({
                ...formData,
                anonymous:e.target.checked
              })
            }
            />

            {
              !formData.anonymous && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="enrollment"
                    placeholder="Enrollment"
                    value={formData.enrollment}
                    onChange={handleChange}
                  />    
                   
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </>
              )
            }

            <textarea
              name="complaintText"
              placeholder="Write Complaint"
              value={formData.complaintText}
              onChange={handleChange}
            />

            <button type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Complaints List */}
      <div style={{ 
        flex: 1, 
        minWidth: "350px",
        background: "#1e293b",
        padding: "20px",
        borderRadius: "8px",
        border: "2px solid #475569",
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
        <h2 style={{ color: "#e2e8f0", marginTop: 0 }}>📋 Your Complaints</h2>
        
        {allComplaints.length === 0 ? (
          <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "20px" }}>
            No complaints submitted yet
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {allComplaints.map((complaint) => (
              <div
                key={complaint._id}
                style={{
                  background: "#334155",
                  padding: "12px",
                  borderRadius: "6px",
                  border: `2px solid ${getStatusColor(complaint.status)}`,
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "10px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ 
                      color: "#cbd5e1", 
                      margin: "0 0 5px 0", 
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      {complaint.userName}
                    </p>
                    <p style={{ 
                      color: "#94a3b8", 
                      margin: "0 0 5px 0", 
                      fontSize: "11px",
                      wordBreak: "break-word"
                    }}>
                      {complaint.complaintText.substring(0, 50)}...
                    </p>
                    <p style={{ 
                      color: "#64748b", 
                      margin: "0", 
                      fontSize: "10px"
                    }}>
                      ID: {complaint._id.substring(0, 8)}...
                    </p>
                  </div>
                  <div style={{
                    background: "#1e293b",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    minWidth: "80px"
                  }}>
                    <p style={{
                      margin: 0,
                      color: getStatusColor(complaint.status),
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      {getStatusEmoji(complaint.status)} {complaint.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {userEmail && (
          <button
            onClick={fetchAllComplaints}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "10px",
              background: "#38bdf8",
              color: "#0f172a",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s"
            }}
            onMouseOver={(e) => e.target.style.background = "#0ea5e9"}
            onMouseOut={(e) => e.target.style.background = "#38bdf8"}
          >
            🔄 Refresh
          </button>
        )}
      </div>
    </div>
  )
}

export default ComplaintPage;