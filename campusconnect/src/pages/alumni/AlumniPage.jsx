// import React from 'react'
import React, { useEffect, useState } from "react";
import Footer from '../../components/footer/Footer'
import { Link } from "react-router-dom";

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  console.log(alumni)

    useEffect(() => {
    fetch("http://localhost:5000/alumni")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setAlumni(data);
      });
  }, []);
//   const users = [
//   {
//     id: 1,
//     name: "Ashish Sharma",
//     role: "Software Engineer at Infosys",
//     year: "Class of 2015",
//     desc: "Ashish is working in web development and cloud technologies.",
//     image: "https://randomuser.me/api/portraits/men/32.jpg"
//   },
//   {
//     id: 2,
//     name: "Priya Malhotra",
//     role: "Marketing Manager at Deloitte",
//     year: "Class of 2013",
//     desc: "Priya is expert in digital marketing and brand strategy.",
//     image: "https://randomuser.me/api/portraits/women/44.jpg"
//   },
//   {
//     id: 3,
//     name: "Rajesh Verma",
//     role: "Entrepreneur",
//     year: "Class of 2010",
//     desc: "Rajesh is founder of a successful tech startup.",
//     image: "https://randomuser.me/api/portraits/men/65.jpg"
//   },
//     {
//     id: 4,
//     name: "Ashish Sharma",
//     role: "Software Engineer at Infosys",
//     year: "Class of 2015",
//     desc: "Ashish is working in web development and cloud technologies.",
//     image: "https://randomuser.me/api/portraits/men/32.jpg"
//   },
//   {
//     id: 5,
//     name: "Priya Malhotra",
//     role: "Marketing Manager at Deloitte",
//     year: "Class of 2013",
//     desc: "Priya is expert in digital marketing and brand strategy.",
//     image: "https://randomuser.me/api/portraits/women/44.jpg"
//   },
//   {
//     id: 6,
//     name: "Rajesh Verma",
//     role: "Entrepreneur",
//     year: "Class of 2010",
//     desc: "Rajesh is founder of a successful tech startup.",
//     image: "https://randomuser.me/api/portraits/men/65.jpg"
//   },
//     {
//     id: 7,
//     name: "Ashish Sharma",
//     role: "Software Engineer at Infosys",
//     year: "Class of 2015",
//     desc: "Ashish is working in web development and cloud technologies.",
//     image: "https://randomuser.me/api/portraits/men/32.jpg"
//   },
//   {
//     id: 8,
//     name: "Priya Malhotra",
//     role: "Marketing Manager at Deloitte",
//     year: "Class of 2013",
//     desc: "Priya is expert in digital marketing and brand strategy.",
//     image: "https://randomuser.me/api/portraits/women/44.jpg"
//   },
//   {
//     id: 9,
//     name: "Rajesh Verma",
//     role: "Entrepreneur",
//     year: "Class of 2010",
//     desc: "Rajesh is founder of a successful tech startup.",
//     image: "https://randomuser.me/api/portraits/men/65.jpg"
//   }
// ];

  return (
  <>
    <div className="alumnis-data">
        <div className="alumni-container"  id="alumni">
      <h2 className="title">Meet Our Alumni</h2>

      {alumni.map((item, index) => (
        <div
          key={item.id}
          className={`alumni-card ${index % 2 !== 0 ? "reverse" : ""}`}
        >
          <div className="alumni-image">
            <img src={`http://localhost:5000/alumniimage/${item.image}`} alt={item.name} />
          </div>

          <div className="alumni-content">
            <h3>{item.name}</h3>
            <h4>{item.role}</h4>
            <p className="year">{item.batch}</p>
            <p>{item.desc}</p>
            <button className="more-btn">View Profile</button>
         <span>  <a href={item.linkedin} >  <button className="more-btn" id="linkedin">LinkedIn</button></a></span>
            
          </div>
        </div>
      ))}
    </div>
  

      
    </div>
      <Footer  />
  </>
  )
}

export default AlumniPage
