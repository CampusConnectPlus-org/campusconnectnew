import React from "react";
import { useNavigate } from "react-router";
import { useState } from "react";
import './AdminNavbar.css'
import { Link } from "react-router";

const AdminNavbar = ({admin}) => {
    const [showProfile, setShowProfile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const  handleLogout = ()=>{

// localStorage.removeItem("token");
localStorage.removeItem("admin");
navigate("/",{replace:true});
setAdmin(null);

      if(!admin) return 
};
  return (
      <nav className="admin-navbar">
              <h2>Admin Dashboard</h2>
             

     {/* Right Profile */}
           <div
              className="profile-wrapper"
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
            >
                
              {admin ? (
                <> <p>Welcome, Admin</p>
                  <img
                    src={`http://localhost:5000/uploads/${admin.profileImage}`}
                    alt="profile"
                    className="profile-img"
                  />
      
                  {showProfile && (
                    <div className="profile-dropdown">
                      <img src={`http://localhost:5000/uploads/${admin.profileImage}`} alt="" />
                      <h4>{admin.name}</h4>
                      <p>{admin.email}</p>
                      {/* <p className="role">{admin.role}</p> */}
      
                      <button>View Profile</button>
                      <button className="logout" onClick={handleLogout}>Logout</button>
                    </div>
                  )}
                </>
              ) : (
               <div className="buttons">
                 <Link to="/adminlogin">
                  <button onClick={() =>{navigate('/adminlogin')}} className="login-btn">Logout</button>
                </Link>
               </div>
                
              )}
              
            
            </div>
            </nav>
  );
};

export default AdminNavbar;