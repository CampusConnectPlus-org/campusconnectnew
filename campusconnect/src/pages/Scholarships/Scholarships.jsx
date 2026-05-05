import React, { useEffect, useState } from "react";

const categoryConfig = {
  state: { label: "State (Rajasthan)", color: "#2563eb", bg: "#dbeafe", icon: "🏛" },
  central: { label: "Central (NSP)", color: "#1d4ed8", bg: "#eff6ff", icon: "🇮🇳" },
  private: { label: "Private", color: "#0369a1", bg: "#e0f2fe", icon: "🏢" }
};

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDocs, setExpandedDocs] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    caste: "", income: "", percentage: "", gender: "", category: ""
  });

  const fetchScholarships = async (f = filters) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (f.caste) params.append("caste", f.caste);
    if (f.income) params.append("income", f.income);
    if (f.percentage) params.append("percentage", f.percentage);
    if (f.gender) params.append("gender", f.gender);
    if (f.category) params.append("category", f.category);
    const res = await fetch(`http://localhost:5000/api/scholarships/all?${params}`);
    const data = await res.json();
    setScholarships(data);
    setLoading(false);
  };

  useEffect(() => { fetchScholarships(); }, []);

  const getDaysLeft = (deadline) =>
    Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const newFilters = { ...filters, category: tab === "all" ? "" : tab };
    setFilters(newFilters);
    fetchScholarships(newFilters);
  };

  const clearFilters = () => {
    const reset = { caste: "", income: "", percentage: "", gender: "", category: activeTab === "all" ? "" : activeTab };
    setFilters(reset);
    fetchScholarships(reset);
  };

  const openCount = scholarships.filter(s => getDaysLeft(s.deadline) > 0).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f6ff", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #3b82f6 100%)",
        padding: "52px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background dots */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.08,
          backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)",
          backgroundSize: "40px 40px"
        }} />

        <p style={{ color: "#bfdbfe", fontSize: 12, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 10px", fontWeight: 700 }}>
          Campus Connect+
        </p>
        <h1 style={{ color: "#ffffff", fontSize: 38, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.2 }}>
          🎓 Scholarship Directory
        </h1>
        <p style={{ color: "#bfdbfe", fontSize: 15, margin: "0 0 32px" }}>
          Rajasthan & Central Government + Private Scholarships
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total Scholarships", value: scholarships.length },
            { label: "Currently Open", value: openCount },
            { label: "Coverage", value: "RJ + Central" }
          ].map((stat, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 14,
              padding: "16px 28px",
              minWidth: 130
            }}>
              <div style={{ color: "#fff", fontSize: 24, fontWeight: 900 }}>{stat.value}</div>
              <div style={{ color: "#bfdbfe", fontSize: 12, marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "-44px auto 0", padding: "0 16px 48px", position: "relative" }}>

        {/* ELIGIBILITY CHECKER */}
        <div style={{
          background: "#ffffff",
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 8px 32px rgba(37,99,235,0.12)",
          marginBottom: 24,
          border: "1.5px solid #bfdbfe"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "#dbeafe", borderRadius: 10, padding: "10px 12px", fontSize: 20 }}>🔍</div>
            <div>
              <h3 style={{ margin: 0, color: "#1e3a8a", fontSize: 16, fontWeight: 700 }}>Eligibility Checker</h3>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Fill in your details to find scholarships you qualify for</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
            {[
              {
                label: "Caste Category", key: "caste", type: "select",
                options: [["", "All Categories"], ["General", "General"], ["OBC", "OBC"], ["SC", "SC"], ["ST", "ST"], ["EBC", "EBC"]]
              },
              {
                label: "Gender", key: "gender", type: "select",
                options: [["", "Any Gender"], ["female", "Female"], ["male", "Male"]]
              },
              { label: "Family Income (₹)", key: "income", type: "number", placeholder: "e.g. 250000" },
              { label: "Your Percentage (%)", key: "percentage", type: "number", placeholder: "e.g. 75" }
            ].map(field => (
              <div key={field.key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    value={filters[field.key]}
                    onChange={e => setFilters(p => ({ ...p, [field.key]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1.5px solid #bfdbfe", fontSize: 13, background: "#f0f6ff", outline: "none", color: "#1e3a8a" }}
                  >
                    {field.options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={filters[field.key]}
                    onChange={e => setFilters(p => ({ ...p, [field.key]: e.target.value }))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1.5px solid #bfdbfe", fontSize: 13, background: "#f0f6ff", outline: "none", color: "#1e3a8a", boxSizing: "border-box" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button
              onClick={() => fetchScholarships(filters)}
              style={{ flex: 1, padding: "13px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", letterSpacing: 0.3 }}
            >
              🔍 Find My Scholarships
            </button>
            <button
              onClick={clearFilters}
              style={{ padding: "13px 22px", background: "#eff6ff", color: "#2563eb", border: "1.5px solid #bfdbfe", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "#fff", padding: 6, borderRadius: 14, boxShadow: "0 2px 12px rgba(37,99,235,0.08)", border: "1px solid #dbeafe" }}>
          {[["all", "All Scholarships", "✨"], ["state", "State (RJ)", "🏛"], ["central", "Central", "🇮🇳"], ["private", "Private", "🏢"]].map(([tab, label, icon]) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                flex: 1, padding: "10px 6px", border: "none", borderRadius: 9, cursor: "pointer",
                fontSize: 12, fontWeight: 700, transition: "all 0.2s",
                background: activeTab === tab ? "#2563eb" : "transparent",
                color: activeTab === tab ? "#fff" : "#6b7280"
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* COUNT */}
        {!loading && (
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
            <strong style={{ color: "#1e3a8a" }}>{scholarships.length}</strong> scholarships found
            {openCount > 0 && <span style={{ color: "#2563eb", marginLeft: 10, fontWeight: 600 }}>● {openCount} open now</span>}
          </p>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16 }}>
            <div style={{ fontSize: 36 }}>⏳</div>
            <p style={{ color: "#6b7280", marginTop: 12 }}>Loading scholarships...</p>
          </div>
        )}

        {!loading && scholarships.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, border: "1px solid #dbeafe" }}>
            <div style={{ fontSize: 48 }}>🔎</div>
            <h3 style={{ color: "#1e3a8a", marginTop: 12 }}>No scholarships found</h3>
            <p style={{ color: "#6b7280" }}>Try adjusting your filters above</p>
            <button onClick={clearFilters} style={{ padding: "10px 28px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 9, cursor: "pointer", fontWeight: 700 }}>
              Reset Filters
            </button>
          </div>
        )}

        {/* CARDS */}
        {scholarships.map(s => {
          const daysLeft = getDaysLeft(s.deadline);
          const isExpired = daysLeft <= 0;
          const isUrgent = daysLeft <= 7 && !isExpired;
          const cfg = categoryConfig[s.category] || categoryConfig.state;
          const docsOpen = expandedDocs === s._id;

          return (
            <div key={s._id} style={{
              background: "#ffffff",
              borderRadius: 16,
              marginBottom: 18,
              boxShadow: "0 4px 16px rgba(37,99,235,0.08)",
              border: `1.5px solid ${isExpired ? "#fecaca" : isUrgent ? "#fde68a" : "#dbeafe"}`,
              overflow: "hidden",
              opacity: isExpired ? 0.65 : 1,
              transition: "box-shadow 0.2s"
            }}>
              {/* Top accent */}
              <div style={{ height: 5, background: isExpired ? "#ef4444" : isUrgent ? "#f59e0b" : cfg.color }} />

              <div style={{ padding: "22px 26px" }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20, letterSpacing: 0.5, border: `1px solid ${cfg.color}33` }}>
                        {cfg.icon} {cfg.label}
                      </span>
                      {isExpired && (
                        <span style={{ background: "#fee2e2", color: "#dc2626", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20 }}>
                          CLOSED
                        </span>
                      )}
                      {isUrgent && (
                        <span style={{ background: "#fef3c7", color: "#b45309", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20 }}>
                          ⚡ URGENT — {daysLeft} days left
                        </span>
                      )}
                    </div>
                    <h3 style={{ margin: "0 0 4px", color: "#1e3a8a", fontSize: 18, fontWeight: 800, lineHeight: 1.3 }}>{s.title}</h3>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>by {s.provider}</p>
                  </div>

                  <div style={{ textAlign: "right", background: "#f0f6ff", borderRadius: 12, padding: "12px 18px", border: "1px solid #bfdbfe" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#1d4ed8" }}>{s.amount}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2, fontWeight: 600 }}>SCHOLARSHIP AMOUNT</div>
                  </div>
                </div>

                {/* Deadline Bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                      Deadline: <strong style={{ color: "#1e3a8a" }}>{new Date(s.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: isExpired ? "#dc2626" : isUrgent ? "#d97706" : "#2563eb" }}>
                      {isExpired ? "Deadline Passed" : `${daysLeft} days remaining`}
                    </span>
                  </div>
                  <div style={{ background: "#dbeafe", borderRadius: 6, height: 7, overflow: "hidden" }}>
                    <div style={{
                      width: `${isExpired ? 100 : Math.min(100, Math.max(5, (1 - daysLeft / 365) * 100))}%`,
                      background: isExpired ? "#ef4444" : isUrgent ? "#f59e0b" : "#2563eb",
                      height: "100%", borderRadius: 6, transition: "width 0.5s"
                    }} />
                  </div>
                </div>

                {/* Eligibility Tags */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {s.eligibility?.casteCategory?.map((c, i) => (
                    <span key={i} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontSize: 11, padding: "4px 10px", borderRadius: 12, fontWeight: 600 }}>
                      {c}
                    </span>
                  ))}
                  {s.eligibility?.genderRequired === "female" && (
                    <span style={{ background: "#fdf2f8", border: "1px solid #f9a8d4", color: "#9d174d", fontSize: 11, padding: "4px 10px", borderRadius: 12, fontWeight: 700 }}>
                      👩 Girls Only
                    </span>
                  )}
                  {s.eligibility?.minPercentage > 0 && (
                    <span style={{ background: "#eff6ff", border: "1px solid #93c5fd", color: "#1e40af", fontSize: 11, padding: "4px 10px", borderRadius: 12, fontWeight: 600 }}>
                      Min {s.eligibility.minPercentage}% marks
                    </span>
                  )}
                  {s.eligibility?.maxIncome > 0 && (
                    <span style={{ background: "#eff6ff", border: "1px solid #93c5fd", color: "#1e40af", fontSize: 11, padding: "4px 10px", borderRadius: 12, fontWeight: 600 }}>
                      Max Income: ₹{(s.eligibility.maxIncome / 100000).toFixed(1)}L
                    </span>
                  )}
                </div>

                {/* Documents */}
                <div style={{ borderTop: "1.5px solid #dbeafe", paddingTop: 14, marginBottom: 14 }}>
                  <button
                    onClick={() => setExpandedDocs(docsOpen ? null : s._id)}
                    style={{
                      background: docsOpen ? "#dbeafe" : "none",
                      border: "1.5px solid #bfdbfe", borderRadius: 9, padding: "8px 16px",
                      cursor: "pointer", fontSize: 12, color: "#2563eb", fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
                    }}
                  >
                    📄 Documents Required
                    <span style={{ fontSize: 10 }}>{docsOpen ? "▲" : "▼"}</span>
                  </button>

                  {docsOpen && (
                    <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8 }}>
                      {s.documents?.map((doc, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          background: "#f0f6ff", border: "1px solid #bfdbfe",
                          padding: "9px 14px", borderRadius: 9, fontSize: 13, color: "#1e3a8a", fontWeight: 500
                        }}>
                          <span style={{ color: "#2563eb", fontWeight: 900, fontSize: 15 }}>✓</span> {doc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                {!isExpired && s.officialLink && (
                  <a href={s.officialLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <button style={{
                      width: "100%", padding: "14px",
                      background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                      color: "#fff", border: "none", borderRadius: 10,
                      fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: 0.5,
                      boxShadow: "0 4px 14px rgba(37,99,235,0.3)"
                    }}>
                      Apply Now →&nbsp;
                      {s.officialLink.includes("sje") ? "SSO Rajasthan Portal" :
                        s.officialLink.includes("scholarships.gov") ? "NSP Portal" :
                          s.officialLink.includes("aicte") ? "AICTE Portal" : "Official Portal"}
                    </button>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scholarships;