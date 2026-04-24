import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";


const Sidebar = () => {

  return (
    <div className="sidebar">
      <h2>🎓 CampusConnect+</h2>
      <ul>
        <li>
          <NavLink
            to="/admindashboard"
            end
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admindashboard/manageuser"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            Manage Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admindashboard/adminpage"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            Alumni Record
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admindashboard/manageevent"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            Events
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admindashboard/manage-participation"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            Participation Requests
          </NavLink>
        </li>

        {/* NEW: Clubs Section */}
        <li>
          <NavLink
            to="/admindashboard/manageclubs"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            Clubs
          </NavLink>
        </li>

        {/* NEW: Placements Section */}

        <li>
          <NavLink
            to="/admindashboard/manageplacements"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            Placements
          </NavLink>
        </li>
<li>
  <Link to="/admindashboard/managereports">Manage Reports</Link>
</li>
        {/* NEW: Add Admin Section */}
        {/* <li>
          <NavLink
            to="/admindashboard/adminadd"
            className={({ isActive }) => (isActive ? "nav-active" : "")}
          >
            Add Admin
          </NavLink>
        </li> */}

      </ul>
      {/* <div className="logout">Logout</div> */}

    </div>

  );
};

export default Sidebar;