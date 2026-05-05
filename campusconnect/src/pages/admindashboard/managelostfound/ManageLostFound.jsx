import React, { useEffect, useState } from "react";
import "./ManageLostFound.css";

const API = "http://localhost:5000/api/lost-found";

const ManageLostFound = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const parseResponse = async (res) => {
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { message: text || "Unexpected server response" };
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/admin/all`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!res.ok) {
        const data = await parseResponse(res);
        throw new Error(data.message || "Failed to fetch items");
      }

      const data = await parseResponse(res);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load lost and found items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(id);
      setError("");

      const res = await fetch(`${API}/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ status }),
      });

      const data = await parseResponse(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to update item");
      }

      fetchItems();
    } catch (err) {
      setError(err.message || "Failed to update item status");
    } finally {
      setActionLoading("");
    }
  };

  const deleteItem = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await parseResponse(res);
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete item");
      }

      fetchItems();
    } catch (err) {
      setError(err.message || "Failed to delete item");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="manage-lost-found-page">
      <div className="manage-lost-found-shell">
        <header className="manage-lost-found-header">
          <h2>Lost & Found Admin</h2>
          <p>Mark items as claimed or remove them once the owner is found.</p>
        </header>

        <div className="manage-lost-found-stats">
          <div className="lost-found-stat-card">
            <span>Total Items</span>
            <strong>{items.length}</strong>
          </div>
          <div className="lost-found-stat-card">
            <span>Claimed</span>
            <strong>{items.filter((item) => item.status === "Claimed").length}</strong>
          </div>
          <button type="button" className="lost-found-refresh-btn" onClick={fetchItems}>
            Refresh
          </button>
        </div>

        {error && <p className="lost-found-error">{error}</p>}
        {loading && <p className="lost-found-loading">Loading items...</p>}

        {!loading && items.length === 0 && (
          <div className="lost-found-empty">
            <h3>No items posted yet</h3>
            <p>New lost and found posts will appear here.</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="lost-found-table-wrap">
            <table className="lost-found-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td className="lost-found-item-cell">
                      <strong>{item.title}</strong>
                      <p>{item.category} · {item.location}</p>
                      <span>{item.description}</span>
                    </td>
                    <td>
                      <span className={item.itemType === "Lost" ? "type-tag lost" : "type-tag found"}>
                        {item.itemType}
                      </span>
                      {item.image ? (
                        <img
                          className="lost-found-thumb"
                          src={`http://localhost:5000/${item.image}`}
                          alt={item.title}
                        />
                      ) : null}
                    </td>
                    <td className="lost-found-contact-cell">
                      <div>{item.contactName}</div>
                      <a href={`mailto:${item.contactEmail}`}>{item.contactEmail}</a>
                      <a href={`tel:${item.contactPhone}`}>{item.contactPhone}</a>
                    </td>
                    <td>
                      <span className={item.status === "Claimed" ? "status-tag claimed" : "status-tag open"}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="lost-found-actions">
                        <button
                          type="button"
                          className="status-btn"
                          onClick={() => updateStatus(item._id, "Claimed")}
                          disabled={actionLoading === item._id || item.status === "Claimed"}
                        >
                          {actionLoading === item._id ? "Saving..." : "Mark Claimed"}
                        </button>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => deleteItem(item._id)}
                          disabled={actionLoading === item._id}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLostFound;