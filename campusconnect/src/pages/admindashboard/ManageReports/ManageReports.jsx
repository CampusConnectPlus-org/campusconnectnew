import React, { useEffect, useState } from "react";
import "./ManageReports.css";

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  // fetch reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/report/all", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load reports right now");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // delete post
  const deletePost = async (postId, reportId) => {
    if (!postId) {
      setError("Post no longer exists for this report. Use Remove Report.");
      return;
    }

    try {
      setError("");
      setActionLoading(reportId);

      const res = await fetch(`http://localhost:5000/api/feed/delete/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete post");
      }

      // Remove the current report card after deleting the post.
      const reportDeleteRes = await fetch(`http://localhost:5000/api/report/${reportId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      if (!reportDeleteRes.ok) {
        const data = await reportDeleteRes.json().catch(() => ({}));
        throw new Error(data.message || "Post deleted but report cleanup failed");
      }

      fetchReports();
    } catch (err) {
      setError(err.message || "Failed to delete post");
    } finally {
      setActionLoading("");
    }
  };

  const deleteReportOnly = async (reportId) => {
    try {
      setError("");
      setActionLoading(reportId);

      const res = await fetch(`http://localhost:5000/api/report/${reportId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete report");
      }

      fetchReports();
    } catch (err) {
      setError(err.message || "Failed to delete report");
    } finally {
      setActionLoading("");
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="manage-reports-page">
      <div className="manage-reports-shell">
        <header className="manage-reports-header">
          <h2>Manage Reports</h2>
          <p>Review reported feed posts and take moderation action quickly.</p>
        </header>

        <div className="manage-reports-stats">
          <div className="reports-stat-card">
            <span>Total Reports</span>
            <strong>{reports.length}</strong>
          </div>
          <button type="button" className="reports-refresh-btn" onClick={fetchReports}>
            Refresh
          </button>
        </div>

        {error && <p className="reports-error">{error}</p>}
        {loading && <p className="reports-loading">Loading reports...</p>}

        {!loading && reports.length === 0 && (
          <div className="reports-empty">
            <h3>No reports found</h3>
            <p>All clear right now. New reports will appear here.</p>
          </div>
        )}

        {!loading && reports.length > 0 && (
          <div className="reports-table-wrap">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Post</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Reported On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => {
                  const hasPost = Boolean(report.postId?._id);
                  return (
                    <tr key={report._id}>
                      <td>{index + 1}</td>
                      <td className="report-post-cell">
                        {report.postId?.content || report.originalContent || "Post content not available"}
                      </td>
                      <td className="report-reason-cell">{report.reason || "No reason provided"}</td>
                      <td>
                        <span className={`report-status ${hasPost ? "active" : "missing"}`}>
                          {hasPost ? "Post Available" : "Post Missing"}
                        </span>
                      </td>
                      <td>{formatDate(report.createdAt)}</td>
                      <td>
                        {hasPost ? (
                          <button
                            type="button"
                            className="delete-post-btn"
                            onClick={() => deletePost(report.postId?._id, report._id)}
                            disabled={actionLoading === report._id}
                          >
                            {actionLoading === report._id ? "Deleting..." : "Delete Post"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="delete-post-btn secondary"
                            onClick={() => deleteReportOnly(report._id)}
                            disabled={actionLoading === report._id}
                          >
                            {actionLoading === report._id ? "Removing..." : "Remove Report"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReports;