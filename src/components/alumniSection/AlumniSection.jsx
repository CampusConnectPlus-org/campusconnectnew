
import React from "react";
import "./AlumniSection.css";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const alumniData = [
  {
    id: 1,
    name: "Ashish Sharma",
    role: "Software Engineer at Infosys",
    year: "Class of 2015",
    desc: "Ashish is working in web development and cloud technologies.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Priya Malhotra",
    role: "Marketing Manager at Deloitte",
    year: "Class of 2013",
    desc: "Priya is expert in digital marketing and brand strategy.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Rajesh Verma",
    role: "Entrepreneur",
    year: "Class of 2010",
    desc: "Rajesh is founder of a successful tech startup.",
    image: "https://randomuser.me/api/portraits/men/65.jpg"
  }
];

const Alumni = () => {
  // const navigate = useNavigate();
  return (
    <div className="alumni-container"  id="alumni">
      <h2 className="title">Meet Our Alumni</h2>

      {alumniData.map((alumni, index) => (
        <div
          key={alumni.id}
          className={`alumni-card ${index % 2 !== 0 ? "reverse" : ""}`}
        >
          <div className="alumni-image">
            <img src={alumni.image} alt={alumni.name} />
          </div>

          <div className="alumni-content">
            <h3>{alumni.name}</h3>
            <h4>{alumni.role}</h4>
            <p className="year">{alumni.year}</p>
            <p>{alumni.desc}</p>
            <button className="more-btn">View Profile</button>
            <button className="more-btn" id="linkedin">LinkedIn</button>
          </div>
        </div>
      ))}

      <div className="btn-container">
      
        <Link to="/alumni">
           <button className="more-btn">
          View More Alumni
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Alumni;