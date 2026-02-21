import React from 'react'
import Navbar from './components/navbar/Navbar'
import Hero from './components/hero/Hero'
import Alumni from './components/alumni/Alumni'
import CompanySlider from './components/campanylist/CompanySlider'
import Impact from './components/impacts/Impact'
import Footer from './components/footer/Footer'

const App = () => {
  return (
    <div>
     <Navbar />
     <Hero  />
    <Alumni />
     <CompanySlider />
     <Impact  />
     <Footer  />
    </div>
  )
}

export default App
