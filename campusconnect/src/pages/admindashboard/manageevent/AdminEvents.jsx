import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminEvents.css";

const API = "http://localhost:5000/api/events";

const AdminEvents = () => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    overview: "",
    highlights: [""],
      schedule: [{ day: "", events: "" }],
  });
  const [activeTab, setActiveTab] = useState("events");
  const [editBanner, setEditBanner] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [participantsModal, setParticipantsModal] = useState(null);
  const [events, setEvents] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);

  const [editEvent, setEditEvent] = useState(null);

  // load events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get(API);

    setEvents(res.data);
  };

  // auto status
  const getStatus = (date) => {
    return new Date(date) < new Date() ? "past" : "upcoming";
  };

  // create event
  const addEvent = async () => {
    const formData = new FormData();

    formData.append("title", newEvent.title);

    formData.append("date", newEvent.date);

    formData.append("location", newEvent.location);
formData.append(
  "schedule",
  JSON.stringify(newEvent.schedule)
);
    formData.append("category", newEvent.category);
    formData.append("overview", newEvent.overview);
    formData.append("highlights", JSON.stringify(newEvent.highlights));
    formData.append("description", newEvent.description);
    if (bannerFile) {
      formData.append("bannerImage", bannerFile);
    }
    console.log("FORM DATA ↓");

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    await axios.post(
      `${API}/create`,

      formData,
    );

    fetchEvents();
    setNewEvent({
      title: "",
      description: "",
      date: "",
      location: "",
      category: "",
      overview: "",
      highlights: [""],
       schedule: [{ day: "", events: "" }],
    });

    setBannerFile(null);
  };

  // delete
  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    await axios.delete(`${API}/${id}`);
    fetchEvents();
  };

  // open edit modala
  const openEditModal = (event) => {
    setEditEvent(event);
  };

  // save edit
  const saveEdit = async () => {
    const formData = new FormData();

    formData.append("title", editEvent.title);
    formData.append("date", editEvent.date);
    formData.append("location", editEvent.location);
    formData.append("category", editEvent.category);
    formData.append("description", editEvent.description);

    formData.append("overview", editEvent.details?.overview || "");

    formData.append(
      "highlights",
      JSON.stringify(editEvent.details?.highlights || []),
    );
formData.append(
  "schedule",
  JSON.stringify(editEvent.details?.schedule || [])
);
    if (editBanner) {
      formData.append("bannerImage", editBanner);
    }

    await axios.put(`${API}/${editEvent._id}`, formData);

    fetchEvents();
    setEditEvent(null);
    setEditBanner(null);
  };

  // open gallery modal
  const openGalleryModal = (event) => {
    setSelectedEvent(event);
  };

  // select gallery images
  const handleGalleryFiles = (e) => {
    setGalleryFiles(e.target.files);
  };

  // upload gallery images
  const saveGalleryImages = async () => {
    const formData = new FormData();

    for (let file of galleryFiles) {
      formData.append(
        "images",

        file,
      );
    }

    await axios.post(
      `${API}/gallery/${selectedEvent._id}`,

      formData,
    );

    fetchEvents();

    setSelectedEvent(null);

    setGalleryFiles([]);
  };

  const upcomingEvents = events.filter(
    (event) => getStatus(event.date) === "upcoming",
  );

  const pastEvents = events.filter((event) => getStatus(event.date) === "past");

  return (
    <div className="admin-events-container">
      {/* 🔹 TABS */}
      <div className="admin-tabs">
        <button
          className={activeTab === "events" ? "active" : ""}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>

        <button
          className={activeTab === "participants" ? "active" : ""}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </button>
      </div>

      {/* ================= EVENTS TAB ================= */}
      {activeTab === "events" && (
        <>
          <h2>Add Event</h2>

          <div className="add-event-form">
            <input
              placeholder="title"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  title: e.target.value,
                })
              }
            />

            <input
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  date: e.target.value,
                })
              }
            />

            <textarea
              placeholder="description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  description: e.target.value,
                })
              }
            />

            <input
              placeholder="location"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  location: e.target.value,
                })
              }
            />

            <select
              value={newEvent.category}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  category: e.target.value,
                })
              }
            >
              <option value="">select category</option>
              <option value="technical">technical</option>
              <option value="cultural">cultural</option>
              <option value="fest">fest</option>
              <option value="sports">sports</option>
              <option value="workshop">workshop</option>
              <option value="other">other</option>
            </select>

            <textarea
              placeholder="Event overview"
              value={newEvent.overview}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  overview: e.target.value,
                })
              }
            />
<h4>Schedule</h4>

{newEvent.schedule.map((s, index) => (
  <div key={index}>
    <input
      placeholder="Day (e.g. Day 1)"
      value={s.day}
      onChange={(e) => {
        const updated = [...newEvent.schedule];
        updated[index].day = e.target.value;
        setNewEvent({ ...newEvent, schedule: updated });
      }}
    />

    <input
      placeholder="Events"
      value={s.events}
      onChange={(e) => {
        const updated = [...newEvent.schedule];
        updated[index].events = e.target.value;
        setNewEvent({ ...newEvent, schedule: updated });
      }}
    />

    <button onClick={() => {
      const updated = newEvent.schedule.filter((_, i) => i !== index);
      setNewEvent({ ...newEvent, schedule: updated });
    }}>
      ❌
    </button>
  </div>
))}

<button onClick={() =>
  setNewEvent({
    ...newEvent,
    schedule: [...newEvent.schedule, { day: "", events: "" }]
  })
}>
  + Add Schedule
</button>
            <h4>Highlights</h4>

            {newEvent.highlights.map((h, index) => (
              <div key={index}>
                <input
                  value={h}
                  onChange={(e) => {
                    const updated = [...newEvent.highlights];
                    updated[index] = e.target.value;
                    setNewEvent({ ...newEvent, highlights: updated });
                  }}
                />

                <button type="button" onClick={() => {
                    const updated = newEvent.highlights.filter(
                      (_, i) => i !== index,
                    );
                    setNewEvent({ ...newEvent, highlights: updated });
                  }}
                >
                  ❌
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setNewEvent({
                  ...newEvent,
                  highlights: [...newEvent.highlights, ""],
                })
              }
            >
              + Add Highlight
            </button>

            <input
              type="file"
              onChange={(e) => setBannerFile(e.target.files[0])}
            />

            <button type="button" onClick={addEvent}>
  Add Event
</button>
          </div>

          {/* UPCOMING EVENTS */}
          <h2>Upcoming Events</h2>

          <div className="events-grid">
            {upcomingEvents.map((event) => (
              <div key={event._id} className="admin-event-card">
                <div className="event-card-header">
                  <div>
                    <h3>{event.title}</h3>
                    <p className="event-meta">
                      {event.date} · {event.location}
                    </p>
                  </div>
                  <span className={`event-status ${getStatus(event.date)}`}>
                    {getStatus(event.date)}
                  </span>
                </div>

                {event.bannerImage && (
                  <img
                    className="banner-img"
                    src={`http://localhost:5000/${event.bannerImage}`}
                    alt=""
                  />
                )}

                <div className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => openEditModal(event)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteEvent(event._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* PAST EVENTS */}
          <h2>Past Events (Moments)</h2>

          <div className="events-grid">
            {pastEvents.map((event) => (
              <div key={event._id} className="admin-event-card">
                <div className="event-card-header">
                  <div>
                    <h3>{event.title}</h3>
                    <p className="event-meta">{event.date}</p>
                  </div>
                  <span className={`event-status ${getStatus(event.date)}`}>
                    {getStatus(event.date)}
                  </span>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-upload"
                    onClick={() => openGalleryModal(event)}
                  >
                    Upload photos
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteEvent(event._id)}
                  >
                    Delete
                  </button>
                </div>

                <div className="image-preview">
                  {event.details?.galleryImages?.map((img, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000/${img.url}`}
                      alt="event moment"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* GALLERY MODAL */}
          {selectedEvent && (
            <div className="modal">
              <div className="modal-content">
                <h3>Upload Moments</h3>

                <input type="file" multiple onChange={handleGalleryFiles} />

                <div className="modal-actions">
                  <button
                    className="btn btn-upload"
                    onClick={saveGalleryImages}
                  >
                    Upload
                  </button>
                  <button
                    className="btn btn-cancel"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT MODAL */}
          {editEvent && (
            <div className="modal">
              <div className="modal-content">
                <h3>Edit Event</h3>

                <input
                  value={editEvent.title}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, title: e.target.value })
                  }
                />

                <input
                  type="date"
                  value={editEvent.date?.substring(0, 10)}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, date: e.target.value })
                  }
                />

                <textarea
                  value={editEvent.description || ""}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, description: e.target.value })
                  }
                />

                <input
                  value={editEvent.location}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, location: e.target.value })
                  }
                />

                <select
                  value={editEvent.category}
                  onChange={(e) =>
                    setEditEvent({ ...editEvent, category: e.target.value })
                  }
                >
                  <option value="technical">technical</option>
                  <option value="cultural">cultural</option>
                  <option value="fest">fest</option>
                  <option value="sports">sports</option>
                  <option value="workshop">workshop</option>
                  <option value="other">other</option>
                </select>

                <textarea
                  value={editEvent.details?.overview || ""}
                  onChange={(e) =>
                    setEditEvent({
                      ...editEvent,
                      details: {
                        ...editEvent.details,
                        overview: e.target.value,
                      },
                    })
                  }
                />
<h4>Schedule</h4>

{editEvent.details?.schedule?.map((s, index) => (
  <div key={index}>
    <input
      value={s.day}
      placeholder="Day"
      onChange={(e) => {
        const updated = [...editEvent.details.schedule];
        updated[index].day = e.target.value;

        setEditEvent({
          ...editEvent,
          details: {
            ...editEvent.details,
            schedule: updated,
          },
        });
      }}
    />

    <input
      value={s.events}
      placeholder="Events"
      onChange={(e) => {
        const updated = [...editEvent.details.schedule];
        updated[index].events = e.target.value;

        setEditEvent({
          ...editEvent,
          details: {
            ...editEvent.details,
            schedule: updated,
          },
        });
      }}
    />

    <button onClick={() => {
      const updated = editEvent.details.schedule.filter((_, i) => i !== index);

      setEditEvent({
        ...editEvent,
        details: {
          ...editEvent.details,
          schedule: updated,
        },
      });
    }}>
      ❌
    </button>
  </div>
))}

<button onClick={() =>
  setEditEvent({
    ...editEvent,
    details: {
      ...editEvent.details,
      schedule: [
        ...(editEvent.details?.schedule || []),
        { day: "", events: "" },
      ],
    },
  })
}>
  + Add Schedule
</button>
                <input
                  type="file"
                  onChange={(e) => setEditBanner(e.target.files[0])}
                />

                <div className="modal-actions">
                  <button className="btn btn-save" onClick={saveEdit}>
                    Save
                  </button>
                  <button
                    className="btn btn-cancel"
                    onClick={() => setEditEvent(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= PARTICIPANTS TAB ================= */}
      {activeTab === "participants" && (
        <div className="participants-section">
          <h2>Participants Requests</h2>

          {events.map((event) => (
            <div key={event._id} className="admin-event-card">
              <h3>{event.title}</h3>
              <p>{event.date}</p>

              {event.participants?.length > 0 ? (
                <table className="participants-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Year</th>
                      <th>Branch</th>
                      <th>Email</th>
                      <th>Mobile</th>
                    </tr>
                  </thead>

                  <tbody>
                    {event.participants.map((p, i) => (
                      <tr key={i}>
                        <td>{p.name}</td>
                        <td>{p.year}</td>
                        <td>{p.branch}</td>
                        <td>{p.email}</td>
                        <td>{p.mobile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No participants yet</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
