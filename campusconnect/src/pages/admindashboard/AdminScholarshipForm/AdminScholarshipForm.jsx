import React, { useState } from "react";
import "./AdminScholarshipForm.css";

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
      setTimeout(() => setMessage(""), 4000);
    } else {
      setMessage("❌ " + (data.message || "Kuch error aaya"));
    }
  };

  return (
    <div className="scholarship-wrapper">
      <div className="scholarship-container">
        {/* Header */}
        <div className="scholarship-header">
          <h2>➕ Add New Scholarship</h2>
          <p>Admin Panel — Naya scholarship add karo</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`scholarship-message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        {/* Form Card */}
        <div className="scholarship-form-card">

          {/* Basic Information */}
          <div className="form-section">
            <h3 className="form-section-title">📋 Basic Information</h3>

            <div className="form-field">
              <label className="form-field-label">Scholarship Title *</label>
              <input
                className="form-field-input"
                placeholder="e.g. Mukhyamantri Uchch Shiksha Scholarship"
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="form-field">
              <label className="form-field-label">Provider *</label>
              <input
                className="form-field-input"
                placeholder="e.g. Rajasthan Government"
                value={form.provider}
                onChange={e => setForm(prev => ({ ...prev, provider: e.target.value }))}
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-field-label">Category</label>
                <select
                  className="form-field-select"
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="state">🏛 State (Rajasthan)</option>
                  <option value="central">🇮🇳 Central (NSP)</option>
                  <option value="private">🏢 Private</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-field-label">Status</label>
                <select
                  className="form-field-select"
                  value={form.status}
                  onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="open">✅ Open</option>
                  <option value="closed">❌ Closed</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="form-field-label">Amount</label>
                <input
                  className="form-field-input"
                  placeholder="e.g. ₹5,000/year"
                  value={form.amount}
                  onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div className="form-field">
                <label className="form-field-label">Deadline *</label>
                <input
                  type="date"
                  className="form-field-input"
                  value={form.deadline}
                  onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-field-label">Official Link</label>
              <input
                className="form-field-input"
                placeholder="https://sje.rajasthan.gov.in"
                value={form.officialLink}
                onChange={e => setForm(prev => ({ ...prev, officialLink: e.target.value }))}
              />
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="form-section">
            <h3 className="form-section-title">✅ Eligibility Criteria</h3>

            <div className="form-field">
              <label className="form-field-label">Caste Category (multiple select kar sakte ho)</label>
              <div className="form-checkboxes">
                {casteOptions.map(c => (
                  <label
                    key={c}
                    className={`checkbox-item ${form.eligibility.casteCategory.includes(c) ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.eligibility.casteCategory.includes(c)}
                      onChange={() => handleCasteChange(c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-field">
                <label className="form-field-label">Max Family Income (₹)</label>
                <input
                  type="number"
                  className="form-field-input"
                  placeholder="e.g. 250000"
                  value={form.eligibility.maxIncome}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    eligibility: { ...prev.eligibility, maxIncome: e.target.value }
                  }))}
                />
              </div>

              <div className="form-field">
                <label className="form-field-label">Min Percentage (%)</label>
                <input
                  type="number"
                  className="form-field-input"
                  placeholder="e.g. 60"
                  value={form.eligibility.minPercentage}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    eligibility: { ...prev.eligibility, minPercentage: e.target.value }
                  }))}
                />
              </div>

              <div className="form-field">
                <label className="form-field-label">Gender</label>
                <select
                  className="form-field-select"
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
          </div>

          {/* Documents Required */}
          <div className="form-section">
            <h3 className="form-section-title">📄 Documents Required</h3>

            <div className="form-field">
              <label className="form-field-label">Documents (comma se alag karo)</label>
              <textarea
                className="form-field-textarea"
                placeholder="Jan Aadhaar Card, Income Certificate, Bonafide Certificate, Fee Receipt"
                value={form.documents}
                onChange={e => setForm(prev => ({ ...prev, documents: e.target.value }))}
              />
              <p className="form-help-text">
                Example: Jan Aadhaar Card, Income Certificate, Marksheet
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="submit-btn"
            >
              {loading ? "Adding..." : "➕ Add Scholarship"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminScholarshipForm;