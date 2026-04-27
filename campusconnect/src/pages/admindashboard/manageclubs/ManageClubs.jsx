import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CTAEClubAdmin.css";

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [clubData, setClubData] = useState({});
  const [originalClubData, setOriginalClubData] = useState({});
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletedTeamMembers, setDeletedTeamMembers] = useState(new Set());
  const [deletedMembers, setDeletedMembers] = useState(new Set());

  // ------------------- Fetch Clubs from backend -------------------
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/clubs")
      .then((res) => {
        setClubs(res.data.map((c) => ({ id: c._id, name: c.name })));
        const dataObj = {};
        const originalObj = {};
        res.data.forEach((c) => {
          dataObj[c._id] = JSON.parse(JSON.stringify(c));
          originalObj[c._id] = JSON.parse(JSON.stringify(c));
        });
        setClubData(dataObj);
        setOriginalClubData(originalObj);
        if (res.data.length > 0) setSelectedClubId(res.data[0]._id);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  const selectedClub = clubData[selectedClubId];

  // ------------------- Handle input changes -------------------
  const handleInputChange = (field, value) => {
    setClubData((prev) => ({
      ...prev,
      [selectedClubId]: { ...prev[selectedClubId], [field]: value },
    }));
  };

  // ------------------- Save Changes -------------------
  const saveChanges = () => {
    // Filter out deleted team members before saving (by index position)
    const clubToSave = {
      ...selectedClub,
      teamMembers: selectedClub.teamMembers.filter((m, idx) => !deletedTeamMembers.has(idx)),
      members: selectedClub.members?.filter((m) => !deletedMembers.has(m._id)) || [],
    };

    axios
      .put(`http://localhost:5000/api/clubs/${selectedClubId}`, clubToSave)
      .then((res) => {
        alert("Club updated successfully");
        const updatedClubData = res.data;

        // Reset the sets immediately to prevent "ghost" deletions on the next render
        setDeletedTeamMembers(new Set());
        setDeletedMembers(new Set());

        // Update both clubData and originalClubData with fresh server data
        setClubData((prev) => ({
          ...prev,
          [selectedClubId]: updatedClubData,
        }));
        setOriginalClubData((prev) => ({
          ...prev,
          [selectedClubId]: JSON.parse(JSON.stringify(updatedClubData)),
        }));

        window.dispatchEvent(new Event("clubs-updated"));
      })
      .catch((err) => console.log(err));
  };

  // ------------------- Cancel Changes -------------------
  const cancelChanges = () => {
    if (!window.confirm("Are you sure? All unsaved changes will be lost.")) return;

    // Revert to original saved state
    setClubData((prev) => ({
      ...prev,
      [selectedClubId]: JSON.parse(JSON.stringify(originalClubData[selectedClubId])),
    }));
    setDeletedTeamMembers(new Set());
    setDeletedMembers(new Set());
  };

  // ------------------- Approve Registration -------------------
  const approveRegistration = (index) => {
    axios
      .post(`http://localhost:5000/api/clubs/${selectedClubId}/registrations/${index}/approve`)
      .then((res) => {
        alert("Registration approved!");
        // Update club data with response
        setClubData((prev) => ({
          ...prev,
          [selectedClubId]: res.data.club,
        }));
        setOriginalClubData((prev) => ({
          ...prev,
          [selectedClubId]: JSON.parse(JSON.stringify(res.data.club)),
        }));
      })
      .catch((err) => {
        console.log(err);
        alert("Error approving registration");
      });
  };

  // ------------------- Reject Registration -------------------
  const rejectRegistration = (index) => {
    const rejectionMessage = window.prompt("Enter rejection reason (optional):");
    // if (rejectionMessage === null) return; // User cancelled

    axios
      .post(`http://localhost:5000/api/clubs/${selectedClubId}/registrations/${index}/reject`, { rejectionMessage })
      .then((res) => {
        alert("Registration rejected and email sent!");
        // Update club data with response
        setClubData((prev) => ({
          ...prev,
          [selectedClubId]: res.data.club,
        }));
        setOriginalClubData((prev) => ({
          ...prev,
          [selectedClubId]: JSON.parse(JSON.stringify(res.data.club)),
        }));
      })
      .catch((err) => {
        console.log(err);
        alert("Error rejecting registration");
      });
  };

  // ------------------- Approve Event Participation Request -------------------
  const approveEventParticipation = (index) => {
    axios
      .post(`http://localhost:5000/api/clubs/${selectedClubId}/eventParticipation/${index}/approve`)
      .then((res) => {
        alert("Participation request approved!");
        // Update club data with response
        setClubData((prev) => ({
          ...prev,
          [selectedClubId]: res.data.club,
        }));
        setOriginalClubData((prev) => ({
          ...prev,
          [selectedClubId]: JSON.parse(JSON.stringify(res.data.club)),
        }));
      })
      .catch((err) => {
        console.log(err);
        alert("Error approving participation");
      });
  };

  // ------------------- Reject Event Participation Request -------------------
  const rejectEventParticipation = (index) => {
    const rejectionMessage = window.prompt("Enter rejection reason (optional):");
    // if (rejectionMessage === null) return; // User cancelled

    axios
      .post(`http://localhost:5000/api/clubs/${selectedClubId}/eventParticipation/${index}/reject`, { rejectionMessage })
      .then((res) => {
        alert("Participation request rejected and email sent!");
        // Update club data with response
        setClubData((prev) => ({
          ...prev,
          [selectedClubId]: res.data.club,
        }));
        setOriginalClubData((prev) => ({
          ...prev,
          [selectedClubId]: JSON.parse(JSON.stringify(res.data.club)),
        }));
      })
      .catch((err) => {
        console.log(err);
        alert("Error rejecting participation");
      });
  };

  // ------------------- Remove Event Participant -------------------
  const removeEventParticipant = (participantId) => {
    if (!window.confirm("Are you sure you want to remove this participant?")) return;

    axios
      .post(`http://localhost:5000/api/clubs/${selectedClubId}/eventParticipants/${participantId}/remove`)
      .then((res) => {
        alert("Participant removed!");
        // Update club data with response
        setClubData((prev) => ({
          ...prev,
          [selectedClubId]: res.data.club,
        }));
        setOriginalClubData((prev) => ({
          ...prev,
          [selectedClubId]: JSON.parse(JSON.stringify(res.data.club)),
        }));
      })
      .catch((err) => {
        console.log(err);
        alert("Error removing participant");
      });
  };

  // ------------------- Add New Club -------------------
  const addNewClub = () => {
    const clubName = prompt("Enter club name:");

    if (!clubName || clubName.trim() === "") {
      alert("Club name required");
      return;
    }

    const newClub = {
      name: clubName,   // ✅ dynamic name
      heroTitle: "",
      heroDescription: "",
      about: "",
      joinApplicationsOpen: true,
      joinOpenFrom: "",
      joinOpenUntil: "",
      joinClosedMessage: "Applications are closed for now. Please check back later.",
      teamMembers: [],
      achievements: [],
      upcomingEvents: [],
    };

    axios
      .post("http://localhost:5000/api/clubs", newClub)
      .then((res) => {
        const newId = res.data._id;
        setClubs((prev) => [...prev, { id: newId, name: res.data.name }]);
        setClubData((prev) => ({ ...prev, [newId]: res.data }));
        setSelectedClubId(newId);
      })
      .catch((err) => console.log(err));
  };
  // -----------delete-------------
  const deleteClub = () => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;

    axios
      .delete(`http://localhost:5000/api/clubs/${selectedClubId}`)
      .then(() => {
        alert("Club deleted");

        // remove from UI
        setClubs((prev) => prev.filter((c) => c.id !== selectedClubId));

        const updatedData = { ...clubData };
        delete updatedData[selectedClubId];
        setClubData(updatedData);

        // select another club automatically
        const remaining = Object.keys(updatedData);
        setSelectedClubId(remaining.length ? remaining[0] : null);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="club-admin-container">
      {/* ------------------- Club Selector ------------------- */}
      <aside className="club-admin-sidebar">
        <h2>Manage Clubs</h2>
        {clubs.map((club) => (
          <button
            key={club.id}
            className={selectedClubId === club.id ? "active" : ""}
            onClick={() => setSelectedClubId(club.id)}
          >
            {club.name}
          </button>
        ))}
        <button className="add-club-btn" onClick={addNewClub}>
          + Add New Club
        </button>
      </aside>

      {/* ------------------- Club Editor ------------------- */}
      {selectedClub && (
        <main className="club-admin-main">
          <h1>{selectedClub.name} Admin</h1>

          {/* Hero Section */}
          <section>
            <h2>Hero Section</h2>
            <input
              type="text"
              value={selectedClub.heroTitle}
              placeholder="Hero Title"
              onChange={(e) => handleInputChange("heroTitle", e.target.value)}
            />
            <textarea
              value={selectedClub.heroDescription}
              placeholder="Hero Description"
              onChange={(e) =>
                handleInputChange("heroDescription", e.target.value)
              }
            />
          </section>

          {/* About Section */}
          <section>
            <h2>About</h2>
            <textarea
              value={selectedClub.about}
              placeholder="About the club"
              onChange={(e) => handleInputChange("about", e.target.value)}
            />
          </section>

          {/* Join Applications */}
          <section>
            <h2>Join Applications</h2>
            <label>
              <span>Open Applications</span>
              <select
                value={selectedClub.joinApplicationsOpen ? "open" : "closed"}
                onChange={(e) => handleInputChange("joinApplicationsOpen", e.target.value === "open")}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label>
              <span>Open From</span>
              <input
                type="date"
                value={selectedClub.joinOpenFrom || ""}
                onChange={(e) => handleInputChange("joinOpenFrom", e.target.value)}
              />
            </label>
            <label>
              <span>Open Until</span>
              <input
                type="date"
                value={selectedClub.joinOpenUntil || ""}
                onChange={(e) => handleInputChange("joinOpenUntil", e.target.value)}
              />
            </label>
            <label>
              <span>Closed Message</span>
              <textarea
                value={selectedClub.joinClosedMessage || ""}
                placeholder="Applications are closed for now."
                onChange={(e) => handleInputChange("joinClosedMessage", e.target.value)}
              />
            </label>
          </section>

          {/* Team Leads */}
          <section>
            <h2>Team Leads</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {selectedClub.teamMembers.map((lead, idx) => (
                <div key={`lead_${idx}`} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    value={lead.name}
                    placeholder="Lead Name"
                    disabled={deletedTeamMembers.has(idx)}
                    style={{
                      flex: 1,
                      opacity: deletedTeamMembers.has(idx) ? 0.5 : 1,
                      textDecoration: deletedTeamMembers.has(idx) ? "line-through" : "none",
                      border: deletedTeamMembers.has(idx) ? "1px solid red" : "1px solid #ccc"
                    }}
                    onChange={(e) => {
                      const newLeads = selectedClub.teamMembers.map((member, i) =>
                        i === idx ? { ...member, name: e.target.value } : member
                      );
                      handleInputChange("teamMembers", newLeads);
                    }}
                  />
                  <button
                    onClick={() => {
                      const newDeleted = new Set(deletedTeamMembers);
                      if (newDeleted.has(idx)) {
                        newDeleted.delete(idx);
                      } else {
                        newDeleted.add(idx);
                      }
                      setDeletedTeamMembers(newDeleted);
                    }}
                    style={{
                      background: deletedTeamMembers.has(idx) ? "#f0ad4e" : "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {deletedTeamMembers.has(idx) ? "Restore" : "Delete"}
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                handleInputChange("teamMembers", [
                  ...selectedClub.teamMembers,
                  { id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, name: "" },
                ])
              }
              style={{ marginTop: "10px" }}
            >
              Add Team Lead
            </button>
          </section>

          {/* Achievements */}
          <section>
            <h2>Achievements</h2>
            {selectedClub.achievements.map((ach, idx) => (
              <div key={ach.id}>
                <input
                  value={ach.title}
                  placeholder="Achievement Title"
                  onChange={(e) => {
                    const newAch = [...selectedClub.achievements];
                    newAch[idx].title = e.target.value;
                    handleInputChange("achievements", newAch);
                  }}
                />
                <input
                  value={ach.icon}
                  placeholder="Icon/Emoji"
                  onChange={(e) => {
                    const newAch = [...selectedClub.achievements];
                    newAch[idx].icon = e.target.value;
                    handleInputChange("achievements", newAch);
                  }}
                />
              </div>
            ))}
            <button
              onClick={() =>
                handleInputChange("achievements", [
                  ...selectedClub.achievements,
                  { id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, title: "", icon: "" },
                ])
              }
            >
              Add Achievement
            </button>
          </section>

          {/* Events */}
          <section>
            <h2>Upcoming Events</h2>
            {selectedClub.upcomingEvents.map((event, idx) => (
              <div key={event.id}>
                <input
                  value={event.title}
                  placeholder="Event Title"
                  onChange={(e) => {
                    const newEvents = [...selectedClub.upcomingEvents];
                    newEvents[idx].title = e.target.value;
                    handleInputChange("upcomingEvents", newEvents);
                  }}
                />
                <input
                  type="date"
                  value={event.date}
                  onChange={(e) => {
                    const newEvents = [...selectedClub.upcomingEvents];
                    newEvents[idx].date = e.target.value;
                    handleInputChange("upcomingEvents", newEvents);
                  }}
                />
                <textarea
                  value={event.description}
                  placeholder="Event Description"
                  onChange={(e) => {
                    const newEvents = [...selectedClub.upcomingEvents];
                    newEvents[idx].description = e.target.value;
                    handleInputChange("upcomingEvents", newEvents);
                  }}
                />
              </div>
            ))}
            <button
              onClick={() =>
                handleInputChange("upcomingEvents", [
                  ...selectedClub.upcomingEvents,
                  { id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, title: "", date: "", description: "" },
                ])
              }
            >
              Add Event
            </button>
          </section>

          {/* Club Members */}
          <section>
            <h2>Club Members</h2>
            {selectedClub.members && selectedClub.members.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Name</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Enrollment No</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Email</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Branch</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Year</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClub.members.map((member) => (
                      <tr
                        key={member._id}
                        style={{
                          backgroundColor: deletedMembers.has(member._id) ? "#ffcccc" : "white",
                          opacity: deletedMembers.has(member._id) ? 0.6 : 1,
                        }}
                      >
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                          {member.firstName} {member.lastName}
                          {deletedMembers.has(member._id) && (<span style={{ color: "red", fontSize: "10px", marginLeft: "5px" }}>(to be removed)</span>)}
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{member.enrollmentNo || "N/A"}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{member.email || "N/A"}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{member.branch || "N/A"}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{member.collegeYear || "N/A"}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                          <button
                            onClick={() => {
                              const newDeleted = new Set(deletedMembers);
                              if (newDeleted.has(member._id)) {
                                newDeleted.delete(member._id);
                              } else {
                                newDeleted.add(member._id);
                              }
                              setDeletedMembers(newDeleted);
                            }}
                            style={{
                              background: deletedMembers.has(member._id) ? "#f0ad4e" : "#dc3545",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            {deletedMembers.has(member._id) ? "Undo" : "Remove"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No members in this club yet</p>
            )}
          </section>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button onClick={saveChanges} style={{ background: "#28a745", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Save Changes
            </button>
            <button onClick={cancelChanges} style={{ background: "#6c757d", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={deleteClub}
              style={{ background: "#dc3545", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Delete Club
            </button>
          </div>
          {/* ------------------- Join Requests ------------------- */}

          <section>

            <h2>Pending Join Requests</h2>

            {selectedClub.registrations?.length === 0 ? (
              <p>No requests yet</p>
            ) : (

              selectedClub.registrations?.map((r, i) => (

                <div className="request-card" key={i} style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "4px", marginBottom: "15px" }}>

                  <p><strong>Name:</strong> {r.firstName} {r.lastName}</p>

                  <p><strong>Email:</strong> {r.email}</p>

                  <p><strong>Branch:</strong> {r.branch}</p>

                  <p><strong>Year:</strong> {r.collegeYear}</p>

                  <p><strong>Mobile:</strong> {r.mobile}</p>

                  <p><strong>Enrollment:</strong> {r.enrollmentNo}</p>

                  <p><strong>Hobby:</strong> {r.hobby}</p>

                  <p><strong>Contribution:</strong> {r.contribution}</p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      onClick={(e) => { e.preventDefault(); approveRegistration(i); }}
                      style={{
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); rejectRegistration(i); }}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Reject
                    </button>
                  </div>

                  <hr />

                </div>

              ))
            )}

          </section>
          {/* ------------------- Event Participation Requests ------------------- */}

          <section>

            <h2>Pending Event Participation Requests</h2>

            {selectedClub.eventParticipationRequests?.length === 0 ? (
              <p>No pending requests</p>
            ) : (

              selectedClub.eventParticipationRequests?.map((r, i) => (

                <div className="request-card" key={i} style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "4px", marginBottom: "15px" }}>

                  <p><strong>Event:</strong> {r.eventTitle}</p>

                  <p><strong>Name:</strong> {r.firstName} {r.lastName}</p>

                  <p><strong>Email:</strong> {r.email}</p>

                  <p><strong>Branch:</strong> {r.branch}</p>

                  <p><strong>Year:</strong> {r.collegeYear}</p>

                  <p><strong>Mobile:</strong> {r.mobile}</p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      onClick={(e) => { e.preventDefault(); approveEventParticipation(i); }}
                      style={{
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); rejectEventParticipation(i); }}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Reject
                    </button>
                  </div>

                  <hr />

                </div>

              ))
            )}

          </section>

          {/* ------------------- Approved Event Participants ------------------- */}

          <section>

            <h2>Approved Event Participants</h2>

            {selectedClub.eventParticipants?.length === 0 ? (
              <p>No participants yet</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Event</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Name</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Email</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Branch</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Year</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Mobile</th>
                      <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClub.eventParticipants?.map((p) => (
                      <tr key={p._id}>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{p.eventTitle}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{p.firstName} {p.lastName}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{p.email || "N/A"}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{p.branch || "N/A"}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{p.collegeYear || "N/A"}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px" }}>{p.mobile || "N/A"}</td>
                        <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                          <button
                            onClick={(e) => { e.preventDefault(); removeEventParticipant(p._id); }}
                            style={{
                              background: "#dc3545",
                              color: "white",
                              border: "none",
                              padding: "5px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </section>
        </main>
      )}
    </div>
  );
};

export default ManageClubs;