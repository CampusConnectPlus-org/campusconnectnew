import React, { useEffect, useState } from 'react';
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
  const [stats, setStats] = useState({
    highestPackage: '',
    averagePackage: '',
    totalCompanies: '',
    placementRate: '',
    trends: []
  });
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [placedStudents, setPlacedStudents] = useState([]);
  const [myApplications, setMyApplications] = useState([]);

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
      fetch(`${API_BASE}/applications`, { headers }),
      fetch(`${API_BASE}/stats`, { headers }),
      fetch(`${API_BASE}/trends`, { headers }),
      fetch(`${API_BASE}/placed-students`, { headers })
    ])
      .then(async ([drivesRes, appsRes, statsRes, trendsRes, placedRes]) => {
        if (drivesRes.ok) {
          setUpcomingDrives(await drivesRes.json());
        }

        if (appsRes.ok) {
          setMyApplications(await appsRes.json());
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

  // Logic: Check if student is already "Selected"
  const isPlaced = myApplications.some(app => app.status === 'Selected');

  // Filter Logic
  const filteredDrives = upcomingDrives.filter(drive =>
    branchFilter === 'All' || drive.branch.includes(branchFilter) || drive.branch === 'All'
  );

  return (
    <div className="placement-wrapper">
      <div className="placement-hero">
        <h1>Placement & Career Hub</h1>
        <p>Current Session: 2025-26 | Drive Management Portal</p>
      </div>

      <div className="placement-content">

        {/* UPCOMING DRIVES SECTION */}
        <section className="drives-section">
          <div className="section-header">
            <h2>Upcoming Campus Drives</h2>
            <div className="filter-group">
              <label>Filter by Branch:</label>
              <select className="branch-select" onChange={(e) => setBranchFilter(e.target.value)}>
                <option value="All">All Branches</option>
                <option value="CSE">CSE/IT</option>
                <option value="Mech">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
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
                      <span><strong>CTC:</strong> {drive.package}</span>
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
            <div className="empty-message">No upcoming drives found for the selected branch.</div>
          )}
        </section>

        {/* APPLICATION HISTORY[cite: 1, 2] */}
        <section className="applications-section">
          <div className="section-header">
            <h2>Your Application Status</h2>
          </div>
          {isPlaced && (
            <div className="status-alert">
              🎉 Congratulations! You are placed. Registration for new drives is now closed for you.
            </div>
          )}
          <div className="app-list">
            {myApplications.map(app => (
              <div className={`app-item ${app.status.toLowerCase()}`} key={app.id}>
                <div className="app-main-info">
                  <div>
                    <h4>{app.company}</h4>
                    <p>{app.role}</p>
                  </div>
                  <span className={`status-badge ${app.status.toLowerCase()}`}>{app.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CURRENTLY PLACED STUDENTS[cite: 1] */}
        <section className="placed-students-section">
          <div className="section-header">
            <h2>Students Placed (Current Session)</h2>
          </div>
          <div className="placed-table-wrapper">
            <table className="placed-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Branch</th>
                  <th>Company</th>
                  <th>Package</th>
                </tr>
              </thead>
              <tbody>
                {placedStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.branch}</td>
                    <td><strong>{student.company}</strong></td>
                    <td>{student.package}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* TRENDS & STATS SECTION */}
        <section className="stats-section">
          <div className="section-header">
            <h2>Yearly Placement Trends</h2>
          </div>

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
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Placement;