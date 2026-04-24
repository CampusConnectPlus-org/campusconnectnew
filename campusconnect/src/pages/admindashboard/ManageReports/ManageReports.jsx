import React, { useEffect, useState } from "react";

const ManageReports = () => {
  const [reports, setReports] = useState([]);

  // fetch reports
  const fetchReports = async () => {
    const res = await fetch("http://localhost:5000/api/report/all", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    const data = await res.json();
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // delete post
  const deletePost = async (postId) => {
    await fetch(`http://localhost:5000/api/feed/delete/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    // refresh after delete
    fetchReports();
  };

  return (
    <div>
      <h2>Manage Reports</h2>

      {reports.length === 0 && <p>No reports found</p>}

      {reports.map((report) => (
        <div key={report._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          
          <p><strong>Post:</strong> {report.postId?.content}</p>
          <p><strong>Reason:</strong> {report.reason}</p>

          <button onClick={() => deletePost(report.postId._id)}>
            Delete Post
          </button>
        </div>
      ))}
    </div>
  );
};

export default ManageReports;