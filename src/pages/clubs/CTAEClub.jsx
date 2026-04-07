import React, { useState } from 'react';
import './CTAEClub.css';
import { motion } from 'framer-motion';

// NEW ADDITION: CTAE Clubs Page Component
// Displays multiple CTAE clubs with a club selector and dynamic detail sections
const CTAEClub = () => {
  // NEW: State for selected club and modal image
  const [selectedClubId, setSelectedClubId] = useState('coding');
  const [selectedImage, setSelectedImage] = useState(null);

  // NEW: Data for multiple clubs
  const clubs = [
    {
      id: 'coding',
      name: 'Coding Club',
      heroTitle: 'Coding Club',
      heroDescription:
        'Join the Coding Club to enhance your programming skills, participate in hackathons, and build exciting software projects.',
      heroIcon: '</>',
      about:
        'We are a group of passionate developers who love to build software. Our club organizes meetups, workshops, coding contests, and team projects for students of all skills.',
      teamMembers: [
        {
          id: 1,
          name: 'Rajesh Sharma',
          role: 'Club Lead',
          img: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        {
          id: 2,
          name: 'Sarah Patel',
          role: 'Tech Lead',
          img: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
        {
          id: 3,
          name: 'Chirag Mishra',
          role: 'CCO',
          img: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
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
          date: 'May 15, 2024',
          img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
          description: 'Firebase, Java, JavaScript, Node. Learn from top peers.',
        },
        {
          id: 2,
          title: 'Hackathon 2024',
          date: 'June 5, 2024',
          img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
          description: 'Join competitors, compete, win prizes and be a top hacker.',
        },
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500',
      ],
    },
    {
      id: 'robotics',
      name: 'Robotics Club',
      heroTitle: 'Robotics Club',
      heroDescription:
        'Build robots, automate systems, and explore the future of mechatronics with our hands-on Robotics Club.',
      heroIcon: '🤖',
      about:
        'The Robotics Club brings together innovators interested in hardware, electronics, coding, and AI. We work on robot design, sensor systems, and autonomous challenges for inter-college competitions.',
      teamMembers: [
        {
          id: 1,
          name: 'Priya Singh',
          role: 'Robotics Lead',
          img: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        {
          id: 2,
          name: 'Amit Joshi',
          role: 'Hardware Specialist',
          img: 'https://randomuser.me/api/portraits/men/45.jpg',
        },
        {
          id: 3,
          name: 'Nisha Kumari',
          role: 'Automation Engineer',
          img: 'https://randomuser.me/api/portraits/women/46.jpg',
        },
      ],
      achievements: [
        { id: 1, title: 'Robot Design Award 2024', icon: '🏆' },
        { id: 2, title: 'National Bot Challenge Finalist', icon: '🤖' },
        { id: 3, title: '15+ Prototype Robots Built', icon: '🔧' },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Autonomous Bot Sprint',
          date: 'June 12, 2024',
          img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
          description: 'Design autonomous robots and compete in speed-based challenges.',
        },
        {
          id: 2,
          title: 'Electronics Workshop',
          date: 'July 1, 2024',
          img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500',
          description: 'Learn circuits, sensors, and microcontrollers for real-world robotics.',
        },
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=500',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500',
      ],
    },
    {
      id: 'cultural',
      name: 'Cultural Club',
      heroTitle: 'Cultural Club',
      heroDescription:
        'Celebrate performance, art, and tradition with the Cultural Club through events, festivals, and creative workshops.',
      heroIcon: '🎭',
      about:
        'The Cultural Club organizes dance, music, theater, and cultural fests to inspire creativity and build community across the campus.',
      teamMembers: [
        {
          id: 1,
          name: 'Meera Verma',
          role: 'Event Coordinator',
          img: 'https://randomuser.me/api/portraits/women/55.jpg',
        },
        {
          id: 2,
          name: 'Karan Mehta',
          role: 'Dance Captain',
          img: 'https://randomuser.me/api/portraits/men/56.jpg',
        },
        {
          id: 3,
          name: 'Aisha Khan',
          role: 'Creative Lead',
          img: 'https://randomuser.me/api/portraits/women/57.jpg',
        },
      ],
      achievements: [
        { id: 1, title: 'Cultural Fest Winner 2023', icon: '🏅' },
        { id: 2, title: 'Best Dance Performance', icon: '💃' },
        { id: 3, title: '25+ Campus Events Hosted', icon: '🎤' },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Music Night',
          date: 'June 20, 2024',
          img: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?w=500',
          description: 'An evening of live music and student performances.',
        },
        {
          id: 2,
          title: 'Drama Workshop',
          date: 'July 15, 2024',
          img: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=500',
          description: 'Build confidence and stage skills in our drama workshop.',
        },
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1485217988980-11786ced9454?w=500',
        'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=500',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500',
        'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=500',
        'https://images.unsplash.com/photo-1469594292607-7bd66f64d9e6?w=500',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500',
      ],
    },
    {
      id: 'genesis',
      name: 'Genesis Club',
      heroTitle: 'Genesis Club',
      heroDescription:
        'Ignite your entrepreneurial spirit with Genesis Club, where ideas become startups and innovation drives success.',
      heroIcon: '🚀',
      about:
        'Genesis Club fosters entrepreneurship and innovation among students. We provide mentorship, resources, and networking opportunities to turn ideas into successful ventures.',
      teamMembers: [
        {
          id: 1,
          name: 'Arjun Kapoor',
          role: 'Entrepreneurship Lead',
          img: 'https://randomuser.me/api/portraits/men/60.jpg',
        },
        {
          id: 2,
          name: 'Sneha Reddy',
          role: 'Innovation Manager',
          img: 'https://randomuser.me/api/portraits/women/61.jpg',
        },
        {
          id: 3,
          name: 'Vikram Singh',
          role: 'Startup Mentor',
          img: 'https://randomuser.me/api/portraits/men/62.jpg',
        },
      ],
      achievements: [
        { id: 1, title: 'Startup Launch Success 2024', icon: '🚀' },
        { id: 2, title: 'Innovation Challenge Winners', icon: '💡' },
        { id: 3, title: '10+ Student Startups Incubated', icon: '🏢' },
      ],
      upcomingEvents: [
        {
          id: 1,
          title: 'Pitch Perfect Workshop',
          date: 'June 25, 2024',
          img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500',
          description: 'Learn to craft compelling pitches and present your startup ideas effectively.',
        },
        {
          id: 2,
          title: 'Entrepreneurship Summit',
          date: 'July 10, 2024',
          img: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500',
          description: 'Connect with industry leaders and gain insights into building successful businesses.',
        },
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500',
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
            <h3>Team Members</h3>
            <div className="team-grid">
              {selectedClub.teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="team-card"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={member.img} alt={member.name} />
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Recent Achievements Section */}
      <section className="achievements-section">
        <h2>Recent Achievements</h2>
        <div className="achievements-grid">
          {selectedClub.achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className="achievement-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              <p>{achievement.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW: Upcoming Events Section */}
      <section className="events-section">
        <h2>Upcoming Events</h2>
        <div className="events-grid">
          {selectedClub.upcomingEvents.map((event) => (
            <motion.div
              key={event.id}
              className="event-card"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img src={event.img} alt={event.title} />
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-date">📅 {event.date}</p>
                <p className="event-desc">{event.description}</p>
                <button className="register-btn">Register Now</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW: Gallery Section */}
      <section className="gallery-section">
        <h2>Gallery</h2>
        <p className="gallery-subtitle">Explore photos from our club activities, workshops, and events</p>
        <div className="gallery-grid">
          {selectedClub.galleryImages.map((img, index) => (
            <motion.div
              key={index}
              className="gallery-item"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImage(img)}
              cursor="pointer"
            >
              <img src={img} alt={`Gallery ${index}`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW: Image Modal/Lightbox */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <motion.div
            className="modal-content"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage} alt="Full view" />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CTAEClub;
