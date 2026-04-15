import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './AdminNavbar.css'

const AdminNavbar = ({ admin, setAdmin }) => {
  const [showProfile, setShowProfile] = useState(false);
  const hideTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTimeout(hideTimeoutRef.current);
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setAdmin(null);
    navigate("/", { replace: true });
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

  return (
    <nav className="admin-navbar">
      <h2>Admin Dashboard</h2>


      {/* Right Profile */}
      <div
        className="profile-wrapper"
        onMouseEnter={handleProfileEnter}
        onMouseLeave={handleProfileLeave}
      >

        {admin ? (
          <> <p>Welcome, Admin</p>
            <img
              src={`http://localhost:5000${admin.profileImage}`}
              alt="profile"
              className="profile-img"
            />

            {showProfile && (
              <div className="profile-dropdown" onMouseEnter={handleProfileEnter} onMouseLeave={handleProfileLeave}>
                <img src={`http://localhost:5000${admin.profileImage}`} alt="" />
                <h4>{admin.name}</h4>
                <p>{admin.email}</p>
                {/* <p className="role">{admin.role}</p> */}

                {/* <button>View Profile</button> */}
                <button className="logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        ) : (
          <div className="buttons">
            <Link to="/adminlogin">
              <button onClick={() => { navigate('/adminlogin') }} className="login-btn">Logout</button>
            </Link>

          </div>


        )}


      </div>
    </nav>
  );
};

export default AdminNavbar;