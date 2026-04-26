import React from "react";
import "./HomeEnhancements.css";

const stats = [
  { value: "10k+", label: "Students Connected" },
  { value: "120+", label: "Campus Events" },
  { value: "85+", label: "Active Recruiters" },
  { value: "2k+", label: "Alumni Network" }
];

const features = [
  {
    title: "Placements",
    description: "Track drives, explore opportunities, and prepare with structured resources."
  },
  {
    title: "Clubs and Events",
    description: "Join communities, discover workshops, and stay updated with campus events."
  },
  {
    title: "Alumni and Scholarships",
    description: "Learn from alumni journeys and find scholarship opportunities in one place."
  }
];

const HomeEnhancements = () => {
  return (
    <>
      <section className="home-stats-strip" aria-label="Campus highlights">
        {stats.map((item) => (
          <article key={item.label} className="home-stat-card">
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className="why-campusconnect" aria-label="Why CampusConnect">
        <header className="why-header">
          <span>Why CampusConnect</span>
          <h2>Your complete campus platform</h2>
        </header>

        <div className="why-grid">
          {features.map((feature) => (
            <article key={feature.title} className="why-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomeEnhancements;
