import React, { useState } from "react";

const AdminScholarshipForm = () => {
  const [form, setForm] = useState({
    title: "",
    provider: "",
    category: "state",
    amount: "",
    deadline: "",
    eligibility: {
      casteCategory: [],
      maxIncome: "",
      minPercentage: "",
      genderRequired: "any"
    },
    documents: "",
    officialLink: "",
    status: "open"
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const casteOptions = ["General", "OBC", "SC", "ST", "EBC"];

  const handleCasteChange = (caste) => {
    const current = form.eligibility.casteCategory;
    const updated = current.includes(caste)
      ? current.filter(c => c !== caste)
      : [...current, caste];

    setForm(prev => ({
      ...prev,
      eligibility: { ...prev.eligibility, casteCategory: updated }
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.provider || !form.deadline) {
      setMessage("❌ Title, Provider aur Deadline zaroori hai!");
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      documents: form.documents.split(",").map(d => d.trim()).filter(Boolean),
      eligibility: {
        ...form.eligibility,
        maxIncome: Number(form.eligibility.maxIncome),
        minPercentage: Number(form.eligibility.minPercentage)
      }
    };

    const res = await fetch("http://localhost:5000/api/scholarships/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage("✅ Scholarship successfully add ho gayi!");
      setForm({
        title: "",
        provider: "",
        category: "state",
        amount: "",
        deadline: "",
        eligibility: {
          casteCategory: [],
          maxIncome: "",
          minPercentage: "",
          genderRequired: "any"
        },
        documents: "",
        officialLink: "",
        status: "open"
      });
    } else {
      setMessage("❌ " + (data.message || "Kuch error aaya"));
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    boxSizing: "border-box",
    marginTop: 4
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    display: "block",
    marginBottom: 2
  };

  const fieldStyle = {
    marginBottom: 16
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h2 style={{ marginBottom: 4 }}>➕ Add New Scholarship</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>Admin Panel — Naya scholarship add karo</p>

      {message && (
        <div style={{
          padding: "12px 16px",
          borderRadius: 8,
          marginBottom: 20,
          background: message.startsWith("✅") ? "#d1fae5" : "#fee2e2",
          color: message.startsWith("✅") ? "#065f46" : "#991b1b",
          fontWeight: 500
        }}>
          {message}
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 }}>

        {/* Basic Info */}
        <h3 style={{ marginTop: 0, color: "#4f46e5" }}>📋 Basic Information</h3>

        <div style={fieldStyle}>
          <label style={labelStyle}>Scholarship Title *</label>
          <input
            style={inputStyle}
            placeholder="e.g. Mukhyamantri Uchch Shiksha Scholarship"
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Provider *</label>
          <input
            style={inputStyle}
            placeholder="e.g. Rajasthan Government"
            value={form.provider}
            onChange={e => setForm(prev => ({ ...prev, provider: e.target.value }))}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Category</label>
            <select
              style={inputStyle}
              value={form.category}
              onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="state">🏛 State (Rajasthan)</option>
              <option value="central">🇮🇳 Central (NSP)</option>
              <option value="private">🏢 Private</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select
              style={inputStyle}
              value={form.status}
              onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="open">✅ Open</option>
              <option value="closed">❌ Closed</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Amount</label>
            <input
              style={inputStyle}
              placeholder="e.g. ₹5,000/year"
              value={form.amount}
              onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Deadline *</label>
            <input
              type="date"
              style={inputStyle}
              value={form.deadline}
              onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))}
            />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Official Link</label>
          <input
            style={inputStyle}
            placeholder="https://sje.rajasthan.gov.in"
            value={form.officialLink}
            onChange={e => setForm(prev => ({ ...prev, officialLink: e.target.value }))}
          />
        </div>

        {/* Eligibility */}
        <h3 style={{ color: "#4f46e5", marginTop: 24 }}>✅ Eligibility Criteria</h3>

        <div style={fieldStyle}>
          <label style={labelStyle}>Caste Category (multiple select kar sakte ho)</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            {casteOptions.map(c => (
              <label key={c} style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: form.eligibility.casteCategory.includes(c) ? "#ede9fe" : "#f9fafb",
                border: `1px solid ${form.eligibility.casteCategory.includes(c) ? "#7c3aed" : "#d1d5db"}`,
                padding: "6px 14px",
                borderRadius: 20,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: form.eligibility.casteCategory.includes(c) ? 600 : 400
              }}>
                <input
                  type="checkbox"
                  style={{ display: "none" }}
                  checked={form.eligibility.casteCategory.includes(c)}
                  onChange={() => handleCasteChange(c)}
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Max Family Income (₹)</label>
            <input
              type="number"
              style={inputStyle}
              placeholder="e.g. 250000"
              value={form.eligibility.maxIncome}
              onChange={e => setForm(prev => ({
                ...prev,
                eligibility: { ...prev.eligibility, maxIncome: e.target.value }
              }))}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Min Percentage (%)</label>
            <input
              type="number"
              style={inputStyle}
              placeholder="e.g. 60"
              value={form.eligibility.minPercentage}
              onChange={e => setForm(prev => ({
                ...prev,
                eligibility: { ...prev.eligibility, minPercentage: e.target.value }
              }))}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Gender</label>
            <select
              style={inputStyle}
              value={form.eligibility.genderRequired}
              onChange={e => setForm(prev => ({
                ...prev,
                eligibility: { ...prev.eligibility, genderRequired: e.target.value }
              }))}
            >
              <option value="any">Any</option>
              <option value="female">Female Only</option>
              <option value="male">Male Only</option>
            </select>
          </div>
        </div>

        {/* Documents */}
        <h3 style={{ color: "#4f46e5", marginTop: 24 }}>📄 Documents Required</h3>

        <div style={fieldStyle}>
          <label style={labelStyle}>Documents (comma se alag karo)</label>
          <textarea
            style={{ ...inputStyle, height: 80, resize: "vertical" }}
            placeholder="Jan Aadhaar Card, Income Certificate, Bonafide Certificate, Fee Receipt"
            value={form.documents}
            onChange={e => setForm(prev => ({ ...prev, documents: e.target.value }))}
          />
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>
            Example: Jan Aadhaar Card, Income Certificate, Marksheet
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#9ca3af" : "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 8
          }}
        >
          {loading ? "Adding..." : "➕ Add Scholarship"}
        </button>
      </div>
    </div>
  );
};

export default AdminScholarshipForm;