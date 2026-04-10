import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CTAEClubAdmin.css";

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [clubData, setClubData] = useState({});
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ------------------- Fetch Clubs from backend -------------------
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/clubs")
      .then((res) => {
        setClubs(res.data.map((c) => ({ id: c._id, name: c.name })));
        const dataObj = {};
        res.data.forEach((c) => {
          dataObj[c._id] = c;
        });
        setClubData(dataObj);
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
    axios
      .put(`http://localhost:5000/api/clubs/${selectedClubId}`, selectedClub)
      .then(() => alert("Club updated successfully"))
      .catch((err) => console.log(err));
  };

  // ------------------- Add New Club -------------------
  const addNewClub = () => {
    const newClub = {
      name: "New Club",
      heroTitle: "",
      heroDescription: "",
      about: "",
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

          {/* Team Members */}
          <section>
            <h2>Team Members</h2>
            {selectedClub.teamMembers.map((member, idx) => (
              <input
                key={member.id}
                value={member.name}
                placeholder="Member Name"
                onChange={(e) => {
                  const newTeam = [...selectedClub.teamMembers];
                  newTeam[idx].name = e.target.value;
                  handleInputChange("teamMembers", newTeam);
                }}
              />
            ))}
            <button
              onClick={() =>
                handleInputChange("teamMembers", [
                  ...selectedClub.teamMembers,
                  { id: Date.now(), name: "" },
                ])
              }
            >
              Add Member
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
                  { id: Date.now(), title: "", icon: "" },
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
                  { id: Date.now(), title: "", date: "", description: "" },
                ])
              }
            >
              Add Event
            </button>
          </section>

          <button onClick={saveChanges}>Save Changes</button>
          {/* ------------------- Join Requests ------------------- */}

<section>

<h2>Join Requests</h2>

{selectedClub.registrations?.length === 0 && (
<p>No requests yet</p>
)}

{selectedClub.registrations?.map((r, i) => (

<div className="request-card" key={i}>

<p><strong>Name:</strong> {r.firstName} {r.lastName}</p>

<p><strong>Email:</strong> {r.email}</p>

<p><strong>Branch:</strong> {r.branch}</p>

<p><strong>Year:</strong> {r.collegeYear}</p>

<p><strong>Mobile:</strong> {r.mobile}</p>

<p><strong>Enrollment:</strong> {r.enrollmentNo}</p>

<p><strong>Hobby:</strong> {r.hobby}</p>

<p><strong>Contribution:</strong> {r.contribution}</p>

<hr/>

</div>

))}

          </section>
          {/* ------------------- Event Participants ------------------- */}

<section>

<h2>Event Participation</h2>

{selectedClub.eventParticipants?.length === 0 && (
<p>No participants yet</p>
)}

{selectedClub.eventParticipants?.map((p, i) => (

<div className="request-card" key={i}>

<p><strong>Event:</strong> {p.eventTitle}</p>

<p><strong>Name:</strong> {p.firstName} {p.lastName}</p>

<p><strong>Email:</strong> {p.email}</p>

<p><strong>Branch:</strong> {p.branch}</p>

<p><strong>Year:</strong> {p.collegeYear}</p>

<p><strong>Mobile:</strong> {p.mobile}</p>

<hr/>

</div>

))}

</section>
        </main>
      )}
    </div>
  );
};

export default ManageClubs;