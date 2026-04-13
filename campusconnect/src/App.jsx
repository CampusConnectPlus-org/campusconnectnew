import React from 'react'
import ProtectedRoute from './routes/ProtectedRoute'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import AlumniSection from './components/alumniSection/AlumniSection'
import CompanySlider from './components/campanylist/CompanySlider'
import Impact from './components/impacts/Impact'
import Footer from './components/footer/Footer'
import Login from './pages/login/Login'
import Placement from './pages/placement/Placement'
import Event from './pages/event/Event'
import AlumniPage from './pages/alumni/AlumniPage'
import { useState, useEffect } from 'react'
import AdminDashboard from './pages/admindashboard/AdminDashboard'
import AdminLogin from './pages/adminlogin/AdminLogin'
import DashboardHome from './pages/dashboardhome/DashboardHome'
import AlumniRecord from './pages/admindashboard/adminpage/AlumniRecord'
import AdminEvents from './pages/admindashboard/manageevent/AdminEvents'
import ManageUser from './pages/admindashboard/manageuser/ManageUser'
import ManageClubs from './pages/admindashboard/manageclubs/ManageClubs'
import ManagePlacements from './pages/admindashboard/manageplacements/ManagePlacements'
import CTAEClub from './pages/clubs/CTAEClub'
// import ManageEvent from './pages/admindashboard/manageevent/ManageEvent'
// import AddAdmin from './pages/admindashboard/adminadd/AddAdmin'


const App = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  useEffect(() => {

    fetch("http://localhost:5000/admin/profile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }

    })
      .then(res => res.json())
      .then(data => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));

        }
      });

  }, [])
  console.log("User in App:", user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in App useEffect:", token);

    if (token) {
      fetch("http://localhost:5000/admin/api/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(res => res.json())
        .then(data => {
          setAdmin(data); // fresh data from backend
        });
    }
  }, []);

  console.log("Admin in App:", admin);

  const hideMainNavbar = location.pathname.startsWith('/admindashboard');

  return (

    <div>
      {!hideMainNavbar && <Navbar user={user} setUser={setUser} admin={admin} setAdmin={setAdmin} />}
      <Routes>
        <Route path='/' element={
          <>
            <Hero />
            <AlumniSection />
            <CompanySlider />
            <Impact />
            <Footer />
          </>
        } />

        <Route path="/login" element={<Login setUser={setUser} />} />
        {/* protectedroutes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/placement' element={<Placement user={user} setUser={setUser} />} />
          <Route path='/alumni' element={<AlumniPage />} />
          <Route path='/event' element={<Event />} />
          <Route path='/clubs' element={<CTAEClub />} />


        </Route>


        {/* <Route path='/admindashboard' element={<AdminDashboard admin={admin} setAdmin={setAdmin}/>}/> */}
        <Route path="/admindashboard" element={<AdminDashboard admin={admin} setAdmin={setAdmin} />}>
          <Route index element={<DashboardHome />} />
          <Route path='manageuser' element={<ManageUser />} />
          <Route path='adminpage' element={<AlumniRecord />} />
          <Route path='manageevent' element={< AdminEvents/>} />
          <Route path='manageclubs' element={<ManageClubs/>} />


</Route>
<Route path='/adminlogin' element={<AdminLogin setAdmin={setAdmin}/>}/>
      </Routes>
    </div>
  )
}

export default App
