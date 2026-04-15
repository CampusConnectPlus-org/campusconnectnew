import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Footer from '../../components/footer/Footer';
import './Placement.css';

// // Mock Stats Data[cite: 2]
//   const stats = {
//     highestPackage: "48.5 LPA",
//     averagePackage: "9.2 LPA",
//     totalCompanies: "120+",
//     placementRate: "94%",
//     trends: [
//       { year: "2023", avg: 7.5, companies: 95 },
//       { year: "2024", avg: 8.2, companies: 110 },
//       { year: "2025", avg: 9.2, companies: 125 }
//     ]
//   };

//   // Upcoming Drives Data
//   const upcomingDrives = [
//     { id: 101, company: "Microsoft", role: "Software Engineer", branch: "CSE/IT", package: "44 LPA", date: "25 Apr", link: "https://forms.gle/example1" },
//     { id: 102, company: "L&T", role: "Graduate Engineer", branch: "Civil/Mech", package: "6.5 LPA", date: "28 Apr", link: "https://forms.gle/example2" },
//     { id: 103, company: "Adobe", role: "Product Intern", branch: "All", package: "12 LPA", date: "02 May", link: "https://forms.gle/example3" },
//   ];

//   // Current Session Placed Students
//   const placedStudents = [
//     { name: "Sakshi Soni", company: "In Time Tec", package: "5.5 LPA", branch: "CSE" },
//     { name: "Rahul Sharma", company: "TCS", package: "7.0 LPA", branch: "IT" },
//     { name: "Priya Verma", company: "Infosys", package: "9.5 LPA", branch: "ECE" },
//   ];

//   // Mock Application History[cite: 2]
//   const myApplications = [
//     { id: 1, company: "Google", role: "SDE Intern", status: "Shortlisted", date: "12 Mar" },
//     { id: 2, company: "TCS", role: "Ninja Developer", status: "Selected", date: "05 Mar" },
//   ];

//   // Logic: Check if student is already "Selected"
//   const isPlaced = myApplications.some(app => app.status === "Selected");

const Placement = ({ user, setUser }) => {
  const [branchFilter, setBranchFilter] = useState('All');
  const [companySearchFilter, setCompanySearchFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [placedSearchName, setPlacedSearchName] = useState('');
  const [placedSearchCompany, setPlacedSearchCompany] = useState('');
  const [placedFilterBranch, setPlacedFilterBranch] = useState('All');
  const [placedFilterPackage, setPlacedFilterPackage] = useState('');
  const [selectedSection, setSelectedSection] = useState('drives');
  const [stats, setStats] = useState({
    highestPackage: '',
    averagePackage: '',
    totalCompanies: '',
    placementRate: '',
    trends: []
  });
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [placedStudents, setPlacedStudents] = useState([]);

  const API_BASE = 'http://localhost:5000/api/placements';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    Promise.all([
      fetch(`${API_BASE}/drives`, { headers }),
      fetch(`${API_BASE}/stats`, { headers }),
      fetch(`${API_BASE}/trends`, { headers }),
      fetch(`${API_BASE}/placed-students`, { headers })
    ])
      .then(async ([drivesRes, statsRes, trendsRes, placedRes]) => {
        if (drivesRes.ok) {
          setUpcomingDrives(await drivesRes.json());
        }

        const statsJson = statsRes.ok ? await statsRes.json() : {};
        const trendsJson = trendsRes.ok ? await trendsRes.json() : [];

        setStats({
          highestPackage: statsJson.highestPackage || '48.5 LPA',
          averagePackage: statsJson.averagePackage || '9.2 LPA',
          totalCompanies: statsJson.totalCompanies || '120+',
          placementRate: statsJson.placementRate || '94%',
          trends: trendsJson
        });

        if (placedRes.ok) {
          setPlacedStudents(await placedRes.json());
        }
      })
      .catch((err) => {
        console.error('Unable to load placement data:', err);
      });
  }, []);

  // Logic: Check if student is already placed by checking enrollment number in placed students list
  const userEnrollmentNumber = user?.enrollmentNumber || user?.enrollmentNo;
  const isPlaced = userEnrollmentNumber && placedStudents.some(student =>
    student.enrollmentNo === userEnrollmentNumber || student.enrollmentNumber === userEnrollmentNumber
  );

  // Debug logging
  useEffect(() => {
    // console.log('User object:', user);
    // console.log('User Enrollment Number:', userEnrollmentNumber);
    // console.log('Placed Students:', placedStudents);
    // console.log('Is Placed:', isPlaced);
    // if (user && !userEnrollmentNumber) {
    //   console.warn('User object exists but enrollment number is missing');
    // }
  }, [user, placedStudents, isPlaced, userEnrollmentNumber]);

  // Filter & Sort Logic
  const filteredDrives = upcomingDrives
    .filter(drive => {
      const matchesBranch = branchFilter === 'All' || drive.branch.includes(branchFilter) || drive.branch === 'All';
      const matchesCompany = drive.company.toLowerCase().includes(companySearchFilter.toLowerCase());
      const matchesPackage = packageFilter === '' || String(drive.package).includes(packageFilter);
      return matchesBranch && matchesCompany && matchesPackage;
    })
    .sort((a, b) => a.company.localeCompare(b.company));

  const filteredPlacedStudents = placedStudents
    .filter(student => {
      const matchesName = student.name.toLowerCase().includes(placedSearchName.toLowerCase());
      const matchesCompany = student.company.toLowerCase().includes(placedSearchCompany.toLowerCase());
      const matchesBranch = placedFilterBranch === 'All' || student.branch === placedFilterBranch;
      const matchesPackage = placedFilterPackage === '' || String(student.package).includes(placedFilterPackage);
      return matchesName && matchesCompany && matchesBranch && matchesPackage;
    })
    .sort((a, b) => a.company.localeCompare(b.company));

  return (
    <div className="placement-wrapper">
      <div className="placement-hero">
        <motion.div
          className="placement-hero-content"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Placement Portal</h1>
          <p>Current Session: 2025-26 | Placement Drives Portal</p>
        </motion.div>
      </div>

      <div className="placement-switcher">
        <button
          className={`placement-tab ${selectedSection === 'drives' ? 'active' : ''}`}
          onClick={() => setSelectedSection('drives')}
        >
          Upcoming Drives
        </button>
        <button
          className={`placement-tab ${selectedSection === 'placed' ? 'active' : ''}`}
          onClick={() => setSelectedSection('placed')}
        >
          Students Placed
        </button>
        <button
          className={`placement-tab ${selectedSection === 'trends' ? 'active' : ''}`}
          onClick={() => setSelectedSection('trends')}
        >
          Yearly Trends
        </button>
      </div>

      <div className="placement-content">

        {/* UPCOMING DRIVES SECTION */}
        {selectedSection === 'drives' && (
          <section className="drives-section-full">
            <div className="section-header">
              <h2>Upcoming Campus Drives</h2>
            </div>
            {isPlaced && (
              <div className="status-alert">
                🎉 Congratulations! You are already placed. New applications are disabled for you.
              </div>
            )}
            <div className="placement-filters-container">
              <input
                type="text"
                placeholder="Search by company name..."
                value={companySearchFilter}
                onChange={(e) => setCompanySearchFilter(e.target.value)}
                className="placement-filter-input"
              />
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="placement-filter-select"
              >
                <option value="All">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="Civil">Civil</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Mining">Mining</option>
                <option value="AI&DS">AI&DS</option>
                <option value="Agriculture">Agriculture</option>
              </select>
              <input
                type="text"
                placeholder="Filter by package (e.g., 12 LPA)..."
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                className="placement-filter-input"
              />
            </div>

            {filteredDrives.length > 0 ? (
              <div className="drives-grid">
                {filteredDrives.map(drive => (
                  <div className="drive-card" key={drive.id}>
                    <div className="drive-info">
                      <h4>{drive.company}</h4>
                      <p className="role">{drive.role}</p>
                      <div className="drive-meta">
                        <span><strong>Branch:</strong> {drive.branch}</span>
                        <span><strong>CTC:</strong> {drive.package} LPA</span>
                        <span><strong>Date:</strong> {drive.date}</span>
                      </div>
                    </div>
                    {isPlaced ? (
                      <button className="apply-btn disabled" disabled>Already Placed</button>
                    ) : (
                      <a href={drive.link} target="_blank" rel="noreferrer" className="apply-btn">Apply Now</a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-message">No upcoming drives available at this moment. Please check back later.</div>
            )}
          </section>
        )}

        {/* CURRENTLY PLACED STUDENTS[cite: 1] */}
        {selectedSection === 'placed' && (
          <section className="placed-students-section-full">
            <div className="section-header">
              <h2>Students Placed (Current Session)</h2>
            </div>
            <div className="placement-filters-container">
              <input
                type="text"
                placeholder="Search by student name..."
                value={placedSearchName}
                onChange={(e) => setPlacedSearchName(e.target.value)}
                className="placement-filter-input"
              />
              <input
                type="text"
                placeholder="Search by company name..."
                value={placedSearchCompany}
                onChange={(e) => setPlacedSearchCompany(e.target.value)}
                className="placement-filter-input"
              />
              <select
                value={placedFilterBranch}
                onChange={(e) => setPlacedFilterBranch(e.target.value)}
                className="placement-filter-select"
              >
                <option value="All">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="Civil">Civil</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Mining">Mining</option>
                <option value="AI&DS">AI&DS</option>
                <option value="Agriculture">Agriculture</option>
              </select>
              <input
                type="text"
                placeholder="Filter by package (e.g., 12 LPA)..."
                value={placedFilterPackage}
                onChange={(e) => setPlacedFilterPackage(e.target.value)}
                className="placement-filter-input"
              />
            </div>
            {filteredPlacedStudents.length > 0 ? (
              <div className="placed-table-wrapper">
                <table className="placed-table">
                  <thead>
                    <tr>
                      <th>Enrollment No</th>
                      <th>Student Name</th>
                      <th>Branch</th>
                      <th>Company</th>
                      <th>Package</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlacedStudents.map((student, index) => (
                      <tr key={index}>
                        <td>{student.enrollmentNo}</td>
                        <td>{student.name}</td>
                        <td>{student.branch}</td>
                        <td><strong>{student.company}</strong></td>
                        <td>{student.package} LPA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-message">No students found matching the filters.</div>
            )}
          </section>
        )}

        {/* TRENDS & STATS SECTION */}
        {selectedSection === 'trends' && (
          <section className="stats-section-full">
            <div className="section-header">
              <h2>Yearly Placement Trends</h2>
            </div>

            {stats.trends.length > 0 ? (
              <>
                {/* Displaying Stats Per Year based on trends data */}
                <div className="stats-grid">
                  {stats.trends.map((t) => (
                    <div key={t.year} className={`stat-card ${t.year === "2025" ? "highlight" : ""}`}>
                      <span className="year-badge">{t.year}</span>
                      <h3>{t.avg} LPA</h3>
                      <p>Avg. Package</p>
                      <div className="mini-meta">
                        <span>{t.companies} Companies</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="trend-container">
                  <h4>Average Salary Growth Visualization</h4>
                  <div className="chart-container">
                    <div className="y-axis">
                      <span>10</span>
                      <span>5</span>
                      <span>0</span>
                    </div>
                    <div className="trend-chart-mock">
                      {stats.trends.map(t => (
                        <div key={t.year} className="trend-bar-wrapper">
                          <div className="bar-value">{t.avg}</div>
                          {/* Fixed height logic: using a calc or multiplier to ensure visibility */}
                          <div
                            className="bar"
                            style={{ height: `${(t.avg * 15)}px` }}
                          ></div>
                          <span className="bar-label">{t.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-message">
                No placement trend data available at this moment. Please check back later.
              </div>
            )}
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Placement;