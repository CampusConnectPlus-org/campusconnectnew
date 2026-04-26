import React, { useEffect, useMemo, useState } from "react";
import "./LostFound.css";

const API = "http://localhost:5000/api/lost-found";

const initialForm = {
  itemType: "Lost",
  title: "",
  category: "",
  location: "",
  description: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  reward: "",
  itemImage: null,
};

const categories = [
  "ID Card",
  "Phone",
  "Laptop",
  "Books",
  "Wallet",
  "Keys",
  "Accessories",
  "Documents",
  "Other",
];

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState("");

  const parseResponse = async (res) => {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { message: text || "Unexpected server response" };
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const data = await parseResponse(res);
      setItems(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError("Unable to load lost and found items right now.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();

    const storedUser = safeParse(localStorage.getItem("user"));
    const storedAdmin = safeParse(localStorage.getItem("admin"));
    const profile = storedUser || storedAdmin;

    if (profile) {
      setForm((current) => ({
        ...current,
        contactName: profile.name || current.contactName,
        contactEmail: profile.email || current.contactEmail,
      }));
    }
  }, []);

  const stats = useMemo(() => {
    const lost = items.filter((item) => item.itemType === "Lost").length;
    const found = items.filter((item) => item.itemType === "Found").length;
    const open = items.filter((item) => item.status === "Open").length;
    return { lost, found, open };
  }, [items]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = filterType === "All" || item.itemType === filterType;
      const matchesSearch =
        !query ||
        [item.title, item.category, item.location, item.description]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(query));
      return matchesType && matchesSearch;
    });
  }, [items, filterType, search]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "itemImage") {
      const file = files?.[0] || null;
      setForm((current) => ({ ...current, itemImage: file }));
      setPreview(file ? URL.createObjectURL(file) : "");
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) return setError("Please add the item title.");
    if (!form.category.trim()) return setError("Please choose a category.");
    if (!form.location.trim()) return setError("Please add the location.");
    if (!form.description.trim()) return setError("Please describe the item.");
    if (!form.contactName.trim()) return setError("Contact name is required.");
    if (!form.contactEmail.trim()) return setError("Contact email is required.");
    if (!form.contactPhone.trim()) return setError("Contact phone is required.");

    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "" && key !== "itemImage") {
          formData.append(key, value);
        }
      });
      if (form.itemImage) {
        formData.append("itemImage", form.itemImage);
      }

      const res = await fetch(`${API}/add`, {
        method: "POST",
        body: formData,
      });
      const data = await parseResponse(res);

      if (!res.ok) {
        throw new Error(data.message || "Failed to post item");
      }

      setForm({
        ...initialForm,
        contactName: form.contactName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
      });
      setPreview("");
      setSuccess(data.message || "Your item has been posted.");
      fetchItems();
    } catch (submitError) {
      setError(submitError.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="lost-found-page">
      <section className="lost-found-hero">
        <div className="lost-found-hero__content">
          <p className="lost-found-kicker">CampusConnect+</p>
          <h1>Lost & Found Portal</h1>
          <p>
            Post lost items, report found items, and help classmates reconnect with what they
            are missing.
          </p>

          <div className="lost-found-stats">
            <div>
              <strong>{stats.lost}</strong>
              <span>Lost posts</span>
            </div>
            <div>
              <strong>{stats.found}</strong>
              <span>Found posts</span>
            </div>
            <div>
              <strong>{stats.open}</strong>
              <span>Open items</span>
            </div>
          </div>
        </div>

        <div className="lost-found-hero__panel">
          <h3>How it works</h3>
          <ul>
            <li>Share item details, where it was seen, and your contact info.</li>
            <li>Browse recent lost and found posts from campus students.</li>
            <li>Reach out directly to the contact person to close the loop fast.</li>
          </ul>
        </div>
      </section>

      <section className="lost-found-grid">
        <form className="lost-found-form" onSubmit={handleSubmit}>
          <div className="section-heading">
            <span>New post</span>
            <h2>Report a lost or found item</h2>
          </div>

          <div className="toggle-group">
            {['Lost', 'Found'].map((type) => (
              <button
                key={type}
                type="button"
                className={form.itemType === type ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setForm((current) => ({ ...current, itemType: type }))}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="field-grid">
            <label>
              Item title
              <input name="title" value={form.title} onChange={handleChange} placeholder="Blue HP laptop" />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Location seen
              <input name="location" value={form.location} onChange={handleChange} placeholder="Library, CSE block, cafeteria..." />
            </label>
            <label>
              Reward / note
              <input name="reward" value={form.reward} onChange={handleChange} placeholder="Optional reward or special note" />
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add color, brand, identifying marks, time, and anything useful."
              rows="5"
            />
          </label>

          <div className="field-grid">
            <label>
              Contact name
              <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Your full name" />
            </label>
            <label>
              Contact email
              <input name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="your@email.com" />
            </label>
            <label>
              Contact phone
              <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="Mobile number" />
            </label>
          </div>

          <label>
            Item picture
            <input name="itemImage" type="file" accept="image/*" onChange={handleChange} />
          </label>

          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Selected item preview" />
            </div>
          )}

          {error && <div className="feedback error">{error}</div>}
          {success && <div className="feedback success">{success}</div>}

          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? "Posting..." : `Post ${form.itemType} Item`}
          </button>
        </form>

        <div className="lost-found-list">
          <div className="section-heading section-heading--row">
            <div>
              <span>Recent posts</span>
              <h2>Latest items on campus</h2>
            </div>

            <div className="filter-row">
              {['All', 'Lost', 'Found'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={filterType === type ? "filter-btn active" : "filter-btn"}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <label className="search-box">
            <span>Search items</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, category, location, or description"
            />
          </label>

          {loading ? (
            <div className="empty-state">Loading latest posts...</div>
          ) : visibleItems.length === 0 ? (
            <div className="empty-state">No items match your filters yet.</div>
          ) : (
            <div className="item-list">
              {visibleItems.map((item) => (
                <article className="item-card" key={item._id}>
                  <div className="item-card__top">
                    <span className={item.itemType === "Lost" ? "type-badge lost" : "type-badge found"}>
                      {item.itemType}
                    </span>
                    <span className={item.status === "Open" ? "status-badge open" : "status-badge closed"}>
                      {item.status}
                    </span>
                  </div>

                  <h3>{item.title}</h3>
                  <p className="item-meta">{item.category} · {item.location}</p>
                  <p className="item-description">{item.description}</p>

                  {item.image ? (
                    <div className="item-image-wrap">
                      <img src={`http://localhost:5000/${item.image}`} alt={item.title} className="item-image" />
                    </div>
                  ) : null}

                  {item.reward ? <p className="item-reward">{item.reward}</p> : null}

                  <div className="contact-grid">
                    <a href={`mailto:${item.contactEmail}`}>Email {item.contactName}</a>
                    <a href={`tel:${item.contactPhone}`}>Call {item.contactPhone}</a>
                  </div>

                  <div className="contact-summary">
                    <span>{item.contactEmail}</span>
                    <span>{item.contactPhone}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LostFound;