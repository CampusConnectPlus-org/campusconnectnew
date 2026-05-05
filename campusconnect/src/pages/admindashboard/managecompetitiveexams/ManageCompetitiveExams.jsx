import React, { useMemo, useState } from "react";
import "./ManageCompetitiveExams.css";
import {
  DEFAULT_COMPETITIVE_EXAMS,
  getCompetitiveExams,
  saveCompetitiveExams,
} from "../../competitiveexams/examsStore";

const categoryOptions = ["core", "jobs", "govt", "research"];

const createEmptyForm = () => ({
  title: "",
  tag: "",
  category: "core",
  branch: "",
  level: "",
  timing: "",
  difficulty: "Medium",
  officialSite: "",
  highlight: "",
  items: "",
  syllabus: "",
  papers: "",
  dates: "",
  roadmap: "",
});

const linesToText = (lines) => (Array.isArray(lines) ? lines.join("\n") : "");
const textToLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const examToForm = (exam) => ({
  title: exam.title || "",
  tag: exam.tag || "",
  category: exam.category || "core",
  branch: exam.branch || "",
  level: exam.level || "",
  timing: exam.timing || "",
  difficulty: exam.difficulty || "Medium",
  officialSite: exam.officialSite || "",
  highlight: exam.highlight || "",
  items: linesToText(exam.items),
  syllabus: linesToText(exam.syllabus),
  papers: exam.papers || "",
  dates: linesToText(exam.dates),
  roadmap: linesToText(exam.roadmap),
});

const buildExamPayload = (form, editingId) => ({
  id:
    editingId ||
    `${form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
  title: form.title.trim(),
  tag: form.tag.trim(),
  category: form.category,
  branch: form.branch.trim(),
  level: form.level.trim(),
  timing: form.timing.trim(),
  difficulty: form.difficulty.trim(),
  officialSite: form.officialSite.trim(),
  highlight: form.highlight.trim(),
  items: textToLines(form.items),
  syllabus: textToLines(form.syllabus),
  papers: form.papers.trim(),
  dates: textToLines(form.dates),
  roadmap: textToLines(form.roadmap),
});

const ManageCompetitiveExams = () => {
  const [exams, setExams] = useState(() => getCompetitiveExams());
  const [form, setForm] = useState(createEmptyForm());
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const stats = useMemo(() => {
    const categories = new Set(exams.map((exam) => exam.category));
    const resources = exams.reduce((count, exam) => count + (exam.officialSite ? 1 : 0), 0);
    return [
      { label: "Exam cards", value: exams.length },
      { label: "Categories", value: categories.size },
      { label: "Official links", value: resources },
      {
        label: "Syllabus blocks",
        value: exams.reduce((count, exam) => count + (Array.isArray(exam.syllabus) ? exam.syllabus.length : 0), 0),
      },
    ];
  }, [exams]);

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (exam) => {
    setEditingId(exam.id);
    setForm(examToForm(exam));
    setMessage(`Editing ${exam.title}`);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setMessage("Add a new exam card");
  };

  const handleDelete = (examId) => {
    const updated = exams.filter((exam) => exam.id !== examId);
    setExams(updated);
    saveCompetitiveExams(updated);

    if (editingId === examId) {
      setEditingId(null);
      setForm(createEmptyForm());
    }
    setMessage("Exam removed successfully.");
  };

  const handleResetDefaults = () => {
    setExams(DEFAULT_COMPETITIVE_EXAMS);
    saveCompetitiveExams(DEFAULT_COMPETITIVE_EXAMS);
    setEditingId(null);
    setForm(createEmptyForm());
    setMessage("Default exams restored.");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.tag.trim() || !form.officialSite.trim()) {
      setMessage("Title, exam subtitle, and official website are required.");
      return;
    }

    const payload = buildExamPayload(form, editingId);
    const updated = editingId
      ? exams.map((exam) => (exam.id === editingId ? payload : exam))
      : [payload, ...exams];

    setExams(updated);
    saveCompetitiveExams(updated);
    setEditingId(payload.id);
    setForm(examToForm(payload));
    setMessage(editingId ? "Exam updated successfully." : "New exam added successfully.");
  };

  return (
    <div className="manage-exams-page">
      <div className="manage-exams-hero">
        <div>
          <span className="manage-kicker">Admin Panel</span>
          <h1>Manage Competitive Exams</h1>
          <p>
            This section controls the exact exam cards shown on the student portal.
            Add a new exam or edit any existing card details from here.
          </p>
        </div>
      </div>

      <div className="manage-stats-grid">
        {stats.map((item) => (
          <div key={item.label} className="manage-stat-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="manage-message" aria-live="polite">
        {message}
      </div>

      <div className="manage-content-grid manager-layout">
        <section className="manage-section list-panel">
          <div className="panel-head">
            <h3>Published Exams</h3>
            <div className="panel-actions">
              <button type="button" className="panel-btn" onClick={handleAddNew}>Add New</button>
              <button type="button" className="panel-btn danger" onClick={handleResetDefaults}>Restore Defaults</button>
            </div>
          </div>
          <div className="exam-admin-list">
            {exams.map((exam) => (
              <article key={exam.id} className={`exam-admin-item ${editingId === exam.id ? "active" : ""}`}>
                <div>
                  <h4>{exam.title}</h4>
                  <p>{exam.tag}</p>
                  <span>{exam.category.toUpperCase()}</span>
                </div>
                <div className="exam-admin-item-actions">
                  <button type="button" onClick={() => handleEdit(exam)}>Edit</button>
                  <button type="button" className="danger" onClick={() => handleDelete(exam.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="manage-section accent form-panel">
          <h3>{editingId ? "Edit Exam Card" : "Create New Exam Card"}</h3>
          <form className="exam-admin-form" onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <label>
                Exam Name
                <input name="title" value={form.title} onChange={onFieldChange} placeholder="GATE" />
              </label>
              <label>
                Category
                <select name="category" value={form.category} onChange={onFieldChange}>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>{option.toUpperCase()}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Subtitle / Tagline
              <input name="tag" value={form.tag} onChange={onFieldChange} placeholder="Graduate Aptitude Test in Engineering" />
            </label>

            <div className="form-grid-3">
              <label>
                Branch
                <input name="branch" value={form.branch} onChange={onFieldChange} placeholder="All branches" />
              </label>
              <label>
                Level
                <input name="level" value={form.level} onChange={onFieldChange} placeholder="PSU + M.Tech" />
              </label>
              <label>
                Timing
                <input name="timing" value={form.timing} onChange={onFieldChange} placeholder="Once a year" />
              </label>
            </div>

            <div className="form-grid-2">
              <label>
                Difficulty
                <input name="difficulty" value={form.difficulty} onChange={onFieldChange} placeholder="High" />
              </label>
              <label>
                Official Website
                <input name="officialSite" value={form.officialSite} onChange={onFieldChange} placeholder="https://..." />
              </label>
            </div>

            <label>
              Highlight
              <textarea name="highlight" value={form.highlight} onChange={onFieldChange} rows={2} placeholder="One-line student-facing summary" />
            </label>

            <label>
              Key Points (one per line)
              <textarea name="items" value={form.items} onChange={onFieldChange} rows={3} placeholder="Eligibility..." />
            </label>

            <label>
              Syllabus (one per line)
              <textarea name="syllabus" value={form.syllabus} onChange={onFieldChange} rows={3} placeholder="Subject/topic list" />
            </label>

            <label>
              Previous Year Papers Guidance
              <textarea name="papers" value={form.papers} onChange={onFieldChange} rows={2} placeholder="Where/how to practice papers" />
            </label>

            <div className="form-grid-2">
              <label>
                Important Dates Timeline (one per line)
                <textarea name="dates" value={form.dates} onChange={onFieldChange} rows={3} placeholder="Notification..." />
              </label>
              <label>
                Preparation Roadmap (one per line)
                <textarea name="roadmap" value={form.roadmap} onChange={onFieldChange} rows={3} placeholder="Month-wise plan" />
              </label>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="panel-btn primary">{editingId ? "Update Exam" : "Add Exam"}</button>
              <button type="button" className="panel-btn" onClick={handleAddNew}>Clear</button>
            </div>
          </form>
          <div className="form-note">
            Any save here updates the user Competitive Exams cards data.
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManageCompetitiveExams;
