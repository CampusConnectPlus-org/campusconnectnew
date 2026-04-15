import React, { useState } from 'react';
import './CTAEClub.css';
import { motion } from 'framer-motion';
import axios from "axios";
import { useEffect } from "react";
import Footer from '../../components/footer/Footer';
const CTAEClub = () => {
  const [clubs, setClubs] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedClubId, setSelectedClubId] = useState(null);  const [expandedEvent, setExpandedEvent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isParticipateOpen, setIsParticipateOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    branch: '',
    mobile: '',
    email: '',
    collegeYear: '',
    gender: '',
    dob: '',
    hobby: '',
    contribution: '',
    enrollmentNo: '',
  });
  const [participateFormData, setParticipateFormData] = useState({
    firstName: '',
    lastName: '',
    branch: '',
    mobile: '',
    email: '',
    collegeYear: '',
    gender: '',
  });
useEffect(() => {

  axios.get("http://localhost:5000/api/clubs")

    .then((res) => {

      setClubs(res.data);

      if(res.data.length > 0){

        setSelectedClubId(res.data[0]._id);

      }

    })

    .catch((err)=>console.log(err))

    .finally(()=>setLoading(false));

}, []);
  const openRegistrationForm = () => {
    setIsFormOpen(true);
  };

  const closeRegistrationForm = () => {
    setIsFormOpen(false);
  };

  const openParticipateForm = () => {
    setIsParticipateOpen(true);
  };

  const closeParticipateForm = () => {
    setIsParticipateOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParticipateInputChange = (event) => {
    const { name, value } = event.target;
    setParticipateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleFormSubmit = async (event) => {
  event.preventDefault();

  try {

    await axios.post(
      `http://localhost:5000/api/clubs/${selectedClub._id}/register`,
      formData
    );

    alert("Request sent successfully");

    setIsFormOpen(false);

  } catch (err) {

    console.log(err);

  }
};

const handleParticipateSubmit = async (event) => {

  event.preventDefault();

  try {

    await axios.post(
      `http://localhost:5000/api/clubs/${selectedClub._id}/participate`,
      {
        eventTitle: selectedEvent.title,
        ...participateFormData
      }
    );

    alert("Participation submitted");

    setIsParticipateOpen(false);

  } catch (err) {

    console.log(err);

  }

};

  // const clubs = [
  //   {
  //     id: 'coding',
  //     name: 'Coding Club',
  //     heroTitle: 'Coding Club',
  //     heroDescription:
  //       'Join the Coding Club to enhance your programming skills, participate in hackathons, and build exciting software projects.',
  //     heroIcon: '</>',
  //     color: '#FF6B6B',
  //     about:
  //       'We are a group of passionate developers who love to build software. Our club organizes meetups, workshops, coding contests, and team projects for students of all skills.',
  //     teamMembers: [
  //       { id: 1, name: 'Sagar Kotai' },
  //     ],
  //     achievements: [
  //       { id: 1, title: '1st Place in Hackathon 2023', icon: '🥇' },
  //       { id: 2, title: 'Organised 2022 CodeCamp', icon: '📚' },
  //       { id: 3, title: 'Certified 50+ Coders', icon: '✅' },
  //     ],
  //     upcomingEvents: [
  //       {
  //         id: 1,
  //         title: 'Web Development Workshop',
  //         date: 'April 20, 2024',
  //         description: 'Master React, Node.js, and Firebase. Learn from industry experts and build real-world projects. No prior experience needed!',
  //       },
  //       {
  //         id: 2,
  //         title: 'Competitive Programming Contest',
  //         date: 'May 5, 2024',
  //         description: 'Challenge yourself with programming problems. Compete with peers, win prizes, and improve your problem-solving skills.',
  //       },
  //       {
  //         id: 3,
  //         title: 'Hackathon 2024',
  //         date: 'June 1-2, 2024',
  //         description: '48-hour hackathon with amazing prizes. Build innovative solutions. Mentorship from tech leads included.',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'robotics',
  //     name: 'Robotics Club',
  //     heroTitle: 'Robotics Club',
  //     heroDescription:
  //       'Build robots, automate systems, and explore the future of mechatronics with our hands-on Robotics Club.',
  //     heroIcon: '🤖',
  //     color: '#4ECDC4',
  //     about:
  //       'The Robotics Club brings together innovators interested in hardware, electronics, coding, and AI. We work on robot design, sensor systems, and autonomous challenges for inter-college competitions.',
  //     teamMembers: [
  //       { id: 1, name: 'Manas' },
  //       { id: 2, name: 'Dixit Rounak' },
  //     ],
  //     achievements: [
  //       { id: 1, title: 'Robot Design Award 2024', icon: '🏆' },
  //       { id: 2, title: 'National Bot Challenge Finalist', icon: '🤖' },
  //       { id: 3, title: '15+ Prototype Robots Built', icon: '🔧' },
  //     ],
  //     upcomingEvents: [
  //       {
  //         id: 1,
  //         title: 'Arduino & Microcontroller Workshop',
  //         date: 'April 15, 2024',
  //         description: 'Learn to program Arduino, build circuits, and create interactive projects. All components provided.',
  //       },
  //       {
  //         id: 2,
  //         title: 'Line Following Robot Challenge',
  //         date: 'May 10, 2024',
  //         description: 'Build autonomous robots and compete in a speed challenge. Showcase your engineering and coding skills.',
  //       },
  //       {
  //         id: 3,
  //         title: 'AI & Machine Learning in Robotics',
  //         date: 'June 8, 2024',
  //         description: 'Explore AI integration in robotics. Learn computer vision and autonomous decision-making.',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'energy',
  //     name: 'Energy Club',
  //     heroTitle: 'Energy Club',
  //     heroDescription:
  //       'Explore renewable energy, sustainability, and innovative energy solutions with the Energy Club.',
  //     heroIcon: '⚡',
  //     color: '#FFD93D',
  //     about:
  //       'Energy Club focuses on renewable energy sources, sustainable practices, and clean energy innovations. We organize workshops, seminars, and projects to create environmental awareness.',
  //     teamMembers: [
  //       { id: 1, name: 'Prakhar' },
  //       { id: 2, name: 'Bhoomi Shankar' },
  //     ],
  //     achievements: [
  //       { id: 1, title: 'Solar Panel Installation Project', icon: '☀️' },
  //       { id: 2, title: 'Green Campus Initiative Winner', icon: '🌱' },
  //       { id: 3, title: 'Sustainability Report 2024', icon: '📊' },
  //     ],
  //     upcomingEvents: [
  //       {
  //         id: 1,
  //         title: 'Solar Energy Workshop',
  //         date: 'April 18, 2024',
  //         description: 'Learn about photovoltaic systems and solar panel installation. Build your own small solar charger!',
  //       },
  //       {
  //         id: 2,
  //         title: 'Green Building Design Seminar',
  //         date: 'May 8, 2024',
  //         description: 'Discover sustainable architecture and energy-efficient building designs. Expert speakers included.',
  //       },
  //       {
  //         id: 3,
  //         title: 'Energy Innovation Hackathon',
  //         date: 'June 15-16, 2024',
  //         description: 'Create innovative solutions for energy challenges. Win cash prizes and internship opportunities.',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'safar',
  //     name: 'Safar Tak',
  //     heroTitle: 'Safar Tak',
  //     heroDescription:
  //       'Embark on a poetic journey with Safar Tak—where words dance, stories breathe, and shayaris touch the soul.',
  //     heroIcon: '✨',
  //     color: '#D4A5FF',
  //     about:
  //       'Safar Tak is where poetry comes alive through shayaris, storytelling, and creative writing. We are a passionate community of poets, writers, and storytellers dedicated to exploring emotions, culture, and imagination through words. Our club organizes poetry sessions, storytelling nights, creative writing workshops, and collaborative literary projects.',
  //     teamMembers: [
  //       { id: 1, name: 'Vritika Dadhich' },
  //       { id: 2, name: 'Ramavtar Saraswat' },
  //     ],
  //     achievements: [
  //       { id: 1, title: 'Poetry Anthology 2024 Published', icon: '📖' },
  //       { id: 2, title: '50+ Poets & Storytellers Connected', icon: '🎭' },
  //       { id: 3, title: 'Monthly Poetry Circle Award', icon: '⭐' },
  //     ],
  //     upcomingEvents: [
  //       {
  //         id: 1,
  //         title: 'Shayari & Poetry Open Mic Night',
  //         date: 'April 22, 2024',
  //         description: 'Share your verses and listen to beautiful shayaris. An intimate evening celebrating Urdu poetry and contemporary verses. All levels welcome!',
  //       },
  //       {
  //         id: 2,
  //         title: 'Storytelling Masterclass',
  //         date: 'May 15, 2024',
  //         description: 'Learn the art of storytelling from seasoned writers. Explore narrative techniques, character development, and how to captivate your audience.',
  //       },
  //       {
  //         id: 3,
  //         title: 'Creative Writing Workshop',
  //         date: 'June 5, 2024',
  //         description: 'Develop your writing skills through engaging exercises. Learn poetry forms, short story writing, and content creation techniques.',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'photography',
  //     name: 'Photography Club',
  //     heroTitle: 'Photography Club',
  //     heroDescription:
  //       'Capture the world through your lens and master photography with our dedicated Photography Club.',
  //     heroIcon: '📸',
  //     color: '#C7CEEA',
  //     about:
  //       'Photography Club is for creative minds who want to tell stories through images. We offer training in composition, lighting, editing, and conduct photography contests.',
  //     teamMembers: [
  //       { id: 1, name: 'Nimesh Ameta' },
  //     ],
  //     achievements: [
  //       { id: 1, title: 'National Photography Award', icon: '🏆' },
  //       { id: 2, title: '100+ Published Photos', icon: '📷' },
  //       { id: 3, title: 'Photo Exhibition 2024', icon: '🖼️' },
  //     ],
  //     upcomingEvents: [
  //       {
  //         id: 1,
  //         title: 'Photography Fundamentals',
  //         date: 'April 16, 2024',
  //         description: 'Master composition, exposure, and lighting. Learn camera basics and smartphone photography tricks.',
  //       },
  //       {
  //         id: 2,
  //         title: 'Photo Walk & Editing Session',
  //         date: 'May 12, 2024',
  //         description: 'Join us on a guided photo walk through campus. Learn post-processing with Lightroom and Photoshop.',
  //       },
  //       {
  //         id: 3,
  //         title: 'Photography Contest 2024',
  //         date: 'June 20, 2024',
  //         description: 'Showcase your work in our annual contest. Amazing prizes for best photos. No entry fee!',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'genesis',
  //     name: 'Genesis Club',
  //     heroTitle: 'Genesis Club',
  //     heroDescription:
  //       'Ignite your entrepreneurial spirit with Genesis Club, where ideas become startups and innovation drives success.',
  //     heroIcon: '🚀',
  //     color: '#FF8B94',
  //     about:
  //       'Genesis Club fosters entrepreneurship and innovation among students. We provide mentorship, resources, and networking opportunities to turn ideas into successful ventures.',
  //     teamMembers: [
  //       { id: 1, name: 'Vritika Dadhich' },
  //       { id: 2, name: 'Sayeda Sheenin' },
  //       { id: 3, name: 'Bhoopendra Sharma' },
  //     ],
  //     achievements: [
  //       { id: 1, title: 'Startup Launch Success 2024', icon: '🚀' },
  //       { id: 2, title: 'Innovation Challenge Winners', icon: '💡' },
  //       { id: 3, title: '10+ Student Startups Incubated', icon: '🏢' },
  //     ],
  //     upcomingEvents: [
  //       {
  //         id: 1,
  //         title: 'Startup Bootcamp',
  //         date: 'April 25, 2024',
  //         description: 'Intensive 2-day bootcamp covering business fundamentals, pitching, and funding. Industry mentors present.',
  //       },
  //       {
  //         id: 2,
  //         title: 'Pitch Perfect Workshop',
  //         date: 'May 20, 2024',
  //         description: 'Learn to craft compelling pitches. Get feedback from investors and successful entrepreneurs.',
  //       },
  //       {
  //         id: 3,
  //         title: 'Innovation Challenge 2024',
  //         date: 'June 25, 2024',
  //         description: 'Present your ideas for a chance to win funding and mentorship. Top teams get startup support.',
  //       },
  //     ],
  //   },
  // ];

  // const selectedClub = clubs.find((club) => club.id === selectedClubId) || clubs[0];
const selectedClub = clubs.find(
  (club) => club._id === selectedClubId
);

const selectedEvent = selectedClub?.upcomingEvents?.find(
  (event) => event._id === expandedEvent
);

// ADD THIS
if (loading || !selectedClub) {
  return <p>Loading clubs...</p>;
}
  return (
    <>
    <div className="ctae-club-container">
      {/* NEW: Club selector tabs for multiple clubs */}
      <div className="club-switcher">
        {clubs.map((club) => (
          <button
            key={club._id}
className={`club-tab ${selectedClubId === club._id ? 'active' : ''}`}
onClick={() => setSelectedClubId(club._id)}
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
            <button className="join-btn" onClick={openRegistrationForm}>Join Now</button>
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
                key={event._id}
                className={`event-card ${expandedEvent === event._id ? 'expanded' : ''}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <p className="event-date">📅 {event.date}</p>
                </div>
                {expandedEvent === event._id && (
                  <motion.div
                    className="event-details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="event-desc">{event.description}</p>
                  </motion.div>
                )}
                <div className="event-actions">
                  <button
                    className="view-btn"
                    onClick={() => setExpandedEvent(expandedEvent === event._id ? null : event._id)}
                  >
                    {expandedEvent === event._id ? 'Hide Details' : 'View'}
                  </button>
                  {expandedEvent === event._id && (
                    <button className="participate-btn" onClick={openParticipateForm}>
                      Participate
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="no-events">Coming soon! Stay tuned for exciting events.</p>
        )}
      </section>

      {isFormOpen && (
        <div className="modal-overlay" onClick={closeRegistrationForm}>
          <motion.div
            className="registration-modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="modal-label">Club Join Request</p>
                <h2>Register for {selectedClub.name}</h2>
                <p className="modal-subtitle">
                  Share your details and tell us what you can bring to the club.
                </p>
              </div>
              <button className="modal-close" onClick={closeRegistrationForm}>
                ×
              </button>
            </div>

            <form className="registration-form" onSubmit={handleFormSubmit}>
              <div className="form-grid">
                <label className="form-field">
                  <span>First Name</span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Last Name</span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Branch</span>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Enrollment No.</span>
                  <input
                    type="text"
                    name="enrollmentNo"
                    value={formData.enrollmentNo}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Mobile No.</span>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10}"
                    placeholder="9876543210"
                  />
                </label>

                <label className="form-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>College Year</span>
                  <select
                    name="collegeYear"
                    value={formData.collegeYear}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select year
                    </option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Gender</span>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Date of Birth</span>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="form-field form-span-full">
                  <span>Hobby</span>
                  <input
                    type="text"
                    name="hobby"
                    value={formData.hobby}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="form-field form-span-full">
                  <span>What can you bring to the club?</span>
                  <textarea
                    name="contribution"
                    value={formData.contribution}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={closeRegistrationForm}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Submit Registration
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isParticipateOpen && (
        <div className="modal-overlay" onClick={closeParticipateForm}>
          <motion.div
            className="registration-modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <p className="modal-label">Event Participation</p>
                <h2>Participate in {selectedEvent?.title || 'this event'}</h2>
                <p className="modal-subtitle">
                  Tell us about yourself and get ready to join the event.
                </p>
              </div>
              <button className="modal-close" onClick={closeParticipateForm}>
                ×
              </button>
            </div>

            <form className="registration-form" onSubmit={handleParticipateSubmit}>
              <div className="form-grid">
                <label className="form-field">
                  <span>First Name</span>
                  <input
                    type="text"
                    name="firstName"
                    value={participateFormData.firstName}
                    onChange={handleParticipateInputChange}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Last Name</span>
                  <input
                    type="text"
                    name="lastName"
                    value={participateFormData.lastName}
                    onChange={handleParticipateInputChange}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Branch</span>
                  <input
                    type="text"
                    name="branch"
                    value={participateFormData.branch}
                    onChange={handleParticipateInputChange}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Mobile No.</span>
                  <input
                    type="tel"
                    name="mobile"
                    value={participateFormData.mobile}
                    onChange={handleParticipateInputChange}
                    required
                    pattern="[0-9]{10}"
                    placeholder="9876543210"
                  />
                </label>

                <label className="form-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={participateFormData.email}
                    onChange={handleParticipateInputChange}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Gender</span>
                  <select
                    name="gender"
                    value={participateFormData.gender}
                    onChange={handleParticipateInputChange}
                    required
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </label>

                <label className="form-field form-span-full">
                  <span>College Year</span>
                  <select
                    name="collegeYear"
                    value={participateFormData.collegeYear}
                    onChange={handleParticipateInputChange}
                    required
                  >
                    <option value="" disabled>
                      Choose year
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={closeParticipateForm}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Submit Participation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
    <Footer />
    
    </>
  );
};

export default CTAEClub;