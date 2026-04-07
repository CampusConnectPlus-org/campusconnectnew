import React from "react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router";

const Sidebar = () => {
  const navigate = useNavigate;
  const changePage = () =>{
    navigate("/adminpages")
  }
  return (
    <div className="sidebar">
      <h2>🎓 CampusConnect</h2>
      <ul>
        <li className="active"><NavLink  to="/admindashboard" style={{textDecoration:"none" , color:"white", background:"none"}}>Dashboard</NavLink></li>
        <li> <NavLink to="/admindashboard/manageuser" style={{textDecoration:"none" , color:"white", background:"none"}} >Manage Users</NavLink></li>
        <li ><NavLink  to="/admindashboard/adminpage" style={{textDecoration:"none" , color:"white", background:"none"}}>Alumni Recoard</NavLink></li>
        <li><NavLink  to="/admindashboard/manageevent" style={{textDecoration:"none" , color:"white", background:"none"}}>Events</NavLink></li>
        <li><NavLink  to="/admindashboard/adminpage" style={{textDecoration:"none" , color:"white", background:"none"}}>Settings</NavLink></li>
      </ul>
      <div className="logout">Logout</div>
    </div>
  );
};

export default Sidebar;


