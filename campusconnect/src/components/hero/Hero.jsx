import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Hero.css";
import { Link } from "react-router-dom";

const CTAE_SLIDE = {
  title: "About CTAE",
  desc: "The College of Technology and Engineering (CTAE), Udaipur, established in 1964, is a constituent college of the Maharana Pratap University of Agriculture and Technology. It began as an agricultural engineering program and has grown into a prominent institution advancing technical education and research in Rajasthan.",
  img: "https://www.feeltheudaipur.com/wp-content/uploads/2020/02/ctae-udaipur-udaipurian.jpeg",
  button: "Explore More",
  path: "/aboutctae",
};

const DEFAULT_EVENT_IMAGE =
  "https://d12m9erqbesehq.cloudfront.net/wp-content/uploads/sites/2/2023/12/10195608/Blog-Banner-Fun-events-for-college-fest.jpg";

const buildEventSlide = (event) => ({
  id: event._id,
  title: event.title || "Upcoming Event",
  desc:
    event.description ||
    `${event.category || "Event"} at ${event.location || "Campus"}`,
  img: event.bannerImage
    ? event.bannerImage.startsWith("http")
      ? event.bannerImage
      : `http://localhost:5000/${event.bannerImage}`
    : DEFAULT_EVENT_IMAGE,
  button: "View Event",
  path: `/event?eventId=${event._id}`,
});

export default function HeroSection() {
  const [slides, setSlides] = useState([CTAE_SLIDE]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        if (!res.ok) return;
        const data = await res.json();
        const upcomingEvents = data
          .filter((event) => {
            const eventDate = new Date(event.date);
            return (
              !Number.isNaN(eventDate.getTime()) && eventDate >= new Date()
            );
          })
          .slice(0, 3)
          .map(buildEventSlide);

        setSlides([CTAE_SLIDE, ...upcomingEvents]);
      } catch (error) {
        console.error("Unable to load event slides:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[index] || CTAE_SLIDE;

  return (
    <div className="hero-container">
      <motion.div
        key={index}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="hero-slide"
      >
        <div className="hero-text">
          <h1>{activeSlide.title}</h1>
          <p>{activeSlide.desc}</p>
          <Link className="hero-btn" to={activeSlide.path}>
            {activeSlide.button}
          </Link>
        </div>

        <div className="hero-image">
          <img src={activeSlide.img} alt={activeSlide.title} />
        </div>
      </motion.div>
    </div>
  );
}
