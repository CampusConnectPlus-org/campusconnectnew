import React from 'react'
import StatsCard from "../../components/admin/StatsCard";
import UsersTable from "../../components/admin/UsersTable";
import ActivityChart from "../../components/admin/ActivityChart";
import RecentEvents from "../../components/admin/RecentEvents";
import './DashboardHome.css'
import { useEffect,useState } from 'react';
import axios from 'axios';

const DashboardHome = () => {
  
  //  const [alumniData, setAlumniData] = useState([]);
  
  //     useEffect(() => {
  //     fetch("http://localhost:5000/alumni")
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setAlumniData(data);
  //       });
  //   }, []);
  const [users, setUsers] = useState([]);
    const [userCount, setUserCount] = useState(0);
const [alumniCount, setAlumniCount] = useState(0);

console.log("User Count:", userCount);

useEffect(()=>{
fetchCounts();
},[userCount, alumniCount]);


const fetchCounts = async () =>{
  try{
     const token = localStorage.getItem("token");
    const userRes = await axios.get("http://localhost:5000/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const alumniRes = await axios.get("http://localhost:5000/alumni", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUsers(users)
    setUserCount(userRes.data.length);
    setAlumniCount(alumniRes.data.length);

  }
  catch(err){
    console.log("Error fetching counts:", err);
}
}
 
  
   
  return (
   <>
   <div className="cards">
          <StatsCard title="Total Users" value={userCount} color="blue" />
          <StatsCard title="Total Alumni" value={alumniCount} color="green" />
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
