import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagePlacements.css';



const ManagePlacements = () => {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('drives');
    const [drives, setDrives] = useState([]);
    const [trends, setTrends] = useState([]);
    const [applications, setApplications] = useState([]);
    const [placedStudents, setPlacedStudents] = useState([]);

    // Filter states for Drives
    const [driveSearchName, setDriveSearchName] = useState('');
    const [driveFilterBranch, setDriveFilterBranch] = useState('All');
    const [driveFilterPackage, setDriveFilterPackage] = useState('');

    // Filter states for Placed Students
    const [placedSearchName, setPlacedSearchName] = useState('');
    const [placedSearchCompany, setPlacedSearchCompany] = useState('');
    const [placedFilterBranch, setPlacedFilterBranch] = useState('All');
    const [placedFilterPackage, setPlacedFilterPackage] = useState('');

    // Modal states
    const [showAddDriveModal, setShowAddDriveModal] = useState(false);
    const [showAddPlacedModal, setShowAddPlacedModal] = useState(false);
    const [showAddTrendModal, setShowAddTrendModal] = useState(false);
    const [showBranchDropdown, setShowBranchDropdown] = useState(false);

    // Form states
    const [driveForm, setDriveForm] = useState({
        company: '',
        role: '',
        branch: 'All',
        package: '',
        date: '',
        link: ''
    });

    const [placedForm, setPlacedForm] = useState({
        enrollmentNo: '',
        name: '',
        branch: 'CSE',
        company: '',
        package: ''
    });

    const [trendForm, setTrendForm] = useState({
        year: new Date().getFullYear(),
        avg: '',
        companies: ''
    });

    const API_BASE = 'http://localhost:5000/api/placements';

    useEffect(() => {
        fetchPlacementData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.querySelector('.branch-dropdown-wrapper');
            if (dropdown && !dropdown.contains(event.target)) {
                setShowBranchDropdown(false);
            }
        };

        if (showBranchDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showBranchDropdown]);

    const fetchPlacementData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            const [drivesRes, trendsRes, appsRes, placedRes] = await Promise.all([
                axios.get(`${API_BASE}/drives`, { headers }),
                axios.get(`${API_BASE}/trends`, { headers }),
                axios.get(`${API_BASE}/applications`, { headers }),
                axios.get(`${API_BASE}/placed-students`, { headers }),
            ]);

            setDrives(drivesRes.data || []);
            setTrends(trendsRes.data || []);
            setApplications(appsRes.data || []);
            setPlacedStudents(placedRes.data || []);
        } catch (err) {
            console.error('Error fetching placement data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDrive = async (id) => {
        if (window.confirm('Are you sure you want to delete this drive?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE}/drives/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDrives(drives.filter(drive => drive._id !== id));
                alert('Drive deleted successfully');
            } catch (err) {
                console.error('Error deleting drive:', err);
                alert('Failed to delete drive');
            }
        }
    };

    const handleAddDrive = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE}/drives`, driveForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDrives([...drives, response.data]);
            closeDriveModal();
            alert('Drive added successfully');
        } catch (err) {
            console.error('Error adding drive:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to add drive';
            alert(`Failed to add drive: ${errorMessage}`);
        }
    };

    const closeDriveModal = () => {
        setShowAddDriveModal(false);
        setShowBranchDropdown(false);
        setDriveForm({
            company: '',
            role: '',
            branch: 'All',
            package: '',
            date: '',
            link: ''
        });
    };

    const handleBranchChange = (branchName) => {
        if (branchName === 'All') {
            // Toggle All on/off
            setDriveForm({ ...driveForm, branch: driveForm.branch === 'All' ? '' : 'All' });
        } else {
            // For specific branches
            if (driveForm.branch === 'All') {
                // If "All" is selected, convert to individual branches excluding this one
                const allBranches = ['CSE', 'ECE', 'EEE', 'Civil'];
                const result = allBranches.filter(b => b !== branchName).join(',');
                setDriveForm({ ...driveForm, branch: result });
            } else {
                // Manage as CSV string
                const branchArray = driveForm.branch.split(',').map(b => b.trim()).filter(b => b);
                const index = branchArray.indexOf(branchName);

                if (index > -1) {
                    // Remove the branch
                    branchArray.splice(index, 1);
                } else {
                    // Add the branch
                    branchArray.push(branchName);
                }

                // Check if all 4 branches are selected, convert to "All"
                const allBranches = ['CSE', 'ECE', 'EEE', 'Civil'];
                if (branchArray.length === 4 && allBranches.every(b => branchArray.includes(b))) {
                    setDriveForm({ ...driveForm, branch: 'All' });
                } else {
                    setDriveForm({ ...driveForm, branch: branchArray.join(',') });
                }
            }
        }
    };

    const isBranchSelected = (branchName) => {
        if (driveForm.branch === 'All') return true;
        return driveForm.branch.split(',').map(b => b.trim()).includes(branchName);
    };

    const handleAddPlaced = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE}/placed-students`, placedForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPlacedStudents([...placedStudents, response.data]);
            closePlacedModal();
            alert('Placed student added successfully');
        } catch (err) {
            console.error('Error adding placed student:', err);
            let errorMessage = 'Failed to add placed student';

            if (err.response?.status === 404) {
                errorMessage = err.response?.data?.message || 'Student not found. Please verify the enrollment number.';
            } else if (err.response?.status === 409) {
                errorMessage = err.response?.data?.message || 'This student is already in the placed students list.';
            } else if (err.response?.status === 400) {
                errorMessage = err.response?.data?.message || 'Please fill in all required fields.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            alert(errorMessage);
        }
    };

    const closePlacedModal = () => {
        setShowAddPlacedModal(false);
        setPlacedForm({
            enrollmentNo: '',
            name: '',
            branch: 'CSE',
            company: '',
            package: ''
        });
    };

    const handleAddTrend = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_BASE}/trends`, trendForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTrends([...trends, response.data]);
            closeTrendModal();
            alert('Trend added successfully');
        } catch (err) {
            console.error('Error adding trend:', err);
            alert('Failed to add trend');
        }
    };

    const closeTrendModal = () => {
        setShowAddTrendModal(false);
        setTrendForm({
            year: new Date().getFullYear(),
            avg: '',
            companies: ''
        });
    };

    const handleDeletePlaced = async (id) => {
        if (window.confirm('Are you sure you want to delete this placed student record?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE}/placed-students/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPlacedStudents(placedStudents.filter(student => student._id !== id));
                alert('Placed student deleted successfully');
            } catch (err) {
                console.error('Error deleting placed student:', err);
                alert('Failed to delete placed student');
            }
        }
    };

    const handleDeleteTrend = async (id) => {
        if (window.confirm('Are you sure you want to delete this trend?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE}/trends/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTrends(trends.filter(trend => trend._id !== id));
                alert('Trend deleted successfully');
            } catch (err) {
                console.error('Error deleting trend:', err);
                alert('Failed to delete trend');
            }
        }
    };

    if (loading) {
        return <div className="manage-placements"><p>Loading placement data...</p></div>;
    }

    // Filter logic for Drives
    const filteredDrives = drives.filter(drive => {
        const matchesName = drive.company.toLowerCase().includes(driveSearchName.toLowerCase());
        const matchesBranch = driveFilterBranch === 'All' || drive.branch === 'All' || drive.branch.includes(driveFilterBranch);
        const matchesPackage = driveFilterPackage === '' || String(drive.package).includes(driveFilterPackage);
        return matchesName && matchesBranch && matchesPackage;
    });

    // Filter logic for Placed Students
    const filteredPlacedStudents = placedStudents.filter(student => {
        const matchesName = student.name.toLowerCase().includes(placedSearchName.toLowerCase());
        const matchesCompany = student.company.toLowerCase().includes(placedSearchCompany.toLowerCase());
        const matchesBranch = placedFilterBranch === 'All' || student.branch === placedFilterBranch;
        const matchesPackage = placedFilterPackage === '' || String(student.package).includes(placedFilterPackage);
        return matchesName && matchesCompany && matchesBranch && matchesPackage;
    });

    return (
        <div className="manage-placements">
            <div className="placements-header">
                <h1>📊 Placements Management</h1>
                <p>Manage placement drives, trends, and student records</p>
            </div>

            {/* Tab Navigation */}
            <div className="placements-tabs">
                <button
                    className={`tab-btn ${activeTab === 'drives' ? 'active' : ''}`}
                    onClick={() => setActiveTab('drives')}
                >
                    Campus Drives ({drives.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('applications')}
                >
                    Applications ({applications.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'placed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('placed')}
                >
                    Placed Students ({placedStudents.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
                    onClick={() => setActiveTab('trends')}
                >
                    Trends ({trends.length})
                </button>
            </div>

            {/* Campus Drives Section */}
            {activeTab === 'drives' && (
                <section className="placements-section">
                    <div className="section-header">
                        <h2>Campus Drives</h2>
                        <button className="add-btn" onClick={() => setShowAddDriveModal(true)}>
                            + Add Drive
                        </button>
                    </div>
                    <div className="admin-filters-container">
                        <input
                            type="text"
                            placeholder="Search by company name..."
                            value={driveSearchName}
                            onChange={(e) => setDriveSearchName(e.target.value)}
                            className="admin-filter-input"
                        />
                        <select
                            value={driveFilterBranch}
                            onChange={(e) => setDriveFilterBranch(e.target.value)}
                            className="admin-filter-select"
                        >
                            <option value="All">All Branches</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="Civil">Civil</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Filter by package (e.g., 12 LPA)..."
                            value={driveFilterPackage}
                            onChange={(e) => setDriveFilterPackage(e.target.value)}
                            className="admin-filter-input"
                        />
                    </div>
                    {filteredDrives.length > 0 ? (
                        <table className="placements-table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Role</th>
                                    <th>Branch</th>
                                    <th>CTC</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDrives.map((drive) => (
                                    <tr key={drive._id}>
                                        <td>{drive.company}</td>
                                        <td>{drive.role}</td>
                                        <td>{drive.branch}</td>
                                        <td>{drive.package} LPA</td>
                                        <td>{drive.date}</td>
                                        <td>
                                            <button className="action-btn edit">Edit</button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDeleteDrive(drive._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="empty-message">No campus drives found</p>
                    )}
                </section>
            )}

            {/* Applications Section */}
            {activeTab === 'applications' && (
                <section className="placements-section">
                    <h2>Student Applications</h2>
                    {applications.length > 0 ? (
                        <table className="placements-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Company</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app._id}>
                                        <td>{app.studentName || 'N/A'}</td>
                                        <td>{app.company}</td>
                                        <td>{app.role}</td>
                                        <td>
                                            <span className={`status-badge status-${app.status?.toLowerCase()}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>{app.date}</td>
                                        <td>
                                            <button className="action-btn edit">Edit</button>
                                            <button className="action-btn delete">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="empty-message">No applications found</p>
                    )}
                </section>
            )}

            {/* Placed Students Section */}
            {activeTab === 'placed' && (
                <section className="placements-section">
                    <div className="section-header">
                        <h2>Placed Students (Current Session)</h2>
                        <button className="add-btn" onClick={() => setShowAddPlacedModal(true)}>
                            + Add Student
                        </button>
                    </div>
                    <div className="admin-filters-container">
                        <input
                            type="text"
                            placeholder="Search by student name..."
                            value={placedSearchName}
                            onChange={(e) => setPlacedSearchName(e.target.value)}
                            className="admin-filter-input"
                        />
                        <input
                            type="text"
                            placeholder="Search by company name..."
                            value={placedSearchCompany}
                            onChange={(e) => setPlacedSearchCompany(e.target.value)}
                            className="admin-filter-input"
                        />
                        <select
                            value={placedFilterBranch}
                            onChange={(e) => setPlacedFilterBranch(e.target.value)}
                            className="admin-filter-select"
                        >
                            <option value="All">All Branches</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="Civil">Civil</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Filter by package (e.g., 12 LPA)..."
                            value={placedFilterPackage}
                            onChange={(e) => setPlacedFilterPackage(e.target.value)}
                            className="admin-filter-input"
                        />
                    </div>
                    {filteredPlacedStudents.length > 0 ? (
                        <table className="placements-table">
                            <thead>
                                <tr>
                                    <th>Enrollment No</th>
                                    <th>Student Name</th>
                                    <th>Branch</th>
                                    <th>Company</th>
                                    <th>Package</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlacedStudents.map((student) => (
                                    <tr key={student._id}>
                                        <td>{student.enrollmentNo}</td>
                                        <td>{student.name}</td>
                                        <td>{student.branch}</td>
                                        <td>{student.company}</td>
                                        <td>{student.package} LPA</td>
                                        <td>
                                            <button className="action-btn edit">Edit</button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDeletePlaced(student._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="empty-message">No placed students found</p>
                    )}
                </section>
            )}

            {/* Trends Section */}
            {activeTab === 'trends' && (
                <section className="placements-section">
                    <div className="section-header">
                        <h2>Yearly Placement Trends</h2>
                        <button className="add-btn" onClick={() => setShowAddTrendModal(true)}>
                            + Add Trend
                        </button>
                    </div>
                    {trends.length > 0 ? (
                        <table className="placements-table">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>Average Package (LPA)</th>
                                    <th>Companies</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trends.map((trend) => (
                                    <tr key={trend._id}>
                                        <td>{trend.year}</td>
                                        <td>{trend.avg}</td>
                                        <td>{trend.companies}</td>
                                        <td>
                                            <button className="action-btn edit">Edit</button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDeleteTrend(trend._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="empty-message">No trends found</p>
                    )}
                </section>
            )}

            {/* Add Drive Modal */}
            {showAddDriveModal && (
                <div className="modal-overlay" onClick={closeDriveModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Campus Drive</h3>
                            <button
                                className="close-btn"
                                onClick={closeDriveModal}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddDrive}>
                            <div className="form-group-placement">
                                <label>Company Name *
                                    <input
                                        id="drive-company"
                                        type="text"
                                        value={driveForm.company}
                                        onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })}
                                        required
                                        placeholder="e.g., Google, Microsoft"
                                    /></label>
                            </div>
                            <div className="form-group-placement">
                                <label>Role *
                                    <input
                                        id="drive-role"
                                        type="text"
                                        value={driveForm.role}
                                        onChange={(e) => setDriveForm({ ...driveForm, role: e.target.value })}
                                        required
                                        placeholder="e.g., Software Engineer"
                                    /></label>
                            </div>
                            <div className="form-row">
                                <div className="form-group-placement">
                                    <label>Branch
                                        <div className="branch-dropdown-wrapper">
                                            <button
                                                type="button"
                                                className="branch-dropdown-btn"
                                                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                                            >
                                                {driveForm.branch === '' ? 'Select Branches' : driveForm.branch}
                                                <span className="dropdown-arrow">▼</span>
                                            </button>
                                            {showBranchDropdown && (
                                                <div className="branch-dropdown-menu">
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={driveForm.branch === 'All'}
                                                            onChange={() => handleBranchChange('All')}
                                                        />
                                                        All Branches
                                                    </label>
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('CSE')}
                                                            onChange={() => handleBranchChange('CSE')}
                                                        />
                                                        CSE
                                                    </label>
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('ECE')}
                                                            onChange={() => handleBranchChange('ECE')}
                                                        />
                                                        ECE
                                                    </label>
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('EEE')}
                                                            onChange={() => handleBranchChange('EEE')}
                                                        />
                                                        EEE
                                                    </label>
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('Civil')}
                                                            onChange={() => handleBranchChange('Civil')}
                                                        />
                                                        Civil
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                                <div className="form-group-placement">
                                    <label>CTC/Package *
                                        <input
                                            id="drive-package"
                                            type="number"
                                            step="0.1"
                                            value={driveForm.package}
                                            onChange={(e) => setDriveForm({ ...driveForm, package: e.target.value })}
                                            required
                                            placeholder="e.g., 12"
                                        /></label>
                                </div>
                            </div>
                            <div className="form-group-placement">
                                <label>Date *
                                    <input
                                        id="drive-date"
                                        type="date"
                                        value={driveForm.date}
                                        onChange={(e) => setDriveForm({ ...driveForm, date: e.target.value })}
                                        required
                                    /></label>
                            </div>
                            <div className="form-group-placement">
                                <label>Application Link
                                    <input
                                        id="drive-link"
                                        type="url"
                                        value={driveForm.link}
                                        onChange={(e) => setDriveForm({ ...driveForm, link: e.target.value })}
                                        placeholder="https://example.com/apply"
                                    /></label>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={closeDriveModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Add Drive
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Placed Student Modal */}
            {showAddPlacedModal && (
                <div className="modal-overlay" onClick={closePlacedModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add Placed Student</h3>
                            <button
                                className="close-btn"
                                onClick={closePlacedModal}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddPlaced}>
                            <div className="form-group-placement">
                                <label>Enrollment Number *
                                    <input
                                        id="placed-enrollment"
                                        type="text"
                                        value={placedForm.enrollmentNo}
                                        onChange={(e) => setPlacedForm({ ...placedForm, enrollmentNo: e.target.value })}
                                        required
                                        placeholder="e.g., 23BCE001"
                                    /></label>
                            </div>
                            <div className="form-group-placement">
                                <label>Student Name *
                                    <input
                                        id="placed-name"
                                        type="text"
                                        value={placedForm.name}
                                        onChange={(e) => setPlacedForm({ ...placedForm, name: e.target.value })}
                                        required
                                        placeholder="e.g., John Doe"
                                    /></label>
                            </div>
                            <div className="form-row">
                                <div className="form-group-placement">
                                    <label>Branch
                                        <select
                                            id="placed-branch"
                                            value={placedForm.branch}
                                            onChange={(e) => setPlacedForm({ ...placedForm, branch: e.target.value })}
                                        >
                                            <option>CSE</option>
                                            <option>ECE</option>
                                            <option>EEE</option>
                                            <option>Civil</option>
                                        </select></label>
                                </div>
                                <div className="form-group-placement">
                                    <label>Company *
                                        <input
                                            id="placed-company"
                                            type="text"
                                            value={placedForm.company}
                                            onChange={(e) => setPlacedForm({ ...placedForm, company: e.target.value })}
                                            required
                                            placeholder="e.g., Google"
                                        /></label>
                                </div>
                            </div>
                            <div className="form-group-placement">
                                <label>Package (LPA) *
                                    <input
                                        id="placed-package"
                                        type="number"
                                        step="0.1"
                                        value={placedForm.package}
                                        onChange={(e) => setPlacedForm({ ...placedForm, package: e.target.value })}
                                        required
                                        placeholder="e.g., 12"
                                    /></label>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={closePlacedModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Trend Modal */}
            {showAddTrendModal && (
                <div className="modal-overlay" onClick={closeTrendModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add Placement Trend</h3>
                            <button
                                className="close-btn"
                                onClick={closeTrendModal}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddTrend}>
                            <div className="form-group-placement">
                                <label>Year *
                                    <input
                                        id="trend-year"
                                        type="number"
                                        value={trendForm.year}
                                        onChange={(e) => setTrendForm({ ...trendForm, year: parseInt(e.target.value) })}
                                        required
                                    /></label>
                            </div>
                            <div className="form-row">
                                <div className="form-group-placement">
                                    <label>Average Package (LPA) *
                                        <input
                                            id="trend-avg"
                                            type="number"
                                            step="0.1"
                                            value={trendForm.avg}
                                            onChange={(e) => setTrendForm({ ...trendForm, avg: e.target.value })}
                                            required
                                            placeholder="e.g., 12.5"
                                        /></label>
                                </div>
                                <div className="form-group-placement">
                                    <label>Companies Count *
                                        <input
                                            id="trend-companies"
                                            type="number"
                                            value={trendForm.companies}
                                            onChange={(e) => setTrendForm({ ...trendForm, companies: e.target.value })}
                                            required
                                            placeholder="e.g., 45"
                                        /></label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={closeTrendModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Add Trend
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePlacements;
