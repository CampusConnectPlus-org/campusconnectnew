import React, { useEffect, useState } from "react";
import axios from "axios";

function ComplaintBox() {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchData();
        
        // Auto-refresh every 5 seconds
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            let res = await axios.get(
                "http://localhost:5000/api/complaints/all"
            );
            setComplaints(res.data);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(
                `http://localhost:5000/api/complaints/status/${id}`,
                { status }
            );
            // Immediately refresh data after status update
            await fetchData();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div>
            <h2>All Complaints</h2>
            <button onClick={fetchData} style={{marginBottom: "10px", padding: "8px 12px", cursor: "pointer"}}>
                🔄 Refresh
            </button>
            {complaints.length === 0 ? (
                <p>No complaints yet</p>
            ) : (
                complaints.map(c => (
                    <div key={c._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
                        <p><strong>Name:</strong> {c.userName || "N/A"}</p>
                        <p><strong>Email:</strong> {c.userEmail || "N/A"}</p>
                        <p><strong>Complaint:</strong> {c.complaintText}</p>
                        <p><strong>Category:</strong> {c.category || "N/A"}</p>
                        <p><strong>Status:</strong> {c.status}</p>
                        <select 
                            value={c.status}
                            onChange={(e) => updateStatus(c._id, e.target.value)}
                        >
                            <option>Pending</option>
                            <option>Resolved</option>                                                   
                            <option>In Progress</option>
                        </select>
                    </div>
                ))
            )}
        </div>
    );
}

export default ComplaintBox;