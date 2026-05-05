import React, { useEffect, useMemo, useState } from "react";
import "./CompetitiveExams.css";
import { getCompetitiveExams } from "./examsStore";

const quickTracks = ["All", "core", "jobs", "govt", "research"];

const CompetitiveExams = () => {
  const [exams, setExams] = useState(() => getCompetitiveExams());
  const [activeTrack, setActiveTrack] = useState("All");
  const [search, setSearch] = useState("");
  const [activeDetail, setActiveDetail] = useState(() => {
    const initial = getCompetitiveExams()[0];
    return initial ? `${initial.title}-syllabus` : "";
  });

  useEffect(() => {
    const syncExams = () => setExams(getCompetitiveExams());
    window.addEventListener("competitive-exams-updated", syncExams);
    return () => window.removeEventListener("competitive-exams-updated", syncExams);
  }, []);

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();
    return exams.filter((exam) => {
      const matchesTrack = activeTrack === "All" || exam.category === activeTrack;
      const matchesSearch =
        !query ||
        exam.title.toLowerCase().includes(query) ||
        exam.tag.toLowerCase().includes(query) ||
        exam.branch.toLowerCase().includes(query);
      return matchesTrack && matchesSearch;
    });
  }, [activeTrack, search, exams]);

  useEffect(() => {
    if (filteredExams.length === 0) {
      setActiveDetail("");
      return;
    }

    const hasSelected = filteredExams.some((exam) => activeDetail.startsWith(`${exam.title}-`));
    if (!hasSelected) {
      setActiveDetail(`${filteredExams[0].title}-syllabus`);
    }
  }, [filteredExams, activeDetail]);

  return (
    <div className="exam-page">
      <div className="exam-hero">
        <div>
          <span className="exam-kicker">Engineering Competitive Exams</span>
          <h1>Competitive exam info for engineering students in one clean place.</h1>
          <p>
            Browse major engineering exams, open official portals, compare career paths, and
            use the filters to focus on the right track fast.
          </p>
        </div>
        <div className="exam-hero-card">
          <div className="hero-badge">Quick features</div>
          <h3>Built for students</h3>
          <ul>
            <li>Search by exam name or branch</li>
            <li>Open official websites directly</li>
            <li>Filter by core, govt, jobs, and research</li>
            <li>See key eligibility and preparation points</li>
          </ul>
        </div>
      </div>

      <div className="exam-toolbar">
        <div className="exam-search-wrap">
          <span>Search</span>
          <input
            type="text"
            placeholder="Search GATE, PSU, SSC JE, ISRO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="exam-pills">
          {quickTracks.map((track) => (
            <button
              key={track}
              className={`exam-pill ${activeTrack === track ? "active" : ""}`}
              onClick={() => setActiveTrack(track)}
            >
              {track === "All" ? "All Tracks" : track.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="exam-grid">
        {filteredExams.map((exam) => (
          <article key={exam.id || exam.title} className="exam-card">
            <div className="exam-card-top">
              <div>
                <span className="exam-tag">{exam.tag}</span>
                <h2>{exam.title}</h2>
              </div>
              <span className="exam-difficulty">{exam.difficulty}</span>
            </div>
            <p className="exam-highlight">{exam.highlight}</p>
            <div className="exam-meta">
              <span>{exam.branch}</span>
              <span>{exam.level}</span>
              <span>{exam.timing}</span>
            </div>
            <ul className="exam-list">
              {exam.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="exam-detail-box">
              {activeDetail === `${exam.title}-syllabus` && (
                <ul className="exam-detail-list">
                  {exam.syllabus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {activeDetail === `${exam.title}-papers` && <p>{exam.papers}</p>}
              {activeDetail === `${exam.title}-dates` && (
                <ul className="exam-timeline">
                  {exam.dates.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {activeDetail === `${exam.title}-roadmap` && (
                <ul className="exam-detail-list">
                  {exam.roadmap.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="exam-actions">
              <button
                type="button"
                className={`exam-link-btn secondary ${activeDetail === `${exam.title}-syllabus` ? "active" : ""}`}
                onClick={() => setActiveDetail(`${exam.title}-syllabus`)}
              >
                Syllabus
              </button>
              <button
                type="button"
                className={`exam-link-btn secondary ${activeDetail === `${exam.title}-papers` ? "active" : ""}`}
                onClick={() => setActiveDetail(`${exam.title}-papers`)}
              >
                Previous Year Papers
              </button>
              <button
                type="button"
                className={`exam-link-btn secondary ${activeDetail === `${exam.title}-dates` ? "active" : ""}`}
                onClick={() => setActiveDetail(`${exam.title}-dates`)}
              >
                Important Dates
              </button>
              <button
                type="button"
                className={`exam-link-btn secondary ${activeDetail === `${exam.title}-roadmap` ? "active" : ""}`}
                onClick={() => setActiveDetail(`${exam.title}-roadmap`)}
              >
                Preparation Roadmap
              </button>
              <a href={exam.officialSite} target="_blank" rel="noreferrer" className="exam-link-btn">
                Official Website
              </a>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};

export default CompetitiveExams;
