import React from 'react'
import { Routes, Route } from 'react-router-dom'
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
// NEW ADDITION: Import CTAE Club detail page component
import CTAEClub from './pages/clubs/CTAEClub'



const App = () => {
  return (
    <div>
     <Navbar />
      
      <Routes>
  
            <Route path='/' element = {
              <>
                <Hero />
                <AlumniSection />
                <CompanySlider />
                <Impact />
              </>
            }/>


<Route path='/event' element={<Event />} />
       <Route path='/placement' element={<Placement />} />
       <Route path='/alumni' element={<AlumniPage />} />
       {/* NEW ADDITION: Route for CTAE Club detail page */}
       <Route path='/clubs/ctae-coding-club' element={<CTAEClub />} />
        
        <Route path="/login" element={<Login />} />
           </Routes>
     <Footer  />
  
    </div>
  )
}

export default App
