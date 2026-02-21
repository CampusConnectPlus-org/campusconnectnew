import { useEffect, useState } from "react"; 
import { motion } from "framer-motion";
 import "./Hero.css";

const slides = [ 
  { title: "Alumni MeetUp 2026",
   desc: "Join workshops, hackathons and guest speakers.", 
   img: "https://firebasestorage.googleapis.com/v0/b/alumini-admin.appspot.com/o/manage-gallery%2F2025-05-30T13%3A21%3A24.157Zgallery4.jpg?alt=media&token=34c047f9-7afc-4834-a680-68a6a0c41207",
   },
  { title: "Cultural Fest 2026", 
    desc: "Music, dance and celebration with campus friends.",
     img: "https://d12m9erqbesehq.cloudfront.net/wp-content/uploads/sites/2/2023/12/10195608/Blog-Banner-Fun-events-for-college-fest.jpg", 
    },
  { title: "About CTAE", 
    desc: "The College of Technology and Engineering (CTAE), Udaipur, established in 1964, is a constituent college of the Maharana Pratap University of Agriculture and Technology. It began as an agricultural engineering program, originally part of the Rajasthan College of Agriculture, and has since grown into a prominent public institution. CTAE offers undergraduate programs in engineering, particularly in agricultural engineering, and was ranked 125th by IIRF in the B.Tech category. The college plays a key role in advancing technical education and research in agriculture and technology in Rajasthan..",
     img: "https://www.feeltheudaipur.com/wp-content/uploads/2020/02/ctae-udaipur-udaipurian.jpeg", 
    }, 
  ];

export default function HeroSection() {

const [index, setIndex] = useState(0);

useEffect(() => { const timer = setInterval(() => { setIndex((prev) => (prev + 1) % slides.length); }, 4000); return () => clearInterval(timer); }, []);

return ( 
<div className="hero-container">
   <motion.div key={index} initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "-100%", opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}
    className="hero-slide" >
       <div className="hero-text">
         <h1>{slides[index].title}</h1>
          <p>{slides[index].desc}</p> 
          <button>Explore Event</button>
           </div>

<div className="hero-image">
      <img src={slides[index].img} alt="event" />
    </div>
  </motion.div>
</div>

); }


