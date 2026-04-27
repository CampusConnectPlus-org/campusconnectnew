import React, { useState, useEffect } from "react";
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
  const [scholarships, setScholarships] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const casteOptions = ["General", "OBC", "SC", "ST", "EBC"];

  const fetchScholarships = async () => {
    setListLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/scholarships/all");
      const data = await res.json();
      setScholarships(Array.isArray(data) ? data : []);
    } catch {
      // silently fail — list is non-critical
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scholarship? This cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/scholarships/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      if (res.ok) {
        setScholarships(prev => prev.filter(s => s._id !== id));
        setMessage("✅ Scholarship deleted.");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const d = await res.json();
        setMessage("❌ " + (d.message || "Delete failed"));
      }
    } catch {
      setMessage("❌ Server error during delete");
    }
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setEditForm({
      title: s.title || "",
      provider: s.provider || "",
      category: s.category || "state",
      amount: s.amount || "",
      deadline: s.deadline ? s.deadline.split("T")[0] : "",
      status: s.status || "open",
      officialLink: s.officialLink || "",
      eligibility: {
        casteCategory: s.eligibility?.casteCategory || [],
        maxIncome: s.eligibility?.maxIncome || "",
        minPercentage: s.eligibility?.minPercentage || "",
        genderRequired: s.eligibility?.genderRequired || "any"
      },
      documents: (s.documents || []).join(", ")
    });
  };

  const handleEditCasteChange = (caste) => {
    const current = editForm.eligibility.casteCategory;
    const updated = current.includes(caste)
      ? current.filter(c => c !== caste)
      : [...current, caste];
    setEditForm(prev => ({ ...prev, eligibility: { ...prev.eligibility, casteCategory: updated } }));
  };

  const handleEditSave = async () => {
    try {
      const payload = {
        ...editForm,
        documents: editForm.documents.split(",").map(d => d.trim()).filter(Boolean),
        eligibility: {
          ...editForm.eligibility,
          maxIncome: Number(editForm.eligibility.maxIncome),
          minPercentage: Number(editForm.eligibility.minPercentage)
        }
      };
      const res = await fetch(`http://localhost:5000/api/scholarships/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Scholarship updated!");
        setEditingId(null);
        fetchScholarships();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ " + (data.message || "Update failed"));
      }
    } catch {
      setMessage("❌ Server error during update");
    }
  };

  // helper to compute status label for display
  const getStatusLabel = (s) => {
    const isExpired = new Date(s.deadline) < new Date();
    if (isExpired || s.status === "closed") return "closed";
    return "open";
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
      fetchScholarships();
      setTimeout(() => setMessage(""), 4000);
    } else {
      setMessage("❌ " + (data.message || "Kuch error aaya"));
    }
  };

  return (
    <div className="scholarship-wrapper">
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

      { /* ── MANAGE CURRENT SCHOLARSHIPS ─────────────────────────────────── */}
      <div className="scholarship-container" style={{ marginTop: "40px" }}>
        <div className="scholarship-header">
          <h2>📋 Manage Scholarships</h2>
          <p>Edit or delete existing scholarships</p>
        </div>

        {message && (
          <div className={`scholarship-message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        {listLoading ? (
          <p style={{ padding: "20px", color: "#6b7280" }}>Loading scholarships...</p>
        ) : scholarships.length === 0 ? (
          <p style={{ padding: "20px", color: "#6b7280" }}>No scholarships added yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {scholarships.map(s => {
              const statusLabel = getStatusLabel(s);
              const isEditing = editingId === s._id;
              return (
                <div key={s._id} className="scholarship-form-card" style={{ padding: "20px" }}>
                  {!isEditing ? (
                    /* ── VIEW MODE ── */
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                        <div>
                          <h3 style={{ margin: "0 0 4px", color: "#1e3a8a", fontSize: "16px" }}>{s.title}</h3>
                          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>by {s.provider} · {s.category}</p>
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span style={{
                            fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px",
                            background: statusLabel === "open" ? "#d1fae5" : "#fee2e2",
                            color: statusLabel === "open" ? "#065f46" : "#991b1b"
                          }}>
                            {statusLabel.toUpperCase()}
                          </span>
                          <button
                            onClick={() => startEdit(s)}
                            style={{ padding: "6px 14px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            style={{ padding: "6px 14px", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div style={{ marginTop: "10px", display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "#374151" }}>
                        <span>💰 {s.amount}</span>
                        <span>📅 Deadline: {new Date(s.deadline).toLocaleDateString("en-IN")}</span>
                        <span>📄 {(s.documents || []).length} document(s) required</span>
                      </div>
                    </div>
                  ) : (
                    /* ── EDIT MODE ── */
                    <div>
                      <h3 style={{ marginBottom: "16px", color: "#1e3a8a" }}>Editing: {s.title}</h3>

                      <div className="form-section">
                        <div className="form-field">
                          <label className="form-field-label">Title</label>
                          <input className="form-field-input" value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} />
                        </div>
                        <div className="form-field">
                          <label className="form-field-label">Provider</label>
                          <input className="form-field-input" value={editForm.provider} onChange={e => setEditForm(p => ({ ...p, provider: e.target.value }))} />
                        </div>
                        <div className="form-row">
                          <div className="form-field">
                            <label className="form-field-label">Category</label>
                            <select className="form-field-select" value={editForm.category} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}>
                              <option value="state">🏛 State</option>
                              <option value="central">🇮🇳 Central</option>
                              <option value="private">🏢 Private</option>
                            </select>
                          </div>
                          <div className="form-field">
                            <label className="form-field-label">Status</label>
                            <select className="form-field-select" value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}>
                              <option value="open">✅ Open</option>
                              <option value="closed">❌ Closed</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-field">
                            <label className="form-field-label">Amount</label>
                            <input className="form-field-input" value={editForm.amount} onChange={e => setEditForm(p => ({ ...p, amount: e.target.value }))} />
                          </div>
                          <div className="form-field">
                            <label className="form-field-label">Deadline</label>
                            <input type="date" className="form-field-input" value={editForm.deadline} onChange={e => setEditForm(p => ({ ...p, deadline: e.target.value }))} />
                          </div>
                        </div>
                        <div className="form-field">
                          <label className="form-field-label">Official Link</label>
                          <input className="form-field-input" value={editForm.officialLink} onChange={e => setEditForm(p => ({ ...p, officialLink: e.target.value }))} />
                        </div>
                      </div>

                      <div className="form-section">
                        <h3 className="form-section-title">✅ Eligibility</h3>
                        <div className="form-field">
                          <label className="form-field-label">Caste Category</label>
                          <div className="form-checkboxes">
                            {casteOptions.map(c => (
                              <label key={c} className={`checkbox-item ${editForm.eligibility.casteCategory.includes(c) ? "checked" : ""}`}>
                                <input type="checkbox" checked={editForm.eligibility.casteCategory.includes(c)} onChange={() => handleEditCasteChange(c)} />
                                {c}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="form-row-3">
                          <div className="form-field">
                            <label className="form-field-label">Max Income (₹)</label>
                            <input type="number" className="form-field-input" value={editForm.eligibility.maxIncome} onChange={e => setEditForm(p => ({ ...p, eligibility: { ...p.eligibility, maxIncome: e.target.value } }))} />
                          </div>
                          <div className="form-field">
                            <label className="form-field-label">Min Percentage (%)</label>
                            <input type="number" className="form-field-input" value={editForm.eligibility.minPercentage} onChange={e => setEditForm(p => ({ ...p, eligibility: { ...p.eligibility, minPercentage: e.target.value } }))} />
                          </div>
                          <div className="form-field">
                            <label className="form-field-label">Gender</label>
                            <select className="form-field-select" value={editForm.eligibility.genderRequired} onChange={e => setEditForm(p => ({ ...p, eligibility: { ...p.eligibility, genderRequired: e.target.value } }))}>
                              <option value="any">Any</option>
                              <option value="female">Female Only</option>
                              <option value="male">Male Only</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-section">
                        <h3 className="form-section-title">📄 Documents (comma-separated)</h3>
                        <div className="form-field">
                          <textarea className="form-field-textarea" value={editForm.documents} onChange={e => setEditForm(p => ({ ...p, documents: e.target.value }))} />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button onClick={handleEditSave} style={{ padding: "10px 22px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}>
                          Save Changes
                        </button>
                        <button onClick={() => setEditingId(null)} style={{ padding: "10px 22px", background: "#6b7280", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScholarshipForm;