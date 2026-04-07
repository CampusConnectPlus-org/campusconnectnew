import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";



const Navbar = ({ user, setUser}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  //  const [student, setStudent] = useState(null);
  //  const [openClubs, setOpenClubs] = useState(false);
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  


  //    const handleLogout = () => {
  //     navigate("/login");
  // };

  const  handleLogout = ()=>{

localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login");

setUser(null);

};

  const scrollToAlumni = () => {
    const section = document.getElementById("alumni");
    section?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <nav className="navbar">
      {/* Left Logo */}
      <div className="left-section">
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
        <div className="logo">CampusConnect+</div>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/">CTAE Club</Link>
        <Link to="/event">Event</Link>
        <Link to="/placement">Placement</Link>
        <Link to="/" onClick={scrollToAlumni}>Alumni</Link>
        
      </div>


      {/* Right Profile */}
      <div
        className="profile-wrapper"
      
        // onClick={() => setShowProfile(true)}
          onMouseEnter={() => setShowProfile(true)}
        onMouseLeave={() => setShowProfile(false)}
      >
          
        {user ? (
          <>
            <img
              src={`http://localhost:5000/uploads/${user.profileImage}`} 
              alt="profile"
              className="profile-img"
            />

            {showProfile && (
              <div className="profile-dropdown">
                <img src={`http://localhost:5000/uploads/${user.profileImage}`} alt="" />
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                {/* <p className="role">{user.role}</p> */}

                <button>View Profile</button>
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        ) : (
         <div className="buttons">
           <Link to="/adminlogin">
            <button onClick={() =>{navigate('./adminlogin')}} className="login-btn">Admin Login</button>
          </Link>
           <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
         </div>
          
        )}
        
      
      </div>
      
    </nav>
  );
};

export default Navbar;