import React, { useState ,useEffect} from 'react';
import './Event.css';
import { motion } from 'framer-motion';
import axios from "axios";

  const API = "http://localhost:5000/api/events";

const Event = () => {

const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isParticipateOpen, setIsParticipateOpen] = useState(false);
  const [participateEvent, setParticipateEvent] = useState(null);
  const [participateForm, setParticipateForm] = useState({
    name: '',
    year: '',
    branch: '',
    email: '',
    mobile: '',
    gender: '',
  });
  const getStatus = (date) => {
  if (!date) return "upcoming";
  return new Date(date) < new Date() ? "past" : "upcoming";
};
const fetchEvents = async () => {
  try {
    const res = await axios.get(API);
    const formatted = normalizeEvents(res.data);
    setEvents(formatted);
  } catch (err) {
    console.log("Fetch error:", err.message);
  }
};
useEffect(() => {
  fetchEvents();
}, []);
  // const events = [
  //   {
  //     id: 1,
  //     title: 'Tech Innovation Summit 2026',
  //     category: 'technical',
  //     status: 'upcoming',
  //     date: 'May 24-25, 2026',
  //     location: 'Innovation Center & Smart Lab',
  //     image1: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80',
  //     description: 'A two-day summit featuring AI demos, startup talks, and live product showcases by student teams.',
  //     details: {
  //       overview: 'Bring your ideas to life through workshops, keynote sessions, and rapid prototype challenges.',
  //       highlights: [
  //         'AI and Robotics Demo Arena',
  //         'Startup Mentorship Clinic',
  //         'Innovation Pitch Showcase',
  //         'Cloud and App Development Workshops'
  //       ],
  //       schedule: [
  //         { day: 'Day 1', events: 'Opening keynote, demo arena, workshop tracks' },
  //         { day: 'Day 2', events: 'Mentoring rounds, pitch showcase, awards' }
  //       ]
  //     }
  //   },
  //   {
  //     id: 2,
  //     title: 'Alumni Career Connect 2026',
  //     category: 'alumni',
  //     status: 'upcoming',
  //     date: 'July 12, 2026',
  //     location: 'Convention Hall',
  //     image1: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
  //     description: 'A career-focused networking event connecting students with alumni mentors and recruiters.',
  //     details: {
  //       overview: 'Students can attend mentoring circles, resume clinics, and domain-specific networking sessions.',
  //       highlights: [
  //         'One-on-one mentorship slots',
  //         'Resume and LinkedIn review desk',
  //         'Industry panel conversations',
  //         'Internship opportunity announcements'
  //       ],
  //       schedule: [
  //         { day: 'Morning', events: 'Registration, opening session, panel talks' },
  //         { day: 'Afternoon', events: 'Mentoring circles and networking tables' }
  //       ]
  //     }
  //   },
  //   {
  //     id: 3,
  //     title: 'Research Expo 2026',
  //     category: 'seminar',
  //     status: 'upcoming',
  //     date: 'September 6, 2026',
  //     location: 'Seminar Complex',
  //     image1: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=80',
  //     description: 'An interdisciplinary research expo with paper presentations, poster sessions, and expert lectures.',
  //     details: {
  //       overview: 'Showcase your latest work and explore research opportunities across engineering, management, and science streams.',
  //       highlights: [
  //         'Poster presentation zone',
  //         'Faculty and industry keynote sessions',
  //         'Best paper and best poster awards',
  //         'Research collaboration desk'
  //       ],
  //       schedule: [
  //         { day: 'Session 1', events: 'Keynote and poster round' },
  //         { day: 'Session 2', events: 'Paper talks, panel, and closing awards' }
  //       ]
  //     }
  //   },
  //   {
  //     id: 4,
  //     title: 'Winter Carnival',
  //     category: 'fest',
  //     status: 'past',
  //     date: 'December 10-12, 2025',
  //     location: 'Main Ground & Amphitheatre',
  //     image1: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
  //     description: 'A festive winter celebration with music, bonfire nights, and student performances.',
  //     details: {
  //       overview: 'Winter Carnival brought together music, games, food streets, and seasonal decor across campus.',
  //       highlights: [
  //         'DJ and live band nights',
  //         'Bonfire circle and food court',
  //         'Student dance and fashion performances',
  //         'Night photography corner'
  //       ],
  //       galleryImages: [
  //         'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
  //         'https://images.unsplash.com/photo-1464375117522-1311dd6a1fd2?auto=format&fit=crop&w=900&q=80',
  //         'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=80'
  //       ]
  //     }
  //   },
  //   {
  //     id: 5,
  //     title: 'College Fest',
  //     category: 'cultural',
  //     status: 'past',
  //     date: 'October 2-4, 2025',
  //     location: 'Central Stage & Activity Block',
  //     image1: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1400&q=80',
  //     description: 'Three days of dance, art, drama, and competitions celebrating campus culture.',
  //     details: {
  //       overview: 'College Fest featured cultural showcases, literary contests, and high-energy student performances.',
  //       highlights: [
  //         'Battle of dance crews',
  //         'Theatre and mono-act stage',
  //         'Creative arts and rangoli challenge',
  //         'Campus talent awards'
  //       ],
  //       galleryImages: [
  //         'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80',
  //         'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=900&q=80',
  //         'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80'
  //       ]
  //     }
  //   },
  //   {
  //     id: 6,
  //     title: 'University Fest',
  //     category: 'fest',
  //     status: 'past',
  //     date: 'August 14-17, 2025',
  //     location: 'University Arena',
  //     image1: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1400&q=80',
  //     description: 'The annual inter-college mega fest with competitions, concerts, and exhibitions.',
  //     details: {
  //       overview: 'University Fest hosted teams from multiple colleges for sports, culture, and innovation battles.',
  //       highlights: [
  //         'Inter-college showdown rounds',
  //         'Headline artist concert',
  //         'Innovation and startup pavilion',
  //         'Sports finals and closing parade'
  //       ],
  //       galleryImages: [
  //         'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=900&q=80',
  //         'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80',
  //         'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80'
  //       ]
  //     }
  //   },
  //   {
  //     id: 7,
  //     title: 'Summer Carnival',
  //     category: 'fest',
  //     status: 'past',
  //     date: 'May 18-19, 2025',
  //     location: 'Open Air Theatre',
  //     image1: 'https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&w=1400&q=80',
  //     description: 'A colorful summer event with music, games, and daytime activities for all students.',
  //     details: {
  //       overview: 'Summer Carnival filled the campus with open-air fun zones, performances, and creative competitions.',
  //       highlights: [
  //         'Sunset acoustic sessions',
  //         'Color splash activity zone',
  //         'Food trucks and summer treats',
  //         'Outdoor gaming and team challenges'
  //       ],
  //       galleryImages: [
  //         'https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&w=900&q=80',
  //         'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80',
  //         'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80'
  //       ]
  //     }
  //   }
  // ];
const normalizeEvents = (data) => {
  return data.map((e) => ({
    id: e._id,
    title: e.title,
    category: e.category,
    date: e.date ? new Date(e.date).toLocaleDateString() : "",
    location: e.location,
    description: e.description || "",

    status: getStatus(e.date),   // 👈 THIS IS THE FIX

    image1: e.bannerImage
      ? `http://localhost:5000/${e.bannerImage}`
      : "",

    details: {
      overview: e.details?.overview || "",
      highlights: e.details?.highlights || [],
      schedule: e.details?.schedule || [],
      galleryImages: (e.details?.galleryImages || []).map(img =>
        typeof img === "string" ? img : img.url
      ),
    },
  }));
};
  const monthLookup = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  // const parseEventDateRange = (dateText) => {
  //   if (!dateText) {
  //     return null;
  //   }

  //   const normalized = dateText.trim();

  //   if (/ongoing/i.test(normalized)) {
  //     return { start: null, end: null };
  //   }

  //   const rangeMatch = normalized.match(
  //     /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b\s+(\d{1,2})\s*[-–]\s*(\d{1,2}),?\s*(\d{4})/i
  //   );

  //   if (rangeMatch) {
  //     const monthIndex = monthLookup[rangeMatch[1].toLowerCase()];
  //     const startDay = Number(rangeMatch[2]);
  //     const endDay = Number(rangeMatch[3]);
  //     const year = Number(rangeMatch[4]);

  //     return {
  //       start: new Date(year, monthIndex, startDay),
  //       end: new Date(year, monthIndex, endDay, 23, 59, 59, 999),
  //     };
  //   }

  //   const singleDateMatch = normalized.match(
  //     /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b\s+(\d{1,2}),?\s*(\d{4})/i
  //   );

  //   if (singleDateMatch) {
  //     const monthIndex = monthLookup[singleDateMatch[1].toLowerCase()];
  //     const day = Number(singleDateMatch[2]);
  //     const year = Number(singleDateMatch[3]);

  //     return {
  //       start: new Date(year, monthIndex, day),
  //       end: new Date(year, monthIndex, day, 23, 59, 59, 999),
  //     };
  //   }

  //   const monthYearMatch = normalized.match(
  //     /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b\s*,?\s*(\d{4})/i
  //   );

  //   if (monthYearMatch) {
  //     const monthIndex = monthLookup[monthYearMatch[1].toLowerCase()];
  //     const year = Number(monthYearMatch[2]);

  //     return {
  //       start: new Date(year, monthIndex, 1),
  //       end: new Date(year, monthIndex + 1, 0, 23, 59, 59, 999),
  //     };
  //   }

  //   const yearMatch = normalized.match(/\b(\d{4})\b/);
  //   if (!yearMatch) {
  //     return null;
  //   }

  //   const year = Number(yearMatch[1]);
  //   return {
  //     start: new Date(year, 0, 1),
  //     end: new Date(year, 11, 31, 23, 59, 59, 999),
  //   };
  // };

  // const getEventStatus = (event) => {
  //   const range = parseEventDateRange(event.date);

  //   if (!range) {
  //     return event.status || 'upcoming';
  //   }

  //   if (!range.start || !range.end) {
  //     return 'upcoming';
  //   }

  //   return new Date() > range.end ? 'past' : 'upcoming';
  // };

  // const normalizedEvents = events.map((event) => ({
  //   ...event,
  //   status: getEventStatus(event),
  // }));

 const upcomingEvents = events.filter(e => e.status === "upcoming");
const pastEvents = events.filter(e => e.status === "past");
  const openParticipateForm = (event) => {
    setParticipateEvent(event);
    setIsParticipateOpen(true);
  };

  const closeParticipateForm = () => {
    setIsParticipateOpen(false);
    setParticipateEvent(null);
  };

  const handleParticipateInput = (e) => {
    const { name, value } = e.target;
    setParticipateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleParticipateSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `http://localhost:5000/api/events/register/${participateEvent.id}`,
      participateForm
    );

    console.log(res.data);
    alert("Registration successful");

    setParticipateForm({
      name: "",
      year: "",
      branch: "",
      email: "",
      mobile: "",
      gender: "",
    });

    closeParticipateForm();
  } catch (err) {
    console.log(err);
    alert("Registration failed");
  }
};

  const getEventImages = (event) => {
    if (!event) {
      return [];
    }

    const uploadedGallery = Array.isArray(event.details?.galleryImages)
      ? event.details.galleryImages
      : [];

    const directImages = [event.image1, event.image2, event.image3, event.image4].filter(Boolean);

    return [...new Set([...uploadedGallery, ...directImages])];
  };

  const selectedEventImages = getEventImages(selectedEvent);

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

      {/* Upcoming Events Section */}
      <section className="upcoming-events">
        <div className="section-heading-wrap">
          <p className="section-tag">Plan Ahead</p>
          <h2>Upcoming Events</h2>
          <p className="section-subtext">
            Explore what is coming next and reserve your participation in advance.
          </p>
        </div>

        <div className="upcoming-grid">
          {upcomingEvents.map((event, index) => (
            <motion.article
              key={event.id}
              className="upcoming-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <div className="upcoming-card-head">
                <span className="category-chip">{event.category}</span>
                <h3>{event.title}</h3>
              </div>

              <div className="event-meta">
                <span>📅 {event.date}</span>
                <span>📍 {event.location}</span>
              </div>

              <p className="event-description">{event.description}</p>

              <div className="event-card-actions">
                <button className="open-btn" onClick={() => setSelectedEvent(event)}>
                  Read Details
                </button>
                <button className="participate-btn" onClick={() => openParticipateForm(event)}>
                  Participate
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="all-events">
        <div className="section-heading-wrap">
          <p className="section-tag">Memories</p>
          <h2>Past Events</h2>
          <p className="section-subtext">
            Event cards with photos that can be displayed from admin-uploaded images.
          </p>
        </div>

        <div className="event-grid">
          {pastEvents.map((event, index) => (
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
                <img src={event.image1 || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80'} alt={event.title} />
                <div className="category-tag">{event.category}</div>
              </div>
              <div className="event-card-content">
                <h3>{event.title}</h3>
                <div className="event-meta">
                  <span className="date">📅 {event.date}</span>
                  <span className="location">📍 {event.location}</span>
                </div>
                <p className="event-description">{event.description}</p>
                <button className="open-btn" onClick={() => setSelectedEvent(event)}>
                  View Highlights
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal for Event Details */}
      {selectedEvent && (
        <motion.div 
          className="event-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            className="event-modal-content"
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

            <div className="event-modal-header">
              <img 
                src={selectedEvent.image1 || 'https://via.placeholder.com/800x400'} 
                alt={selectedEvent.title} 
                className="modal-image"
              />
              <h2>{selectedEvent.title}</h2>
            </div>

            <div className="event-modal-body
">
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

              {selectedEvent.status === 'past' && selectedEventImages.length > 0 && (
                <div className="section">
                  <h3>Past Event Moments</h3>
                  <div className="past-gallery-grid">
                    {selectedEventImages.map((image, index) => (
                      <img
                        key={`${selectedEvent.id}-gallery-${index}`}
                        src={image}
                        alt={`${selectedEvent.title} moment ${index + 1}`}
                        className="past-gallery-image"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.status !== 'past' && selectedEvent.details.schedule && (
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
              )}

              {selectedEvent.status === 'upcoming' && (
                <div className="modal-actions">
                  {/* <button className="register-btn" onClick={() => openParticipateForm(selectedEvent)}>
                    Participate
                  </button> */}
                  <button className="share-btn">Share Event</button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {isParticipateOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={closeParticipateForm}
        >
          <motion.div
            className="participate-modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeParticipateForm}>
              ✕
            </button>

            <div className="participate-header">
              <p className="section-tag">Participation Form</p>
              <h2>{participateEvent?.title || 'Event Participation'}</h2>
              <p>Please fill in your details to participate in this event.</p>
            </div>

            <form className="participate-form" onSubmit={handleParticipateSubmit}>
              <label className="form-field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  value={participateForm.name}
                  onChange={handleParticipateInput}
                  required
                />
              </label>

              <label className="form-field">
                <span>Year</span>
                <select
                  name="year"
                  value={participateForm.year}
                  onChange={handleParticipateInput}
                  required
                >
                  <option value="" disabled>
                    Select year
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </label>

              <label className="form-field">
                <span>Branch</span>
                <input
                  type="text"
                  name="branch"
                  value={participateForm.branch}
                  onChange={handleParticipateInput}
                  required
                />
              </label>

              <label className="form-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={participateForm.email}
                  onChange={handleParticipateInput}
                  required
                />
              </label>

              <label className="form-field">
                <span>Mobile No.</span>
                <input
                  type="tel"
                  name="mobile"
                  value={participateForm.mobile}
                  onChange={handleParticipateInput}
                  pattern="[0-9]{10}"
                  placeholder="9876543210"
                  required
                />
              </label>

              <label className="form-field">
                <span>Gender</span>
                <select
                  name="gender"
                  value={participateForm.gender}
                  onChange={handleParticipateInput}
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

              <div className="participate-actions">
                <button type="button" className="share-btn" onClick={closeParticipateForm}>
                  Cancel
                </button>
                <button type="submit" className="register-btn">
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Event;