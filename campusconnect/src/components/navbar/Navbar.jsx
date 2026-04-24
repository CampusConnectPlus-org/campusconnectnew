import React, { useRef, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";



const Navbar = ({ user, setUser, admin, setAdmin }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hideTimeoutRef = useRef(null);
  //  const [student, setStudent] = useState(null);
  //  const [openClubs, setOpenClubs] = useState(false);
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");



  //    const handleLogout = () => {
  //     navigate("/login");
  // };

  const handleLogout = () => {
    clearTimeout(hideTimeoutRef.current);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    navigate("/");

    setUser(null);
    setAdmin(null);
  };

  const handleProfileEnter = () => {
    clearTimeout(hideTimeoutRef.current);
    setShowProfile(true);
  };

  const handleProfileLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowProfile(false);
    }, 200);
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
         <Link to="/feed">Feed</Link>
        <Link to="/clubs">CTAE Club</Link>
        <Link to="/event">Event</Link>
        <Link to="/placement">Placement</Link>
        <Link to="/" onClick={scrollToAlumni}>Alumni</Link>

      </div>


      {/* Right Profile */}
      <div
        className="profile-wrapper"
        onMouseEnter={handleProfileEnter}
        onMouseLeave={handleProfileLeave}
      >

        {user || admin ? (
          <>
            <img
              src={`http://localhost:5000/uploads/${user ? user.profileImage : admin.profileImage}`}
              alt="profile"
              className="profile-img"
            />

            {showProfile && (
              <div className="profile-dropdown" onMouseEnter={handleProfileEnter} onMouseLeave={handleProfileLeave}>
                <img src={`http://localhost:5000/uploads/${user ? user.profileImage : admin.profileImage}`} alt="" />
                <h4>{user ? user.name : admin.name}</h4>
                <p>{user ? user.email : admin.email}</p>
                {/* <p className="role">{user ? user.role : 'Admin'}</p> */}

                {/* <button>View Profile</button> */}
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        ) : (
          <div className="buttons">
            <Link to="/adminlogin">
              <button onClick={() => { navigate('./adminlogin') }} className="login-btn">Admin Login</button>
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