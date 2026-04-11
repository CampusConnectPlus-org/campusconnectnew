import React from 'react'
import StatsCard from "../../components/admin/StatsCard";
import UsersTable from "../../components/admin/UsersTable";
import ActivityChart from "../../components/admin/ActivityChart";
import RecentEvents from "../../components/admin/RecentEvents";
import './DashboardHome.css'
// import { useEffect,useState } from 'react';

const DashboardHome = () => {
  
  //  const [alumniData, setAlumniData] = useState([]);
  
  //     useEffect(() => {
  //     fetch("http://localhost:5000/alumni")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setAlumniData(data);
  //       });
  //   }, []);
  
   
  return (
   <>
   <div className="cards">
          <StatsCard title="Total Users" value="320" color="blue" />
          <StatsCard title="Total Alumni" value="150"  color="green" />
          <StatsCard title="Events" value="8" color="orange" />
          <StatsCard title="Pending" value="5" color="red" />
        </div>

        <div className="content">
          <div className="left">
            <UsersTable />
          </div>

          <div className="right">
            <ActivityChart />
            <RecentEvents />
          </div>
        </div>
   </>
   
  )
}

export default DashboardHome
