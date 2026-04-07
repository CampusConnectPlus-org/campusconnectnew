
import React from "react";
import { useNavigate } from "react-router";
import "./AlumniSection.css";
import { Link } from "react-router";
const users = [
  {
    id: 1,
    name: "Sourabh Purbia",
    role: "Founder & CEO, Creative Upaay",
    batch: "CSE(2019)",
    desc: "Sourabh Purbia, Founder of Creative Upaay.",
    image: "alumnisimage/sourabh.jpeg",
    linkedin:"https://www.linkedin.com/in/sourabhpurbia/"
  },
  {
    id: 2,
    name: "Harsh Chandravanshi",
    role: " Software Developer at Fam",
    batch: "CSE(2019)",
    desc: "I sit at the intersection of clean architecture and intuitive design. I don't just write code; I build products that people actually enjoy using.Currently, I’m a Software Developer at Fam, where I’m focused on developing full-stack applications that solve real user problems. I specialize in the JavaScript stack because it allows me to move quickly between web (React/Next.js) and mobile (React Native) without sacrificing performance or scalability..",
    image: "alumnisimage/harshchandravanshi.png",
    linkedin:"https://www.linkedin.com/in/harshchandravanshi1/"
  },
  {
    id: 3,
    name: "Chelsi Narwaria",
    role: "Assistant Manager at Hindustan Zinc",
    batch: "ECE(2019)",
    desc: "As an Assistant Manager at Hindustan Zinc, I have been deeply involved in leveraging advanced technologies to enhance operational efficiency and drive innovation. Successfully commissioned 8.5MW Steam Turbine Generator A significant aspect of my role has been mastering the SAP system, which has enabled me to streamline business processes, manage data integration, and support decision-making through comprehensive analytics..",
    image: "alumnisimage/chelsinarwaria.png",
    linkedin: "https://www.linkedin.com/in/chelsi-narwaria/"
  }
];



const AlumniSection = () => {
  const navigate = useNavigate();
  
  const handleClick = () =>{
    navigate("/alumni")
  }
  return (
    <div className="alumni-container"  id="alumni">
      <h2 className="title">Meet Our Alumni</h2>

      {users.map((alumni, index) => (
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
            <p className="year">{alumni.batch}</p>
            <p>{alumni.desc}</p>
            <button  className="more-btn">View Profile</button>
         <span><Link to={alumni.linkedin} ><button className="more-btn" id="linkedin" >LinkedIn</button></Link></span>
          </div>
        </div>
      ))}

      <div className="btn-container">
        <Link to="/alumni">
           <button  className="more-btn">
          View More Alumni
        </button>
        </Link>
      </div>
    </div>
  );
};

export default AlumniSection;