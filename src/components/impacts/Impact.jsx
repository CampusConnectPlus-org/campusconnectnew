import React from "react";
import "./Impact.css";

const Impact = () => {
  return (
    <section className="impact-section">
      <h2 className="impact-heading">Our Impact</h2>

      <div className="impact-container">
        <div className="impact-box">
          <h1>2500+</h1>
          <p>Students</p>
        </div>

        <div className="impact-box">
          <h1>150+</h1>
          <p>Faculty Members</p>
        </div>

        <div className="impact-box">
          <h1>5000+</h1>
          <p>Alumni</p>
        </div>
      </div>
    </section>
  );
};

export default Impact;