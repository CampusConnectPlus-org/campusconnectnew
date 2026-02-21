  // import React, { useState } from "react";
// import "./Navbar.css";

// function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [student, setStudent] = useState(null);

//   const handleLogin = () => {
//     setStudent({
//       name: "Rajendra Kumar",
//       email: "rajendra@email.com",
//       img: "https://randomuser.me/api/portraits/men/75.jpg",
//     });
//   };

//   const handleLogout = () => {
//     setStudent(null);
//   };

//   return (
//     <nav className="navbar">
//       <div className="left-section">
//             <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
//           ☰
//         </div>
//       <div className="logo">CampusConnect</div>
//       </div>

//       <div className={`nav-links ${menuOpen ? "active" : ""}`}>
//         <a href="#">Home</a>
//         <a href="#">About</a>
//         <a href="#">Alumni</a>
//         <a href="#">Contact</a>
//       </div>

//       <div className="right-section">
//         {student ? (
//           <div className="profile">
//             <img src={student.img} alt="Profile" className="profile-img" />
//             <button onClick={handleLogout}>Logout</button>
//           </div>
//         ) : (
//           <button className="login-btn" onClick={handleLogin}>
//             Login
//           </button>
//         )}

      
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React, { useEffect, useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
   const [student, setStudent] = useState(null);

  const handleLogin = () => {
    setUser({
      name: "Rajendra Kumar",
       email: "rajendra@email.com",
       img: "https://randomuser.me/api/portraits/men/75.jpg",
     });
   };

     const handleLogout = () => {
    setUser(null);
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
      <div className="logo">CampusConnect</div>
      </div>

<div className={`nav-links ${menuOpen ? "active" : ""}`}>
         <a href="#">Home</a>         
         <a href="#">CTAE Club</a>
         <a href="#">Event</a>
         <a href="#">Placement</a>
         <a href="#">Alumni</a>
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
          <button className="login-btn">Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;