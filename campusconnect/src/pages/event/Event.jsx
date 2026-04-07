import React from 'react'
import './Event.css'
import Footer from '../../components/footer/Footer'

const Event = () => {
  return (
   <>
    
      <div className="event-card">
        <h1 className="event-title">Tech Fest 2026</h1>
        <p className="event-date">Date: 25 April 2026</p>
        <p className="event-location">Location: College Auditorium</p>

        <div className="event-info">
          <h2>About Event</h2>
          <p>
            Join us for an exciting Tech Fest where you can explore new
            technologies, participate in coding competitions, and network with
            industry experts.
          </p>
        </div>

        <button className="register-btn">Register Now</button>
      </div>
 
     <Footer /> 
   </>
  
  )
}

export default Event
