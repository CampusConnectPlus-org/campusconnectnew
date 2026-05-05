import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageEventParticipation.css";

const ManageEventParticipation = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchEventName, setSearchEventName] = useState("");
    const [searchEnrollment, setSearchEnrollment] = useState("");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [rejectMessage, setRejectMessage] = useState("");

    const API_BASE = "http://localhost:5000/api/events";

    useEffect(() => {
        fetchParticipationRequests();
    }, [filterStatus]);

    const fetchParticipationRequests = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const url =
                filterStatus === "all"
                    ? `${API_BASE}/participation-requests`
                    : `${API_BASE}/participation-requests?status=${filterStatus}`;

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setRequests(response.data.data || []);
        } catch (error) {
            console.error("Error fetching participation requests:", error);
            alert("Failed to load participation requests");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            const token = localStorage.getItem("token");
            const adminId = localStorage.getItem("userId");

            await axios.put(
                `${API_BASE}/participation-requests/${requestId}/approve`,
                { adminId },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Participation approved and user notified!");
            setShowDetailModal(false);
            fetchParticipationRequests();
        } catch (error) {
            console.error("Error approving request:", error);
            alert("Failed to approve request");
        }
    };

    const handleReject = async (requestId) => {
        if (!rejectMessage.trim()) {
            alert("Please provide a message for rejection");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const adminId = localStorage.getItem("userId");

            await axios.put(
                `${API_BASE}/participation-requests/${requestId}/reject`,
                { adminId, adminMessage: rejectMessage },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Participation rejected and user notified!");
            setShowDetailModal(false);
            setRejectMessage("");
            fetchParticipationRequests();
        } catch (error) {
            console.error("Error rejecting request:", error);
            alert("Failed to reject request");
        }
    };

    const openDetailModal = (request) => {
        setSelectedRequest(request);
        setShowDetailModal(true);
        setRejectMessage("");
    };

    const handleDelete = async (requestId) => {
        if (window.confirm("Are you sure you want to delete this participation request?")) {
            try {
                const token = localStorage.getItem("token");

                await axios.delete(
                    `${API_BASE}/participation-requests/${requestId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                alert("Participation request deleted successfully!");
                setShowDetailModal(false);
                fetchParticipationRequests();
            } catch (error) {
                console.error("Error deleting request:", error);
                alert("Failed to delete request");
            }
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "pending":
                return "badge-warning";
            case "approved":
                return "badge-success";
            case "rejected":
                return "badge-danger";
            default:
                return "badge-secondary";
        }
    };

    // Apply filters to requests
    const filteredRequests = requests.filter((request) => {
        const matchName = request.name.toLowerCase().includes(searchName.toLowerCase());
        const matchEmail = request.email.toLowerCase().includes(searchEmail.toLowerCase());
        const matchEvent = request.eventTitle.toLowerCase().includes(searchEventName.toLowerCase());
        const matchEnrollment = request.enrollmentNo.toLowerCase().includes(searchEnrollment.toLowerCase());
        return matchName && matchEmail && matchEvent && matchEnrollment;
    });

    if (loading) {
        return <div className="manage-participation"><p>Loading participation requests...</p></div>;
    }

    return (
        <div className="manage-participation">
            <div className="participation-header">
                <h1>📋 Event Participation Management</h1>
                <p>Review, approve, and manage student participation requests for events</p>
            </div>

            {/* Status Filter Tabs */}
            <div className="participation-tabs">
                <button
                    className={`tab-btn ${filterStatus === "all" ? "active" : ""}`}
                    onClick={() => setFilterStatus("all")}
                >
                    All ({requests.length})
                </button>
                <button
                    className={`tab-btn ${filterStatus === "pending" ? "active" : ""}`}
                    onClick={() => setFilterStatus("pending")}
                >
                    Pending ({requests.filter((r) => r.status === "pending").length})
                </button>
                <button
                    className={`tab-btn ${filterStatus === "approved" ? "active" : ""}`}
                    onClick={() => setFilterStatus("approved")}
                >
                    Approved ({requests.filter((r) => r.status === "approved").length})
                </button>
                <button
                    className={`tab-btn ${filterStatus === "rejected" ? "active" : ""}`}
                    onClick={() => setFilterStatus("rejected")}
                >
                    Rejected ({requests.filter((r) => r.status === "rejected").length})
                </button>
            </div>

            {/* Search Filters */}
            <div className="participation-filters-container">
                <input
                    type="text"
                    placeholder="Search by enrollment no..."
                    value={searchEnrollment}
                    onChange={(e) => setSearchEnrollment(e.target.value)}
                    className="participation-filter-input"
                />
                <input
                    type="text"
                    placeholder="Search by student name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="participation-filter-input"
                />
                <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="participation-filter-input"
                />
                <input
                    type="text"
                    placeholder="Search by event name..."
                    value={searchEventName}
                    onChange={(e) => setSearchEventName(e.target.value)}
                    className="participation-filter-input"
                />
            </div>

            {/* Filter and apply logic */}
            <div className="participation-section">
                {filteredRequests.length > 0 ? (
                    <table className="participation-table">
                        <thead>
                            <tr>
                                <th>Enrollment No</th>
                                <th>Student Name</th>
                                <th>Email</th>
                                <th>Event</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((request) => (
                                <tr key={request._id}>
                                    <td>{request.enrollmentNo}</td>
                                    <td>{request.name}</td>
                                    <td>{request.email}</td>
                                    <td>{request.eventTitle}</td>
                                    <td>{new Date(request.appliedAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadgeColor(request.status)}`}>
                                            {request.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn view"
                                            onClick={() => openDetailModal(request)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-message">No participation requests found matching your filters</p>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedRequest && (
                <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Participation Request Details</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowDetailModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-section">
                                <h4>📋 Student Information</h4>
                                <div className="detail-row">
                                    <label>Name:</label>
                                    <span>{selectedRequest.name}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Email:</label>
                                    <span>{selectedRequest.email}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Enrollment No:</label>
                                    <span>{selectedRequest.enrollmentNo}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Year:</label>
                                    <span>{selectedRequest.year || "N/A"}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Branch:</label>
                                    <span>{selectedRequest.branch || "N/A"}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Mobile:</label>
                                    <span>{selectedRequest.mobile || "N/A"}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Gender:</label>
                                    <span>{selectedRequest.gender || "N/A"}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4>🎯 Event Information</h4>
                                <div className="detail-row">
                                    <label>Event:</label>
                                    <span>{selectedRequest.eventTitle}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Applied On:</label>
                                    <span>{new Date(selectedRequest.appliedAt).toLocaleString()}</span>
                                </div>
                                <div className="detail-row">
                                    <label>Status:</label>
                                    <span className={`status-badge ${getStatusBadgeColor(selectedRequest.status)}`}>
                                        {selectedRequest.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {selectedRequest.status === "pending" && (
                                <div className="detail-section">
                                    <h4>⚙️ Admin Actions</h4>
                                    <div className="detail-row">
                                        <label>Rejection Message (if rejecting):</label>
                                        <textarea
                                            value={rejectMessage}
                                            onChange={(e) => setRejectMessage(e.target.value)}
                                            placeholder="Enter reason for rejection (optional)"
                                            rows="3"
                                        />
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleApprove(selectedRequest._id)}
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => handleReject(selectedRequest._id)}
                                        >
                                            ✕ Reject
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(selectedRequest._id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedRequest.status !== "pending" && (
                                <div className="modal-footer">
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(selectedRequest._id)}
                                    >
                                        🗑️ Delete Record
                                    </button>
                                    <button
                                        className="btn-close"
                                        onClick={() => setShowDetailModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageEventParticipation;
