import React, { useState } from 'react';
import './CTAEClub.css';
import { motion } from 'framer-motion';

const CTAEClub = () => {
  const [selectedClubId, setSelectedClubId] = useState('coding');
  const [expandedEvent, setExpandedEvent] = useState(null);

  const clubs = [
    {
      id: 'coding',
      name: 'Coding Club',
      heroTitle: 'Coding Club',
      heroDescription:
        'Join the Coding Club to enhance your programming skills, participate in hackathons, and build exciting software projects.',
      heroIcon: '</>',
      color: '#FF6B6B',
      about:
        'We are a group of passionate developers who love to build software. Our club organizes meetups, workshops, coding contests, and team projects for students of all skills.',
      teamMembers: [
        { id: 1, name: 'Sagar Kotai' },
      ],
      achievements: [
        { id: 1, title: '1st Place in Hackathon 2023', icon: '🥇' },
        { id: 2, title: 'Organised 2022 CodeCamp', icon: '📚' },
        { id: 3, title: 'Certified 50+ Coders', icon: '✅' },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Web Development Workshop',
          date: 'April 20, 2024',
          description: 'Master React, Node.js, and Firebase. Learn from industry experts and build real-world projects. No prior experience needed!',
        },
        {
          id: 2,
          title: 'Competitive Programming Contest',
          date: 'May 5, 2024',
          description: 'Challenge yourself with programming problems. Compete with peers, win prizes, and improve your problem-solving skills.',
        },
        {
          id: 3,
          title: 'Hackathon 2024',
          date: 'June 1-2, 2024',
          description: '48-hour hackathon with amazing prizes. Build innovative solutions. Mentorship from tech leads included.',
        },
      ],
    },
    {
      id: 'robotics',
      name: 'Robotics Club',
      heroTitle: 'Robotics Club',
      heroDescription:
        'Build robots, automate systems, and explore the future of mechatronics with our hands-on Robotics Club.',
      heroIcon: '🤖',
      color: '#4ECDC4',
      about:
        'The Robotics Club brings together innovators interested in hardware, electronics, coding, and AI. We work on robot design, sensor systems, and autonomous challenges for inter-college competitions.',
      teamMembers: [
        { id: 1, name: 'Manas' },
        { id: 2, name: 'Dixit Rounak' },
      ],
      achievements: [
        { id: 1, title: 'Robot Design Award 2024', icon: '🏆' },
        { id: 2, title: 'National Bot Challenge Finalist', icon: '🤖' },
        { id: 3, title: '15+ Prototype Robots Built', icon: '🔧' },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Arduino & Microcontroller Workshop',
          date: 'April 15, 2024',
          description: 'Learn to program Arduino, build circuits, and create interactive projects. All components provided.',
        },
        {
          id: 2,
          title: 'Line Following Robot Challenge',
          date: 'May 10, 2024',
          description: 'Build autonomous robots and compete in a speed challenge. Showcase your engineering and coding skills.',
        },
        {
          id: 3,
          title: 'AI & Machine Learning in Robotics',
          date: 'June 8, 2024',
          description: 'Explore AI integration in robotics. Learn computer vision and autonomous decision-making.',
        },
      ],
    },
    {
      id: 'energy',
      name: 'Energy Club',
      heroTitle: 'Energy Club',
      heroDescription:
        'Explore renewable energy, sustainability, and innovative energy solutions with the Energy Club.',
      heroIcon: '⚡',
      color: '#FFD93D',
      about:
        'Energy Club focuses on renewable energy sources, sustainable practices, and clean energy innovations. We organize workshops, seminars, and projects to create environmental awareness.',
      teamMembers: [
        { id: 1, name: 'Prakhar' },
        { id: 2, name: 'Bhoomi Shankar' },
      ],
      achievements: [
        { id: 1, title: 'Solar Panel Installation Project', icon: '☀️' },
        { id: 2, title: 'Green Campus Initiative Winner', icon: '🌱' },
        { id: 3, title: 'Sustainability Report 2024', icon: '📊' },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Solar Energy Workshop',
          date: 'April 18, 2024',
          description: 'Learn about photovoltaic systems and solar panel installation. Build your own small solar charger!',
        },
        {
          id: 2,
          title: 'Green Building Design Seminar',
          date: 'May 8, 2024',
          description: 'Discover sustainable architecture and energy-efficient building designs. Expert speakers included.',
        },
        {
          id: 3,
          title: 'Energy Innovation Hackathon',
          date: 'June 15-16, 2024',
          description: 'Create innovative solutions for energy challenges. Win cash prizes and internship opportunities.',
        },
      ],
    },
    {
      id: 'safar',
      name: 'Safar Tak',
      heroTitle: 'Safar Tak',
      heroDescription:
        'Embark on a poetic journey with Safar Tak—where words dance, stories breathe, and shayaris touch the soul.',
      heroIcon: '✨',
      color: '#D4A5FF',
      about:
        'Safar Tak is where poetry comes alive through shayaris, storytelling, and creative writing. We are a passionate community of poets, writers, and storytellers dedicated to exploring emotions, culture, and imagination through words. Our club organizes poetry sessions, storytelling nights, creative writing workshops, and collaborative literary projects.',
      teamMembers: [
        { id: 1, name: 'Vritika Dadhich' },
        { id: 2, name: 'Ramavtar Saraswat' },
      ],
      achievements: [
        { id: 1, title: 'Poetry Anthology 2024 Published', icon: '📖' },
        { id: 2, title: '50+ Poets & Storytellers Connected', icon: '🎭' },
        { id: 3, title: 'Monthly Poetry Circle Award', icon: '⭐' },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Shayari & Poetry Open Mic Night',
          date: 'April 22, 2024',
          description: 'Share your verses and listen to beautiful shayaris. An intimate evening celebrating Urdu poetry and contemporary verses. All levels welcome!',
        },
        {
          id: 2,
          title: 'Storytelling Masterclass',
          date: 'May 15, 2024',
          description: 'Learn the art of storytelling from seasoned writers. Explore narrative techniques, character development, and how to captivate your audience.',
        },
        {
          id: 3,
          title: 'Creative Writing Workshop',
          date: 'June 5, 2024',
          description: 'Develop your writing skills through engaging exercises. Learn poetry forms, short story writing, and content creation techniques.',
        },
      ],
    },
    {
      id: 'photography',
      name: 'Photography Club',
      heroTitle: 'Photography Club',
      heroDescription:
        'Capture the world through your lens and master photography with our dedicated Photography Club.',
      heroIcon: '📸',
      color: '#C7CEEA',
      about:
        'Photography Club is for creative minds who want to tell stories through images. We offer training in composition, lighting, editing, and conduct photography contests.',
      teamMembers: [
        { id: 1, name: 'Nimesh Ameta' },
      ],
      achievements: [
        { id: 1, title: 'National Photography Award', icon: '🏆' },
        { id: 2, title: '100+ Published Photos', icon: '📷' },
        { id: 3, title: 'Photo Exhibition 2024', icon: '🖼️' },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Photography Fundamentals',
          date: 'April 16, 2024',
          description: 'Master composition, exposure, and lighting. Learn camera basics and smartphone photography tricks.',
        },
        {
          id: 2,
          title: 'Photo Walk & Editing Session',
          date: 'May 12, 2024',
          description: 'Join us on a guided photo walk through campus. Learn post-processing with Lightroom and Photoshop.',
        },
        {
          id: 3,
          title: 'Photography Contest 2024',
          date: 'June 20, 2024',
          description: 'Showcase your work in our annual contest. Amazing prizes for best photos. No entry fee!',
        },
      ],
    },
    {
      id: 'genesis',
      name: 'Genesis Club',
      heroTitle: 'Genesis Club',
      heroDescription:
        'Ignite your entrepreneurial spirit with Genesis Club, where ideas become startups and innovation drives success.',
      heroIcon: '🚀',
      color: '#FF8B94',
      about:
        'Genesis Club fosters entrepreneurship and innovation among students. We provide mentorship, resources, and networking opportunities to turn ideas into successful ventures.',
      teamMembers: [
        { id: 1, name: 'Vritika Dadhich' },
        { id: 2, name: 'Sayeda Sheenin' },
        { id: 3, name: 'Bhoopendra Sharma' },
      ],
      achievements: [
        { id: 1, title: 'Startup Launch Success 2024', icon: '🚀' },
        { id: 2, title: 'Innovation Challenge Winners', icon: '💡' },
        { id: 3, title: '10+ Student Startups Incubated', icon: '🏢' },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Startup Bootcamp',
          date: 'April 25, 2024',
          description: 'Intensive 2-day bootcamp covering business fundamentals, pitching, and funding. Industry mentors present.',
        },
        {
          id: 2,
          title: 'Pitch Perfect Workshop',
          date: 'May 20, 2024',
          description: 'Learn to craft compelling pitches. Get feedback from investors and successful entrepreneurs.',
        },
        {
          id: 3,
          title: 'Innovation Challenge 2024',
          date: 'June 25, 2024',
          description: 'Present your ideas for a chance to win funding and mentorship. Top teams get startup support.',
        },
      ],
    },
  ];

  const selectedClub = clubs.find((club) => club.id === selectedClubId) || clubs[0];

  return (
    <div className="ctae-club-container">
      {/* NEW: Club selector tabs for multiple clubs */}
      <div className="club-switcher">
        {clubs.map((club) => (
          <button
            key={club.id}
            className={`club-tab ${selectedClubId === club.id ? 'active' : ''}`}
            onClick={() => setSelectedClubId(club.id)}
          >
            {club.name}
          </button>
        ))}
      </div>

      {/* NEW: Hero Banner Section */}
      <div className="club-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>{selectedClub.heroTitle}</h1>
            <p>{selectedClub.heroDescription}</p>
            <button className="join-btn">Join Now</button>
          </div>
          <div className="hero-icon">
            <div className="code-icon">{selectedClub.heroIcon}</div>
          </div>
        </div>
      </div>

      {/* NEW: About Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>About</h2>
            <p>{selectedClub.about}</p>
          </div>
          <div className="team-section">
            <h3>Team Leads</h3>
            <div className="team-grid">
              {selectedClub.teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="team-card"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4>{member.name}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Upcoming Events Section */}
      <section className="events-section">
        <h2>Upcoming Events</h2>
        {selectedClub.upcomingEvents.length > 0 ? (
          <div className="events-grid">
            {selectedClub.upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                className={`event-card ${expandedEvent === event.id ? 'expanded' : ''}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <p className="event-date">📅 {event.date}</p>
                </div>
                {expandedEvent === event.id && (
                  <motion.div
                    className="event-details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="event-desc">{event.description}</p>
                  </motion.div>
                )}
                <button
                  className="view-btn"
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                >
                  {expandedEvent === event.id ? 'Hide Details' : 'View'}
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="no-events">Coming soon! Stay tuned for exciting events.</p>
        )}
      </section>
    </div>
  );
};

export default CTAEClub;
