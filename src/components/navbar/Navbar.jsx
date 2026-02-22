import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
   const [student, setStudent] = useState(null);
   const [openClubs, setOpenClubs] = useState(false);

     const navigate = useNavigate();
  // const handleLogin = () => {
  //   setUser({
  //     name: "Rajendra Kumar",
  //      email: "rajendra@email.com",
  //      img: "https://randomuser.me/api/portraits/men/75.jpg",
  //    });
  //  };

     const handleLogout = () => {
    setUser(null);
      navigate("/login");
    

  };

     const scrollToAlumni = () => {
      const section = document.getElementById("alumni");
      section?.scrollIntoView({ behavior: "smooth" });
    };
  

  // Fetch logged-in user profile
//   useEffect(() => {
//     fetch("http://localhost:5000/api/user/profile", {
//       method: "GET",
//       credentials: "include", // important for login session / token
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setUser(data);
//       })
//       .catch((err) => console.log(err));
//   }, []);

  return (
    <nav className="navbar">
      {/* Left Logo */}
      <div className="left-section">
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
      <div className="logo">CampusConnect+</div>
      </div>

<div className={`nav-links ${menuOpen ? "active" : ""}`}>
               <Link to="/">Home</Link>
               {/* <Link to="/" onClick={() => setOpenClubs(!openClubs)}>CTAE Clubs {openClubs && (<ul className="dropdown-menu"> 
                <li>tech club</li>
                <li>cultural club</li>
                <li>sports club</li>
               </ul>)}
               </Link> */}
                   <Link to="/">CTAE Club</Link>
               <Link to="/event">Event</Link>
               <Link to="/placement">Placement</Link>
               <Link to="/" onClick={scrollToAlumni}>Alumni</Link>

     </div>




      {/* Right Profile */}
      <div
        className="profile-wrapper"
        onMouseEnter={() => setShowProfile(true)}
        onMouseLeave={() => setShowProfile(false)}
      >
        {user ? (
          <>
            <img
              src={user.img}
              alt="profile"
              className="profile-img"
            />

            {showProfile && (
              <div className="profile-dropdown">
                <img src={user.img} alt="" />
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                {/* <p className="role">{user.role}</p> */}

                <button>View Profile</button>
                <button className="logout" onClick={handleLogin}>Logout</button>
              </div>
            )}
          </>
        ) : (
           <Link to="/login">
                     <button className="login-btn">Login</button>
                   </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;