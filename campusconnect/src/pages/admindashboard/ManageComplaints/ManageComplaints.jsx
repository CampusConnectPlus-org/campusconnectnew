import React, { useEffect, useState } from "react";

const statusConfig = {
  "Pending": { color: "#d97706", bg: "#fef3c7", border: "#fde68a" },
  "In Progress": { color: "#2563eb", bg: "#dbeafe", border: "#93c5fd" },
  "Resolved": { color: "#059669", bg: "#d1fae5", border: "#6ee7b7" },
  "Rejected": { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" }
};

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/complaints/all");
    const data = await res.json();
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    await fetch(`http://localhost:5000/api/complaints/status/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    setUpdatingId(null);
    fetchComplaints();
  };

  const filtered = filter === "All" ? complaints : complaints.filter(c => c.status === filter);

  const counts = {
    All: complaints.length,
    Pending: complaints.filter(c => c.status === "Pending").length,
    "In Progress": complaints.filter(c => c.status === "In Progress").length,
    Resolved: complaints.filter(c => c.status === "Resolved").length,
    Rejected: complaints.filter(c => c.status === "Rejected").length
  };

  return (
    <div style={{ padding: 24, fontFamily: "'Segoe UI', sans-serif", background: "#f0f6ff", minHeight: "100vh" }}>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "#1e3a8a", margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>📢 Manage Complaints</h2>
        <p style={{ color: "#6b7280", margin: 0, fontSize: 13 }}>Review and update student grievances</p>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total", value: counts.All, color: "#1e3a8a", bg: "#dbeafe" },
          { label: "Pending", value: counts.Pending, color: "#d97706", bg: "#fef3c7" },
          { label: "In Progress", value: counts["In Progress"], color: "#2563eb", bg: "#eff6ff" },
          { label: "Resolved", value: counts.Resolved, color: "#059669", bg: "#d1fae5" },
          { label: "Rejected", value: counts.Rejected, color: "#dc2626", bg: "#fee2e2" }
        ].map(stat => (
          <div key={stat.label} style={{ background: stat.bg, borderRadius: 12, padding: "16px 18px", border: `1px solid ${stat.color}33` }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: stat.color, fontWeight: 600, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* FILTER TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "#fff", padding: 6, borderRadius: 12, boxShadow: "0 2px 8px rgba(37,99,235,0.08)", border: "1px solid #dbeafe", flexWrap: "wrap" }}>
        {["All", "Pending", "In Progress", "Resolved", "Rejected"].map(tab => (
          <button key={tab} onClick={() => setFilter(tab)} style={{
            flex: 1, minWidth: 80, padding: "9px 6px", border: "none", borderRadius: 8, cursor: "pointer",
            fontSize: 12, fontWeight: 700,
            background: filter === tab ? "#2563eb" : "transparent",
            color: filter === tab ? "#fff" : "#6b7280"
          }}>
            {tab} ({counts[tab] || 0})
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 32 }}>⏳</div>
          <p style={{ color: "#6b7280" }}>Loading complaints...</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, border: "1px solid #dbeafe" }}>
          <div style={{ fontSize: 48 }}>📭</div>
          <h3 style={{ color: "#1e3a8a" }}>No complaints found</h3>
          <p style={{ color: "#6b7280" }}>No {filter !== "All" ? filter.toLowerCase() : ""} complaints yet</p>
        </div>
      )}

      {/* COMPLAINT CARDS */}
      {filtered.map(c => {
        const cfg = statusConfig[c.status] || statusConfig["Pending"];
        const isExpanded = expanded === c._id;

        return (
          <div key={c._id} style={{
            background: "#fff", borderRadius: 14, marginBottom: 14,
            boxShadow: "0 2px 12px rgba(37,99,235,0.07)",
            border: "1.5px solid #dbeafe", overflow: "hidden"
          }}>
            <div style={{ height: 4, background: cfg.color }} />

            <div style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontSize: 11, fontWeight: 800, padding: "3px 12px", borderRadius: 20 }}>
                      {c.status}
                    </span>
                    {c.anonymous && (
                      <span style={{ background: "#f3f4f6", color: "#374151", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>
                        🕵️ Anonymous
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {!c.anonymous && (
                    <div style={{ display: "flex", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, color: "#1e3a8a", fontWeight: 600 }}>👤 {c.userName}</span>
                      <span style={{ fontSize: 13, color: "#6b7280" }}>✉️ {c.userEmail}</span>
                      {c.enrollment && <span style={{ fontSize: 13, color: "#6b7280" }}>🎓 {c.enrollment}</span>}
                      {c.department && <span style={{ fontSize: 13, color: "#6b7280" }}>🏛 {c.department}</span>}
                    </div>
                  )}

                  <p style={{
                    margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6,
                    display: isExpanded ? "block" : "-webkit-box",
                    WebkitLineClamp: isExpanded ? "unset" : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: isExpanded ? "visible" : "hidden"
                  }}>
                    {c.complaintText}
                  </p>

                  {c.complaintText?.length > 120 && (
                    <button onClick={() => setExpanded(isExpanded ? null : c._id)}
                      style={{ background: "none", border: "none", color: "#2563eb", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: "4px 0", marginTop: 4 }}>
                      {isExpanded ? "Show less ▲" : "Read more ▼"}
                    </button>
                  )}
                </div>

                {/* Status Updater */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 150 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8 }}>Update Status</label>
                  <select
                    value={c.status}
                    disabled={updatingId === c._id}
                    onChange={e => handleStatusUpdate(c._id, e.target.value)}
                    style={{
                      padding: "9px 12px", borderRadius: 8,
                      border: `1.5px solid ${cfg.border}`,
                      background: cfg.bg, color: cfg.color,
                      fontSize: 13, fontWeight: 700, cursor: "pointer", outline: "none"
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  {updatingId === c._id && (
                    <span style={{ fontSize: 11, color: "#2563eb", fontWeight: 600 }}>Updating...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManageComplaints;