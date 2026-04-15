import React, { useState } from 'react'
import "./AboutCtae.css";

const AboutCtae = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    { id: 1, src: "https://www.targetadmission.com/storage/img/colleges/newc/50359-766667.webp", alt: "Campus Main Building" },
    { id: 2, src: "https://assets.collegedunia.com/public/image/top_4_College_tour_of_CTAE_udaipur_udaipur_nit_ctae_mbm_csab_reap_counselling_iit_bestcounsellor_frame_2249_enhanced_fcc74e4ded54e544c125554f457603b9.jpg", alt: "College Auditorium" },
    { id: 3, src: "https://www.ctae.ac.in/images/slider/large/img9268009.jpg", alt: "Research Lab" },
    { id: 4, src: "https://sgktc.org/wp-content/uploads/2021/08/library-1200x401.jpg", alt: "Central Library" },
    { id: 5, src: "https://assets.collegedunia.com/public/image/Screenshot_2025_05_22_110754_aa4157ac17965475e75dfd8a66a1b696.png", alt: "Sports Ground" },
    { id: 6, src: "https://image-static.collegedunia.com/public/reviewPhotos/1017586/inbound2190482403805848473.jpg", alt: "Campus Evening View" },
  ];

  return (
    <div className="ctae-page">
      {/* Hero Section - College Photo */}
      <section className="ctae-section">
        <div className="ctae-image">
          <img src="https://www.feeltheudaipur.com/wp-content/uploads/2020/02/ctae-udaipur-udaipurian.jpeg" alt="CTAE College" />
          <div className="ctae-overlay">
            <h1>About CTAE</h1>
            <p>Shaping Futures, Building Leaders</p>
         
          </div>
        </div>
      </section>

      {/* College Details Section */}
      <section className="details-section">
        <div className="container">
          <h2>About Our Institution</h2>
          <div className="details-grid">
            <div className="detail-card">
              <h3>🎓 Academic Excellence</h3>
              <p>CTAE (College of Technology and Engineering) stands as a beacon of academic excellence with world-class infrastructure and highly qualified faculty members dedicated to nurturing talented minds.</p>
            </div>
            <div className="detail-card">
              <h3>🌟 Mission</h3>
              <p>To develop competent engineering professionals who can contribute to society with innovative solutions and ethical practices while maintaining the highest standards of integrity and professionalism.</p>
            </div>
            <div className="detail-card">
              <h3>🎯 Vision</h3>
              <p>To become a premier institution recognized globally for its contributions to engineering education, research, and development, preparing students for leadership roles in their respective fields.</p>
            </div>
            <div className="detail-card">
              <h3>📚 Facilities</h3>
              <p>State-of-the-art laboratories, modern library, sports complex, hostels, computer centers, and recreational facilities providing a comprehensive learning environment for all-round development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dean Section */}
      <section className="dean-section">
        <div className="container">
          <h2>Principal / Dean</h2>
          <div className="dean-card">
            <div className="dean-image">
              <img src="https://www.ctae.ac.in/images/editorFiles/Dean%20sir%20pic.jpg" alt="College Dean" />
            </div>
            <div className="dean-info">
              <h3>Dr. Sunil Joshi</h3>
              <p className="designation">Principal / Dean of Engineering</p>
              <p className="description">
                Dr Sunil Joshi, Professor & Dean  has started professional career of 33 years as a Scientist in Space Application Centre, Indian Space Research Organization (ISRO), Government of India, Ahmedabad. Subsequently, Prof Joshi continued research and academics in governmental technical institutes, Government of Rajasthan holding the positions from Assistant Professor through Professor & Head of the Department.
Presently, he is also holding the post of Director (Planning and Monitoring) of MPUAT. He possesses total experience of 33 years in Research, Teaching and Academic administration including 14 years of functioning as Professor at CTAE, Maharana Pratap University of Agriculture and Technology (MPUAT) Udaipur. For a substantial tenure of about 15 years Prof Joshi accomplished the responsibility as the Head of Department of Electronics & Communication Engineering at CTAE, functioning as the founder leader of its establishment and developing this as a modern technical department equipped with all the state of art technology. Extended his duties as the Chairman of Integrated University Management System (IUMS) for last 4 years, In-charge University Internet for 7 years and the Chairman Digital Technology Cell of University for last 4 years.
Developed and implemented eight extramurally funded Research Projects as the Principal Investigator and Co-Investigator and have made significant contributions for developing novel technologies in the field of wireless communication which have generated international impact. So far, Dr Joshi has supervised and guided 10 Ph.D. and 25 M. Tech thesis and have published 91 research papers, and have filed one technology Patent, authored a book on “Digital Technologies for Agriculture”.
Founded Digital Technology Cell at MPUAT, Udaipur as Chairman of the cell , and played key role in establishing digital technology innovations for agricultural applications including Drone technology, AI based detection of crop diseases, Virtual Reality for agricultural training, IoT based real time Soil Sensing, Humanoid robot etc.
He has earned decorations as the Fellow Member of various professional societies and have been recognized as the Reviewer of various international journals. He has delivered a number of invited talks and presentations at various international and national platforms including EuMC at Munich, Germany, University of Bermingham, U.K., Singapore etc.
              </p>
              <div className="dean-stats">
                <div className="stat">
                  <h4>25+</h4>
                  <p>Years Experience</p>
                </div>
                <div className="stat">
                  <h4>500+</h4>
                  <p>Publications</p>
                </div>
                <div className="stat">
                  <h4>10K+</h4>
                  <p>Students Mentored</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="container">
          <h2>Campus Gallery</h2>
          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <div key={image.id} className="gallery-item" onClick={() => setSelectedImage(image)}>
                <img src={image.src} alt={image.alt} />
                <div className="gallery-overlay">
                  <p>{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for Gallery */}
      {selectedImage && (
        <div className="moda-overlay" onClick={() => setSelectedImage(null)}>
          <div className="moda-content">
            <button className="close-btn" onClick={() => setSelectedImage(null)}>✕</button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <p>{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AboutCtae
