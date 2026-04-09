import React, { useState } from 'react';
import './Event.css';
import { motion } from 'framer-motion';

const Event = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const events = [
    {
      id: 1,
      title: 'Cultural Fest 2024',
      category: 'cultural',
      date: 'April 20-22, 2024',
      location: 'Main Campus Grounds',
      image1: 'public/eventimage/cultural-fest-1.jpg',
      image2: 'public/eventimage/cultural-fest-2.jpg',
      featured: true,
      description: 'Experience the vibrant tapestry of Indian culture at our grand Cultural Fest! A celebration of art, music, dance, and traditions from across the country.',
      details: {
        overview: 'Join us for three days of mesmerizing performances, food stalls, art exhibitions, and interactive cultural workshops.',
        highlights: [
          'Classical Dance Performances (Bharatanatyam, Kathak, Kathakali)',
          'Live Music Concert with renowned artists',
          'Cultural Fashion Show showcasing traditional attire',
          'Art & Craft Exhibition',
          'International Food Court',
          'Mehndi & Henna Stalls',
          'Rangoli Competition',
          'Cultural Quiz & Knowledge Sessions'
        ],
        schedule: [
          { day: 'Day 1', events: 'Opening Ceremony, Classical Dance, Traditional Music' },
          { day: 'Day 2', events: 'Fashion Show, Food Festival, Art Exhibition' },
          { day: 'Day 3', events: 'Live Concert, Closing Ceremony, Prize Distribution' }
        ],
        attendance: '5000+ expected',
        entryFee: 'Free for students'
      }
    },
    {
      id: 2,
      title: 'Winter Fest',
      category: 'fest',
      date: 'December 10-12, 2024',
      location: 'Campus Auditorium & Grounds',
      featured: true,
      description: 'Experience the magical winter season with performances, competitions, and festive celebrations.',
      details: {
        overview: 'A three-day extravaganza celebrating the winter season with music, dance, sports, and fun activities for all.',
        highlights: [
          'DJ Night & Dance Party',
          'Winter Sports Tournaments (Basketball, Badminton, Table Tennis)',
          'Band Performances',
          'Bonfire Gathering',
          'Food Carnival',
          'Photography Exhibition',
          'Stand-up Comedy Show',
          'Prize Games & Activities'
        ],
        schedule: [
          { day: 'Day 1', events: 'Opening Ceremony, Sports Events, DJ Night' },
          { day: 'Day 2', events: 'Band Performance, Food Carnival, Photography Walk' },
          { day: 'Day 3', events: 'Comedy Show, Closing Ceremony, Awards' }
        ],
        attendance: '4000+ expected',
        entryFee: 'Minimal registration fee'
      }
    },
    {
      id: 3,
      title: 'Hackathon 2024',
      category: 'technical',
      date: 'May 1-2, 2024',
      location: 'Computer Lab & Innovation Center',
      featured: true,
      description: '48-hour coding marathon where innovation meets competition. Build amazing projects and win exciting prizes!',
      details: {
        overview: 'A thrilling 48-hour hackathon where teams compete to build creative technology solutions. Open to all students.',
        highlights: [
          'Real-time Problem Statements',
          'Mentorship from Industry Professionals',
          'Access to Latest Technologies & APIs',
          '24/7 Food & Refreshments',
          'Workshops on Web Dev, AI/ML, and IoT',
          'Live Judging & Feedback',
          'Prize Pool: ₹2,00,000+',
          'Networking with Tech Companies'
        ],
        schedule: [
          { day: 'Day 1', events: 'Registration, Kickoff, Problem Statement Release, Workshops' },
          { day: 'Day 2', events: 'Development Continues, Mentor Support, Final Hour Sprint' },
          { day: 'Day 3', events: 'Presentations, Judging, Prize Distribution' }
        ],
        attendance: '200+ participants (50+ teams)',
        entryFee: 'Free (Team of 2-4 members)'
      }
    },
    {
      id: 4,
      title: 'Alumni Meet-Up 2024',
      category: 'alumni',
      date: 'March 15, 2024',
      location: 'Campus Convention Center',
      featured: true,
      description: 'Reconnect with your alma mater! A grand reunion of alumni across all batches and departments.',
      details: {
        overview: 'A nostalgic gathering where alumni share their journey, success stories, and reconnect with batch mates.',
        highlights: [
          'Welcome Reception & Dinner',
          'Campus Tour for Alumni Families',
          'Success Story Sessions by Distinguished Alumni',
          'Career Mentoring for Current Students',
          'Batch-wise Reunion Meetups',
          'Entertainment & Cultural Program',
          'Alumni-Student Networking Session',
          'Photo Booth & Memory Lane Exhibition'
        ],
        schedule: [
          { day: 'Morning', events: 'Registration, Campus Tour' },
          { day: 'Afternoon', events: 'Success Stories, Networking, Mentoring Sessions' },
          { day: 'Evening', events: 'Dinner, Cultural Program, Batch Reunions' }
        ],
        attendance: '1000+ alumni expected',
        entryFee: 'Complimentary for alumni'
      }
    },
    {
      id: 5,
      title: 'University-Wide Fest',
      category: 'fest',
      date: 'August 5-8, 2024',
      location: 'Multiple Venues Across Campus',
      featured: true,
      description: 'The largest inter-college festival showcasing talent, art, and innovation from across the university.',
      details: {
        overview: 'A four-day mega event featuring competitions, performances, and exhibitions from multiple colleges.',
        highlights: [
          'Inter-College Dance Competition',
          'Battle of Bands',
          'Fashion Show (College-wise)',
          'Debate & Speech Championship',
          'Sports Tournament',
          'Art & Photography Contest',
          'Tech Innovation Showcase',
          'Cultural Exhibition Hall'
        ],
        schedule: [
          { day: 'Day 1', events: 'Opening Ceremony, Dance Competition, Debate Preliminaries' },
          { day: 'Day 2', events: 'Battle of Bands, Fashion Shows, Sports Events' },
          { day: 'Day 3', events: 'Art Contest, Tech Showcase, Comedy Night' },
          { day: 'Day 4', events: 'Finals, Performances, Closing Ceremony' }
        ],
        attendance: '10000+ across all days',
        entryFee: 'Variable per event'
      }
    },
    {
      id: 6,
      title: 'Guest Lecture Series & Seminars',
      category: 'seminar',
      date: 'Every Month (Ongoing)',
      location: 'Seminar Hall & Online',
      featured: false,
      description: 'Regular seminars featuring industry experts, thought leaders, and accomplished professionals.',
      details: {
        overview: 'Interactive sessions with professionals from various fields to share insights on career, innovation, and life.',
        highlights: [
          'Leadership & Entrepreneurship Talks',
          'Tech Industry Insights',
          'Skills Development Workshops',
          'Career Guidance Sessions',
          'Research Presentations',
          'Q&A with Renowned Speakers',
          'Networking Opportunities',
          'Certificate of Attendance'
        ],
        schedule: [
          { day: 'Monthly', events: '2-3 seminars covering diverse topics' },
          { day: 'Duration', events: '1-2 hours each session' },
          { day: 'Mode', events: 'In-person + Online streaming' }
        ],
        attendance: '200-500 per session',
        entryFee: 'Free for all students'
      }
    },
    {
      id: 7,
      title: 'College-Wise Science Fest',
      category: 'fest',
      date: 'June 15-17, 2024',
      location: 'Science Block & Lab Areas',
      featured: false,
      description: 'Showcase of innovative science projects and research work by students.',
      details: {
        overview: 'Science students exhibit their research, experiments, and innovative projects in an interactive setup.',
        highlights: [
          'Research Project Exhibition',
          'Live Experiments & Demonstrations',
          'Innovation Challenge',
          'Science Quiz',
          'Robotics & Automation Display',
          'Environmental Sustainability Projects',
          'Mentoring from Research Scholars',
          'Certificate & Awards for Best Projects'
        ],
        schedule: [
          { day: 'Day 1', events: 'Project Setup, Opening, Live Demonstrations' },
          { day: 'Day 2', events: 'Exhibits, Quiz, Innovation Challenge' },
          { day: 'Day 3', events: 'Special Talks, Awards Ceremony, Closing' }
        ],
        attendance: '2000+ visitors',
        entryFee: 'Free entry'
      }
    },
    {
      id: 8,
      title: 'Commerce & Management Fest',
      category: 'fest',
      date: 'July 20-21, 2024',
      location: 'Commerce Department',
      featured: false,
      description: 'Business simulation, case competitions, and industry interactions for commerce students.',
      details: {
        overview: 'An engaging fest for business students featuring case studies, stock market simulations, and startup pitches.',
        highlights: [
          'Business Case Competition',
          'Stock Market Simulation',
          'Startup Pitch Competition',
          'Resume Workshop',
          'Industry Panel Discussion',
          'Entrepreneurship Games',
          'Prizes & Internship Opportunities',
          'Networking with Business Leaders'
        ],
        schedule: [
          { day: 'Day 1', events: 'Registration, Case Competition, Simulation Games' },
          { day: 'Day 2', events: 'Startup Pitches, Panel Discussion, Awards' }
        ],
        attendance: '800+ participants',
        entryFee: 'Registration fee per event'
      }
    },
    {
      id: 9,
      title: 'Arts & Literature Festival',
      category: 'fest',
      date: 'September 10-12, 2024',
      location: 'Auditorium & Exhibition Hall',
      featured: false,
      description: 'Celebration of literary arts, poetry, drama, and creative writing.',
      details: {
        overview: 'A festival celebrating the written and spoken word through poetry, drama, storytelling, and creative workshops.',
        highlights: [
          'Poetry Slam & Shayari Night',
          'Drama Performances',
          'Short Film Festival',
          'Creative Writing Workshop',
          'Book Discussion Forum',
          'Author Meet & Greet',
          'Literary Art Exhibition',
          'Prizes for Best Performances'
        ],
        schedule: [
          { day: 'Day 1', events: 'Poetry Slam, Drama Performances, Workshops' },
          { day: 'Day 2', events: 'Film Screening, Author Session, Creative Writing' },
          { day: 'Day 3', events: 'Final Night, Awards, Closing Ceremony' }
        ],
        attendance: '1500+ expected',
        entryFee: 'Nominal entry fee'
      }
    }
  ];

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'fest', label: 'Fests' },
    { id: 'technical', label: 'Technical' },
    { id: 'alumni', label: 'Alumni' },
    { id: 'seminar', label: 'Seminars' }
  ];

  const filteredEvents = activeCategory === 'all' 
    ? events 
    : events.filter(event => event.category === activeCategory);

  return (
    <div className="event-container">
      {/* Hero Section */}
      <section className="event-hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Campus Events & Celebrations</h1>
          <p>Discover amazing events happening around campus throughout the year</p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="filter-section">
        <div className="category-filter">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </div>
      </section>

      {/* All Events Grid */}
      <section className="all-events">
        <h2>All Events</h2>
        <div className="event-grid">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className="event-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="event-card-image">
                <img src={event.image1 || 'https://via.placeholder.com/350x200'} alt={event.title} />
                <div className="category-tag">{event.category}</div>
              </div>
              <div className="event-card-content">
                <h3>{event.title}</h3>
                <div className="event-meta">
                  <span className="date">📅 {event.date}</span>
                  <span className="location">📍 {event.location}</span>
                </div>
                <p className="event-description">{event.description}</p>
                <button 
                  className="open-btn"
                  onClick={() => setSelectedEvent(event)}
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal for Event Details */}
      {selectedEvent && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="close-btn"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>

            <div className="modal-header">
              <img 
                src={selectedEvent.image1 || 'https://via.placeholder.com/800x400'} 
                alt={selectedEvent.title} 
                className="modal-image"
              />
              <h2>{selectedEvent.title}</h2>
            </div>

            <div className="modal-body">
              <div className="modal-meta">
                <div className="meta-item">
                  <span className="icon">📅</span>
                  <div>
                    <p className="meta-label">Date</p>
                    <p className="meta-value">{selectedEvent.date}</p>
                  </div>
                </div>
                <div className="meta-item">
                  <span className="icon">📍</span>
                  <div>
                    <p className="meta-label">Location</p>
                    <p className="meta-value">{selectedEvent.location}</p>
                  </div>
                </div>
              </div>

              <div className="section">
                <h3>Overview</h3>
                <p>{selectedEvent.details.overview}</p>
              </div>

              <div className="section">
                <h3>Highlights</h3>
                <ul className="highlights-list">
                  {selectedEvent.details.highlights.map((highlight, index) => (
                    <li key={index}>✨ {highlight}</li>
                  ))}
                </ul>
              </div>

              <div className="section">
                <h3>Schedule</h3>
                <div className="schedule-grid">
                  {selectedEvent.details.schedule.map((item, index) => (
                    <div key={index} className="schedule-item">
                      <p className="schedule-day">{item.day}</p>
                      <p className="schedule-events">{item.events}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section info-grid">
                <div className="info-box">
                  <p className="info-label">Expected Attendance</p>
                  <p className="info-value">{selectedEvent.details.attendance}</p>
                </div>
                <div className="info-box">
                  <p className="info-label">Entry Fee</p>
                  <p className="info-value">{selectedEvent.details.entryFee}</p>
                </div>
              </div>

              {selectedEvent.image2 && (
                <div className="section">
                  <h3>Event Gallery</h3>
                  <img 
                    src={selectedEvent.image2} 
                    alt="Event gallery" 
                    className="gallery-image"
                  />
                </div>
              )}

              <div className="modal-actions">
                <button className="register-btn">Register Now</button>
                <button className="share-btn">Share Event</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Event;
