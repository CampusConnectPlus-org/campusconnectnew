import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagePlacements.css';



const ManagePlacements = () => {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('drives');
    const [drives, setDrives] = useState([]);
    const [trends, setTrends] = useState([]);
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
    const [showEditDriveModal, setShowEditDriveModal] = useState(false);
    const [showAddPlacedModal, setShowAddPlacedModal] = useState(false);
    const [showEditPlacedModal, setShowEditPlacedModal] = useState(false);
    const [showAddTrendModal, setShowAddTrendModal] = useState(false);
    const [showEditTrendModal, setShowEditTrendModal] = useState(false);
    const [showBranchDropdown, setShowBranchDropdown] = useState(false);
    const [editingDriveId, setEditingDriveId] = useState(null);
    const [editingPlacedId, setEditingPlacedId] = useState(null);
    const [editingTrendId, setEditingTrendId] = useState(null);

    // Form states
    const [driveForm, setDriveForm] = useState({
        company: '',
        role: '',
        branch: 'All',
        package: '',
        openingDate: '',
        closingDate: '',
        date: '',
        venue: '',
        reportingTime: '',
        additionalInstructions: '',
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
        studentsPlaced: ''
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

            const [drivesRes, trendsRes, placedRes] = await Promise.all([
                axios.get(`${API_BASE}/drives`, { headers }),
                axios.get(`${API_BASE}/trends`, { headers }),
                axios.get(`${API_BASE}/placed-students`, { headers }),
            ]);

            setDrives(drivesRes.data || []);
            setTrends(trendsRes.data || []);
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

        // Validate dates
        if (driveForm.openingDate && driveForm.closingDate) {
            const openingDate = new Date(driveForm.openingDate);
            const closingDate = new Date(driveForm.closingDate);
            if (openingDate > closingDate) {
                alert('Opening date cannot be later than closing date');
                return;
            }
        }

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
            openingDate: '',
            closingDate: '',
            date: '',
            venue: '',
            reportingTime: '',
            additionalInstructions: '',
            link: ''
        });
    };

    const formatISODate = (dateValue) => {
        if (!dateValue) return '';
        const parsed = new Date(dateValue);
        return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
    };

    const formatTimeLabel = (timeString) => {
        if (!timeString) return null;
        try {
            // Parse time string (HH:MM format)
            const [hours, minutes] = timeString.split(':').map(Number);
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
            return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
        } catch (error) {
            return timeString; // Return original if parsing fails
        }
    };

    const handleOpenEditDrive = (drive) => {
        setEditingDriveId(drive._id);
        setDriveForm({
            company: drive.company,
            role: drive.role,
            branch: drive.branch,
            package: drive.package,
            openingDate: formatISODate(drive.openingDate),
            closingDate: formatISODate(drive.closingDate),
            date: formatISODate(drive.date),
            venue: drive.venue || '',
            reportingTime: drive.reportingTime || '',
            additionalInstructions: drive.additionalInstructions || '',
            link: drive.link || ''
        });
        setShowEditDriveModal(true);
    };

    const handleUpdateDrive = async (e) => {
        e.preventDefault();

        // Validate dates
        if (driveForm.openingDate && driveForm.closingDate) {
            const openingDate = new Date(driveForm.openingDate);
            const closingDate = new Date(driveForm.closingDate);
            if (openingDate > closingDate) {
                alert('Opening date cannot be later than closing date');
                return;
            }
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE}/drives/${editingDriveId}`, driveForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDrives(drives.map(drive => drive._id === editingDriveId ? response.data : drive));
            closeEditDriveModal();
            alert('Drive updated successfully');
        } catch (err) {
            console.error('Error updating drive:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to update drive';
            alert(`Failed to update drive: ${errorMessage}`);
        }
    };

    const closeEditDriveModal = () => {
        setShowEditDriveModal(false);
        setShowBranchDropdown(false);
        setEditingDriveId(null);
        setDriveForm({
            company: '',
            role: '',
            branch: 'All',
            package: '',
            openingDate: '',
            closingDate: '',
            date: '',
            venue: '',
            reportingTime: '',
            additionalInstructions: '',
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
                const allBranches = ['CSE', 'ECE', 'EEE', 'Civil', 'Mechanical', 'Mining', 'AI&DS', 'Agriculture'];
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

                // Check if all branches are selected, convert to "All"
                const allBranches = ['CSE', 'ECE', 'EEE', 'Civil', 'Mechanical', 'Mining', 'AI&DS', 'Agriculture'];
                if (branchArray.length === 8 && allBranches.every(b => branchArray.includes(b))) {
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
            console.log('Submitting placed student form:', placedForm);
            const response = await axios.post(`${API_BASE}/placed-students`, placedForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPlacedStudents([...placedStudents, response.data]);
            closePlacedModal();
            alert('Placed student added successfully');
        } catch (err) {
            console.error('Error adding placed student:', err);
            console.error('Error details:', {
                status: err.response?.status,
                message: err.response?.data?.message,
                error: err.response?.data?.error,
                fullError: err.response?.data
            });
            let errorMessage = 'Failed to add placed student';

            if (err.response?.status === 404) {
                errorMessage = err.response?.data?.message || 'Student not found. Please verify the enrollment number.';
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

    const handleOpenEditPlaced = (student) => {
        setEditingPlacedId(student._id);
        setPlacedForm({
            enrollmentNo: student.enrollmentNo,
            name: student.name,
            branch: student.branch,
            company: student.company,
            package: student.package
        });
        setShowEditPlacedModal(true);
    };

    const handleUpdatePlaced = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE}/placed-students/${editingPlacedId}`, placedForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPlacedStudents(placedStudents.map(student => student._id === editingPlacedId ? response.data : student));
            closeEditPlacedModal();
            alert('Placed student updated successfully');
        } catch (err) {
            console.error('Error updating placed student:', err);
            const errorMessage = err.response?.data?.message || 'Failed to update placed student';
            alert(`Failed to update placed student: ${errorMessage}`);
        }
    };

    const closeEditPlacedModal = () => {
        setShowEditPlacedModal(false);
        setEditingPlacedId(null);
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
            studentsPlaced: ''
        });
    };

    const handleOpenEditTrend = (trend) => {
        setEditingTrendId(trend._id);
        setTrendForm({
            year: trend.year,
            avg: trend.avg,
            studentsPlaced: trend.studentsPlaced
        });
        setShowEditTrendModal(true);
    };

    const handleUpdateTrend = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_BASE}/trends/${editingTrendId}`, trendForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTrends(trends.map(trend => trend._id === editingTrendId ? response.data : trend));
            closeEditTrendModal();
            alert('Trend updated successfully');
        } catch (err) {
            console.error('Error updating trend:', err);
            const errorMessage = err.response?.data?.message || 'Failed to update trend';
            alert(`Failed to update trend: ${errorMessage}`);
        }
    };

    const closeEditTrendModal = () => {
        setShowEditTrendModal(false);
        setEditingTrendId(null);
        setTrendForm({
            year: new Date().getFullYear(),
            avg: '',
            studentsPlaced: ''
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

    const compareEnrollmentNo = (a, b) => {
        const normalize = (value) => value ? value.split('/').map(part => part.trim()) : [];
        const [yearA = '', deptA = '', seqA = ''] = normalize(a.enrollmentNo || a.enrollmentNumber || '');
        const [yearB = '', deptB = '', seqB = ''] = normalize(b.enrollmentNo || b.enrollmentNumber || '');

        const yearCompare = yearA.localeCompare(yearB, undefined, { numeric: true });
        if (yearCompare !== 0) return yearCompare;

        const deptCompare = deptA.localeCompare(deptB);
        if (deptCompare !== 0) return deptCompare;

        const numA = Number(seqA);
        const numB = Number(seqB);
        if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
            return numA - numB;
        }

        return seqA.localeCompare(seqB);
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
    const filteredPlacedStudents = placedStudents
        .filter(student => {
            const matchesName = student.name.toLowerCase().includes(placedSearchName.toLowerCase());
            const matchesCompany = student.company.toLowerCase().includes(placedSearchCompany.toLowerCase());
            const matchesBranch = placedFilterBranch === 'All' || student.branch === placedFilterBranch;
            const matchesPackage = placedFilterPackage === '' || String(student.package).includes(placedFilterPackage);
            return matchesName && matchesCompany && matchesBranch && matchesPackage;
        })
        .sort(compareEnrollmentNo);

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
                            <option value="Mechanical">Mechanical</option>
                            <option value="Mining">Mining</option>
                            <option value="AI&DS">AI&DS</option>
                            <option value="Agriculture">Agriculture</option>
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
                                    <th>Form Open</th>
                                    <th>Form Close</th>
                                    <th>Drive Date</th>
                                    <th>Venue</th>
                                    <th>Reporting</th>
                                    <th>Information</th>
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
                                        <td>{formatISODate(drive.openingDate) || '-'}</td>
                                        <td>{formatISODate(drive.closingDate) || '-'}</td>
                                        <td>{formatISODate(drive.date) || '-'}</td>
                                        <td>{drive.venue || '-'}</td>
                                        <td>{formatTimeLabel(drive.reportingTime) || '-'}</td>
                                        <td style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                                            {drive.additionalInstructions || '-'}
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn edit"
                                                onClick={() => handleOpenEditDrive(drive)}
                                            >
                                                Edit
                                            </button>
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
                                            <button
                                                className="action-btn edit"
                                                onClick={() => handleOpenEditPlaced(student)}
                                            >
                                                Edit
                                            </button>
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
                                    <th>Students Placed</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trends.map((trend) => (
                                    <tr key={trend._id}>
                                        <td>{trend.year}</td>
                                        <td>{trend.avg}</td>
                                        <td>{trend.studentsPlaced}</td>
                                        <td>
                                            <button
                                                className="action-btn edit"
                                                onClick={() => handleOpenEditTrend(trend)}
                                            >
                                                Edit
                                            </button>
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

            {/* Edit Drive Modal */}
            {showEditDriveModal && (
                <div className="modal-overlay" onClick={closeEditDriveModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Campus Drive</h3>
                            <button
                                className="close-btn"
                                onClick={closeEditDriveModal}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleUpdateDrive}>
                            <div className="form-group-placement">
                                <label>Company Name *
                                    <input
                                        id="edit-drive-company"
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
                                        id="edit-drive-role"
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
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('Mechanical')}
                                                            onChange={() => handleBranchChange('Mechanical')}
                                                        />
                                                        Mechanical
                                                    </label>
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('Mining')}
                                                            onChange={() => handleBranchChange('Mining')}
                                                        />
                                                        Mining
                                                    </label>
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('AI&DS')}
                                                            onChange={() => handleBranchChange('AI&DS')}
                                                        />
                                                        AI&DS
                                                    </label>
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('Agriculture')}
                                                            onChange={() => handleBranchChange('Agriculture')}
                                                        />
                                                        Agriculture
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                                <div className="form-group-placement">
                                    <label>CTC/Package *
                                        <input
                                            id="edit-drive-package"
                                            type="number"
                                            step="0.01"
                                            value={driveForm.package}
                                            onChange={(e) => setDriveForm({ ...driveForm, package: e.target.value })}
                                            required
                                            placeholder="e.g., 12.50"
                                        /></label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group-placement">
                                    <label>Form Opening Date
                                        <input
                                            id="edit-drive-openingDate"
                                            type="date"
                                            value={driveForm.openingDate}
                                            onChange={(e) => setDriveForm({ ...driveForm, openingDate: e.target.value })}
                                        /></label>
                                </div>
                                <div className="form-group-placement">
                                    <label>Form Closing Date
                                        <input
                                            id="edit-drive-closingDate"
                                            type="date"
                                            value={driveForm.closingDate}
                                            onChange={(e) => setDriveForm({ ...driveForm, closingDate: e.target.value })}
                                        /></label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group-placement">
                                    <label>Drive Date
                                        <input
                                            id="edit-drive-date"
                                            type="date"
                                            value={driveForm.date}
                                            onChange={(e) => setDriveForm({ ...driveForm, date: e.target.value })}
                                        /></label>
                                </div>
                                <div className="form-group-placement">
                                    <label>Venue
                                        <input
                                            id="edit-drive-venue"
                                            type="text"
                                            value={driveForm.venue}
                                            onChange={(e) => setDriveForm({ ...driveForm, venue: e.target.value })}
                                            placeholder="e.g., Seminar Hall, Room 101"
                                        /></label>
                                </div>
                            </div>
                            <div className="form-group-placement">
                                <label>Reporting Time
                                    <input
                                        id="edit-drive-reportingTime"
                                        type="time"
                                        value={driveForm.reportingTime}
                                        onChange={(e) => setDriveForm({ ...driveForm, reportingTime: e.target.value })}
                                    /></label>
                            </div>
                            <div className="form-group-placement">
                                <label>Additional Information
                                    <textarea
                                        id="edit-drive-additionalInstructions"
                                        value={driveForm.additionalInstructions}
                                        onChange={(e) => setDriveForm({ ...driveForm, additionalInstructions: e.target.value })}
                                        placeholder="Enter any additional information for candidates"
                                        rows="4"
                                    /></label>
                            </div>
                            <div className="form-group-placement">
                                <label>Application Link
                                    <input
                                        id="edit-drive-link"
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
                                    onClick={closeEditDriveModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Update Drive
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('Mechanical')}
                                                            onChange={() => handleBranchChange('Mechanical')}
                                                        />
                                                        Mechanical
                                                    </label>
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('Mining')}
                                                            onChange={() => handleBranchChange('Mining')}
                                                        />
                                                        Mining
                                                    </label>
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('AI&DS')}
                                                            onChange={() => handleBranchChange('AI&DS')}
                                                        />
                                                        AI&DS
                                                    </label>
                                                    <label className="dropdown-checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            checked={isBranchSelected('Agriculture')}
                                                            onChange={() => handleBranchChange('Agriculture')}
                                                        />
                                                        Agriculture
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
                                            step="0.01"
                                            value={driveForm.package}
                                            onChange={(e) => setDriveForm({ ...driveForm, package: e.target.value })}
                                            required
                                            placeholder="e.g., 12.50"
                                        /></label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group-placement">
                                    <label>Form Opening Date
                                        <input
                                            id="drive-openingDate"
                                            type="date"
                                            value={driveForm.openingDate}
                                            onChange={(e) => setDriveForm({ ...driveForm, openingDate: e.target.value })}
                                        /></label>
                                </div>
                                <div className="form-group-placement">
                                    <label>Form Closing Date
                                        <input
                                            id="drive-closingDate"
                                            type="date"
                                            value={driveForm.closingDate}
                                            onChange={(e) => setDriveForm({ ...driveForm, closingDate: e.target.value })}
                                        /></label>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group-placement">
                                    <label>Drive Date
                                        <input
                                            id="drive-date"
                                            type="date"
                                            value={driveForm.date}
                                            onChange={(e) => setDriveForm({ ...driveForm, date: e.target.value })}
                                        /></label>
                                </div>
                                <div className="form-group-placement">
                                    <label>Venue
                                        <input
                                            id="drive-venue"
                                            type="text"
                                            value={driveForm.venue}
                                            onChange={(e) => setDriveForm({ ...driveForm, venue: e.target.value })}
                                            placeholder="e.g., Seminar Hall, Room 101"
                                        /></label>
                                </div>
                            </div>
                            <div className="form-group-placement">
                                <label>Reporting Time
                                    <input
                                        id="drive-reportingTime"
                                        type="time"
                                        value={driveForm.reportingTime}
                                        onChange={(e) => setDriveForm({ ...driveForm, reportingTime: e.target.value })}
                                    /></label>
                            </div>
                            <div className="form-group-placement">
                                <label>Additional Information
                                    <textarea
                                        id="drive-additionalInstructions"
                                        value={driveForm.additionalInstructions}
                                        onChange={(e) => setDriveForm({ ...driveForm, additionalInstructions: e.target.value })}
                                        placeholder="Enter any additional information for candidates"
                                        rows="4"
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

            {/* Edit Placed Student Modal */}
            {showEditPlacedModal && (
                <div className="modal-overlay" onClick={closeEditPlacedModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Placed Student</h3>
                            <button
                                className="close-btn"
                                onClick={closeEditPlacedModal}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleUpdatePlaced}>
                            <div className="form-group-placement">
                                <label>Enrollment Number *
                                    <input
                                        id="edit-placed-enrollment"
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
                                        id="edit-placed-name"
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
                                            id="edit-placed-branch"
                                            value={placedForm.branch}
                                            onChange={(e) => setPlacedForm({ ...placedForm, branch: e.target.value })}
                                        >
                                            <option>CSE</option>
                                            <option>ECE</option>
                                            <option>EEE</option>
                                            <option>Civil</option>
                                            <option>Mechanical</option>
                                            <option>Mining</option>
                                            <option>AI&DS</option>
                                            <option>Agriculture</option>
                                        </select></label>
                                </div>
                                <div className="form-group-placement">
                                    <label>Company *
                                        <input
                                            id="edit-placed-company"
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
                                        id="edit-placed-package"
                                        type="number"
                                        step="0.01"
                                        value={placedForm.package}
                                        onChange={(e) => setPlacedForm({ ...placedForm, package: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                        required
                                        placeholder="e.g., 12.50"
                                    /></label>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={closeEditPlacedModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Update Student
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
                                            <option>Mechanical</option>
                                            <option>Mining</option>
                                            <option>AI&DS</option>
                                            <option>Agriculture</option>
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
                                        step="0.01"
                                        value={placedForm.package}
                                        onChange={(e) => setPlacedForm({ ...placedForm, package: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                        required
                                        placeholder="e.g., 12.50"
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

            {/* Edit Trend Modal */}
            {showEditTrendModal && (
                <div className="modal-overlay" onClick={closeEditTrendModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Placement Trend</h3>
                            <button
                                className="close-btn"
                                onClick={closeEditTrendModal}
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleUpdateTrend}>
                            <div className="form-group-placement">
                                <label>Year *
                                    <input
                                        id="edit-trend-year"
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
                                            id="edit-trend-avg"
                                            type="number"
                                            step="0.01"
                                            value={trendForm.avg}
                                            onChange={(e) => setTrendForm({ ...trendForm, avg: parseFloat(e.target.value) })}
                                            required
                                            placeholder="e.g., 8.50"
                                        /></label>
                                </div>
                                <div className="form-group-placement">
                                    <label>Students Placed *
                                        <input
                                            id="edit-trend-studentsPlaced"
                                            type="number"
                                            value={trendForm.studentsPlaced}
                                            onChange={(e) => setTrendForm({ ...trendForm, studentsPlaced: parseInt(e.target.value) })}
                                            required
                                            placeholder="e.g., 120"
                                        /></label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={closeEditTrendModal}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Update Trend
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
                                            step="0.01"
                                            value={trendForm.avg}
                                            onChange={(e) => setTrendForm({ ...trendForm, avg: e.target.value })}
                                            required
                                            placeholder="e.g., 12.50"
                                        /></label>
                                </div>
                                <div className="form-group-placement">
                                    <label>Students Placed *
                                        <input
                                            id="trend-studentsPlaced"
                                            type="number"
                                            value={trendForm.studentsPlaced}
                                            onChange={(e) => setTrendForm({ ...trendForm, studentsPlaced: e.target.value })}
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
