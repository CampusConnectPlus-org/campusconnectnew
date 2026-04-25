import React, { useState } from "react";

const departments = [
  "Computer Science", "Information Technology", "Electronics",
  "Mechanical", "Civil", "Chemical", "MBA", "MCA", "Other"
];

const ComplaintForm = () => {
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", enrollment: "", department: "", complaintText: ""
  });

  const handleSubmit = async () => {
    setError("");

    if (!form.complaintText.trim()) {
      return setError("Please write your complaint.");
    }
    if (!anonymous) {
      if (!form.name.trim()) return setError("Name is required.");
      if (!form.email.trim()) return setError("Email is required.");
      if (!form.enrollment.trim()) return setError("Enrollment number is required.");
      if (!form.department) return setError("Department is required.");
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/complaints/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, anonymous })
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError(data.error || "Something went wrong.");
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f6ff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 48, textAlign: "center", maxWidth: 440, boxShadow: "0 8px 32px rgba(37,99,235,0.12)", border: "1.5px solid #bfdbfe" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: "#1e3a8a", margin: "0 0 10px", fontSize: 22, fontWeight: 800 }}>Complaint Submitted!</h2>
          <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            Your complaint has been received. We will review it and respond within 24 hours.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: "", email: "", enrollment: "", department: "", complaintText: "" }); setAnonymous(false); }}
            style={{ padding: "12px 32px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 9,
    border: "1.5px solid #bfdbfe", fontSize: 13, background: "#f0f6ff",
    outline: "none", color: "#1e3a8a", boxSizing: "border-box", marginTop: 5
  };

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: "#2563eb",
    textTransform: "uppercase", letterSpacing: 0.8
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f6ff", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)",
        padding: "44px 24px 72px", textAlign: "center", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "40px 40px" }} />
        <p style={{ color: "#bfdbfe", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 10px", fontWeight: 700 }}>Campus Connect+</p>
        <h1 style={{ color: "#fff", fontSize: 34, fontWeight: 900, margin: "0 0 10px" }}>📢 Grievance Portal</h1>
        <p style={{ color: "#bfdbfe", fontSize: 14, margin: 0 }}>Submit your complaints — anonymous or identified</p>
      </div>

      <div style={{ maxWidth: 620, margin: "-40px auto 0", padding: "0 16px 48px", position: "relative" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: 32, boxShadow: "0 8px 32px rgba(37,99,235,0.10)", border: "1.5px solid #bfdbfe" }}>

          {/* Anonymous Toggle */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: anonymous ? "#eff6ff" : "#f8fafc",
            border: `1.5px solid ${anonymous ? "#93c5fd" : "#e2e8f0"}`,
            borderRadius: 12, padding: "14px 18px", marginBottom: 24, cursor: "pointer"
          }} onClick={() => setAnonymous(!anonymous)}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#1e3a8a", fontSize: 14 }}>
                {anonymous ? "🕵️ Anonymous Mode ON" : "👤 Submit with Identity"}
              </p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "#6b7280" }}>
                {anonymous ? "Your identity will not be revealed" : "Your name and email will be shared with admin"}
              </p>
            </div>
            <div style={{
              width: 44, height: 24, borderRadius: 12, background: anonymous ? "#2563eb" : "#d1d5db",
              position: "relative", transition: "background 0.2s", flexShrink: 0
            }}>
              <div style={{
                position: "absolute", top: 3, left: anonymous ? 22 : 3,
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
              }} />
            </div>
          </div>

          {/* Personal Details — hidden if anonymous */}
          {!anonymous && (
            <div>
              <h3 style={{ color: "#1e3a8a", fontSize: 14, fontWeight: 700, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 0.8 }}>
                Personal Details
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input style={inputStyle} placeholder="Your full name" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input style={inputStyle} placeholder="your@email.com" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Enrollment No. *</label>
                  <input style={inputStyle} placeholder="e.g. 21CTCS001" value={form.enrollment}
                    onChange={e => setForm(p => ({ ...p, enrollment: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Department *</label>
                  <select style={inputStyle} value={form.department}
                    onChange={e => setForm(p => ({ ...p, department: e.target.value }))}>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ height: 1, background: "#dbeafe", margin: "20px 0" }} />
            </div>
          )}

          {/* Complaint Text */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Your Complaint *</label>
            <textarea
              style={{ ...inputStyle, height: 140, resize: "vertical", lineHeight: 1.6 }}
              placeholder="Describe your complaint in detail. Be specific about what happened, when, and who was involved..."
              value={form.complaintText}
              onChange={e => setForm(p => ({ ...p, complaintText: e.target.value }))}
            />
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "4px 0 0" }}>
              {form.complaintText.length} characters
            </p>
          </div>

          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 9, padding: "12px 16px", color: "#dc2626", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading ? "#93c5fd" : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              color: "#fff", border: "none", borderRadius: 10,
              fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)"
            }}
          >
            {loading ? "Submitting..." : "📢 Submit Complaint"}
          </button>

          <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 14 }}>
            All complaints are reviewed within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;