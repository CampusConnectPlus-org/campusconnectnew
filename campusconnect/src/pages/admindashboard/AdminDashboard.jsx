import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { Outlet } from "react-router-dom";
import "./AdminDashboard.css";
// import axios from "axios";

// import DashboardHome from "../dashboardhome/DashboardHome";
import { useEffect,useState } from "react";

const AdminDashboard = ({admin, setAdmin}) => {

  return (
   <>
    <div className="dashboard">
      <Sidebar />

    
        <div className="main">
        <AdminNavbar admin={admin} setAdmin={setAdmin} />
          <Outlet />
      </div>
      

   
     
    </div>
   </>
  );
};

export default AdminDashboard;