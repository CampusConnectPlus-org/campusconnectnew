import React, { useEffect, useState } from "react";
import "./Feed.css";

const API = "http://localhost:5000";

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const getInitials = (name = "U") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
};

const REACTIONS = ["👍", "❤️", "🔥", "🙌", "💡"];

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [reportPostId, setReportPostId] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [postError, setPostError] = useState("");
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });
  const [reactions, setReactions] = useState({});
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [postSuccess, setPostSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [polls, setPolls] = useState({});

  // ====== FETCH POSTS ======
  const fetchPosts = async (search = "", tag = "") => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (tag) params.append("tag", tag);
    try {
      const res = await fetch(`${API}/api/feed/all?${params}`);
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  // ====== SEARCH ======
  const handleSearch = () => fetchPosts(searchQuery, searchTag);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchTag("");
    setActiveTab("all");
    setShowBookmarksOnly(false);
    fetchPosts();
  };

  // ====== RECOMMENDATIONS ======
  const fetchRecommendations = async (tagString) => {
    if (!tagString.trim()) { setRecommendations([]); return; }
    try {
      const res = await fetch(`${API}/api/feed/related?tags=${tagString}`);
      const data = await res.json();
      setRecommendations(data);
    } catch (e) {}
  };

  // ====== CREATE POST ======
  const handleCreatePost = async () => {
    if (!content.trim() && !image) {
      setPostError("Write something or upload an image.");
      return;
    }
    setPostError("");
    const formData = new FormData();
    formData.append("content", content);
    formData.append("tags", tags);
    if (image) formData.append("image", image);

    const res = await fetch(`${API}/api/feed/create`, {
      method: "POST",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      setPostError(data.message || "Post blocked.");
      return;
    }
    setContent("");
    setTags("");
    setImage(null);
    setImagePreview(null);
    setRecommendations([]);
    setCharCount(0);
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 2500);
    fetchPosts();
  };

  // ====== LIKE ======
  const handleLike = async (id) => {
    await fetch(`${API}/api/feed/like/${id}`, {
      method: "PUT",
      headers: authHeader(),
    });
    fetchPosts(searchQuery, searchTag);
  };

  // ====== REACTIONS ======
  const handleReaction = (postId, emoji) => {
    setReactions((prev) => {
      const current = prev[postId];
      if (current === emoji) {
        const updated = { ...prev };
        delete updated[postId];
        return updated;
      }
      return { ...prev, [postId]: emoji };
    });
  };

  // ====== BOOKMARKS ======
  const toggleBookmark = (postId) => {
    setBookmarks((prev) => {
      const updated = prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId];
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  // ====== REPORT ======
  const handleReport = async () => {
    if (!reportReason.trim()) return;
    await fetch(`${API}/api/report/create`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ postId: reportPostId, reason: reportReason }),
    });
    setReportPostId(null);
    setReportReason("");
  };

  // ====== COMMENTS ======
  const toggleComments = async (postId) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    if (!comments[postId]) {
      const res = await fetch(`${API}/api/comments/${postId}`);
      const data = await res.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    }
  };

  const handleAddComment = async (postId) => {
    const text = newComments[postId];
    if (!text?.trim()) return;
    const res = await fetch(`${API}/api/comments/add`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ postId, text }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.message || "Comment blocked."); return; }
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
    const r2 = await fetch(`${API}/api/comments/${postId}`);
    const updated = await r2.json();
    setComments((prev) => ({ ...prev, [postId]: updated }));
  };

  // ====== POLL VOTE ======
  const handlePollVote = (postId, option) => {
    setPolls((prev) => ({ ...prev, [postId]: option }));
  };

  // ====== IMAGE ======
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ====== FILTER POSTS ======
  const displayedPosts = posts.filter((p) => {
    if (showBookmarksOnly) return bookmarks.includes(p._id);
    return true;
  });

  return (
    <div className="feed-root">
      {/* HEADER */}
      <div className="feed-header">
        <div className="feed-header-inner">
          <div className="feed-brand">
            <div className="feed-brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h1 className="feed-title">Campus Feed</h1>
              <p className="feed-subtitle">Ask, share & connect with your campus</p>
            </div>
          </div>
          <div className="feed-tabs">
            <button
              className={`tab-btn ${activeTab === "all" && !showBookmarksOnly ? "tab-active" : ""}`}
              onClick={() => { setActiveTab("all"); setShowBookmarksOnly(false); fetchPosts(); }}
            >All Posts</button>
            <button
              className={`tab-btn ${activeTab === "advice" ? "tab-active" : ""}`}
              onClick={() => { setActiveTab("advice"); setShowBookmarksOnly(false); fetchPosts("", "advice"); }}
            >💬 Advice</button>
            <button
              className={`tab-btn ${activeTab === "question" ? "tab-active" : ""}`}
              onClick={() => { setActiveTab("question"); setShowBookmarksOnly(false); fetchPosts("", "question"); }}
            >❓ Questions</button>
            <button
              className={`tab-btn ${showBookmarksOnly ? "tab-active" : ""}`}
              onClick={() => setShowBookmarksOnly(true)}
            >🔖 Saved</button>
          </div>
        </div>
      </div>

      <div className="feed-body">
        {/* SEARCH */}
        <div className="search-card">
          <div className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            className="search-input"
            placeholder="Search posts, questions, advice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <input
            className="tag-filter-input"
            placeholder="Tag filter"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
          />
          <button className="btn-search" onClick={handleSearch}>Search</button>
          <button className="btn-clear" onClick={clearSearch}>✕</button>
        </div>

        {/* COMPOSE */}
        <div className="compose-card">
          <div className="compose-header">
            <div className="user-avatar compose-avatar">Y</div>
            <div className="compose-placeholder-text">
              Got a question? Need advice? Share it here!
            </div>
          </div>
          <textarea
            className="compose-textarea"
            placeholder="What's on your mind? Ask a question, share advice, or start a discussion..."
            value={content}
            maxLength={500}
            onChange={(e) => { setContent(e.target.value); setCharCount(e.target.value.length); }}
          />
          {imagePreview && (
            <div className="img-preview-wrap">
              <img src={imagePreview} className="img-preview" alt="preview" />
              <button className="img-remove-btn" onClick={() => { setImage(null); setImagePreview(null); }}>✕</button>
            </div>
          )}
          {recommendations.length > 0 && (
            <div className="recs-box">
              <p className="recs-label">Related posts on this topic</p>
              {recommendations.map((r) => (
                <div key={r._id} className="rec-item">
                  <span className="rec-name">{r.userId?.name}</span>
                  <p className="rec-content">{r.content?.slice(0, 80)}...</p>
                  <div className="rec-tags">
                    {r.tags?.map((t, i) => <span key={i} className="rec-tag">#{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}
          {postError && <div className="post-error">⚠️ {postError}</div>}
          {postSuccess && <div className="post-success">✓ Post shared successfully!</div>}
          <div className="compose-footer">
            <input
              className="tags-input"
              placeholder="Tags: advice, question, placement..."
              value={tags}
              onChange={(e) => { setTags(e.target.value); fetchRecommendations(e.target.value); }}
            />
            <div className="compose-actions">
              <span className={`char-count ${charCount > 450 ? "char-warn" : ""}`}>
                {500 - charCount}
              </span>
              <label className="btn-icon" title="Add image">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="m21 15-5-5L5 21"/>
                </svg>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
              </label>
              <button className="btn-post" onClick={handleCreatePost}>Post</button>
            </div>
          </div>
        </div>

        {/* POSTS */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading posts...</p>
          </div>
        ) : displayedPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No posts yet</p>
            <p className="empty-sub">Be the first to share something!</p>
          </div>
        ) : (
          displayedPosts.map((post) => (
            <div key={post._id} className="post-card">
              {/* POST HEADER */}
              <div className="post-header">
                <div className="user-avatar post-avatar">
                  {getInitials(post.userId?.name)}
                </div>
                <div className="post-meta">
                  <span className="post-author">{post.userId?.name || "User"}</span>
                  <span className="post-time">{timeAgo(post.createdAt)}</span>
                </div>
                <div className="post-header-actions">
                  <button
                    className={`bookmark-btn ${bookmarks.includes(post._id) ? "bookmarked" : ""}`}
                    onClick={() => toggleBookmark(post._id)}
                    title="Save post"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarks.includes(post._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* POST BODY */}
              <p className="post-content">{post.content}</p>

              {post.image && (
                <img src={`${API}/uploads/${post.image}`} className="post-image" alt="" />
              )}

              {/* TAGS */}
              {post.tags?.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, i) => (
                    <button
                      key={i}
                      className="post-tag"
                      onClick={() => { setSearchTag(tag); fetchPosts("", tag); }}
                    >#{tag}</button>
                  ))}
                </div>
              )}

              {/* REACTIONS */}
              <div className="reactions-bar">
                {REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    className={`reaction-btn ${reactions[post._id] === emoji ? "reaction-active" : ""}`}
                    onClick={() => handleReaction(post._id, emoji)}
                  >{emoji}</button>
                ))}
              </div>

              {/* POST ACTIONS */}
              <div className="post-actions">
                <button className="action-btn like-btn" onClick={() => handleLike(post._id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {post.likes.length} Likes
                </button>
                <button className="action-btn comment-btn" onClick={() => toggleComments(post._id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  {openComments[post._id] ? "Hide" : "Comment"}
                </button>
                <button className="action-btn share-btn" onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  Share
                </button>
                <button className="action-btn report-btn" onClick={() => setReportPostId(post._id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
                  </svg>
                  Report
                </button>
              </div>

              {/* COMMENTS */}
              {openComments[post._id] && (
                <div className="comments-section">
                  {comments[post._id]?.length === 0 && (
                    <p className="no-comments">No comments yet. Be first!</p>
                  )}
                  {comments[post._id]?.map((c) => (
                    <div key={c._id} className="comment-item">
                      <div className="comment-avatar user-avatar">
                        {getInitials(c.userId?.name)}
                      </div>
                      <div className="comment-body">
                        <span className="comment-author">{c.userId?.name || "User"}</span>
                        <p className="comment-text">{c.text}</p>
                      </div>
                    </div>
                  ))}
                  <div className="comment-input-row">
                    <div className="comment-avatar user-avatar" style={{ fontSize: "12px" }}>Y</div>
                    <input
                      className="comment-input"
                      placeholder="Write a comment..."
                      value={newComments[post._id] || ""}
                      onChange={(e) =>
                        setNewComments((prev) => ({ ...prev, [post._id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment(post._id)}
                    />
                    <button className="comment-send-btn" onClick={() => handleAddComment(post._id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* REPORT MODAL */}
      {reportPostId && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setReportPostId(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Report Post</h3>
              <button className="modal-close" onClick={() => setReportPostId(null)}>✕</button>
            </div>
            <p className="modal-sub">Help us understand what's wrong with this post.</p>
            <div className="report-quick-btns">
              {["Offensive content", "Spam", "Misinformation", "Harassment"].map((r) => (
                <button
                  key={r}
                  className={`report-quick-btn ${reportReason === r ? "report-quick-active" : ""}`}
                  onClick={() => setReportReason(r)}
                >{r}</button>
              ))}
            </div>
            <textarea
              className="report-textarea"
              placeholder="Add more details (optional)..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setReportPostId(null)}>Cancel</button>
              <button className="btn-report-submit" onClick={handleReport}>Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
