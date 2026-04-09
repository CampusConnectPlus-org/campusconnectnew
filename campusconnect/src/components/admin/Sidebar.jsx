import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>🎓 CampusConnect</h2>
      <ul>
        <li><NavLink to="/admindashboard" end className={({ isActive }) => isActive ? "nav-active" : ""}>Dashboard</NavLink></li>
        <li><NavLink to="/admindashboard/manageuser" className={({ isActive }) => isActive ? "nav-active" : ""}>Manage Users</NavLink></li>
        <li><NavLink to="/admindashboard/adminpage" className={({ isActive }) => isActive ? "nav-active" : ""}>Alumni Record</NavLink></li>
        <li><NavLink to="/admindashboard/manageevent" className={({ isActive }) => isActive ? "nav-active" : ""}>Events</NavLink></li>
        {/* <li><NavLink to="/admindashboard/settings" end className={({ isActive }) => isActive ? "nav-active" : ""}>Settings</NavLink></li> */}
      </ul>
      <div className="logout">Logout</div>
    </div>
  );
};

export default Sidebar;


