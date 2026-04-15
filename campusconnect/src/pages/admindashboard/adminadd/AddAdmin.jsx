import { useState } from "react";

function AddAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: null,
    role: "admin",
  });

  const [accessPassword, setAccessPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessError, setAccessError] = useState("");

  // handle input change
  const handleChange = (e) => {
    if (e.target.name === "profileImage") {
      setForm({ ...form, profileImage: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // access password check
  const handleAccessSubmit = (e) => {
    e.preventDefault();

    if (accessPassword === "123456") {
      setIsAuthorized(true);
      setAccessError("");
      setAccessPassword("");
    } else {
      setAccessError("Incorrect password. Try again.");
    }
  };

  // submit admin form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const formToSend = new FormData();
      formToSend.append("name", form.name);
      formToSend.append("email", form.email);
      formToSend.append("password", form.password);
      formToSend.append("role", form.role);

      if (form.profileImage) {
        formToSend.append("profileImage", form.profileImage);
      }

      const res = await fetch(
       "http://localhost:5000/api/auth/addAdmin",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // optional (agar backend me use ho raha ho)
          },
          body: formToSend,
        }
      );

      const data = await res.json();

      console.log("Response:", data);

      if (res.ok) {
        alert("Admin Added ✅");

        setForm({
          name: "",
          email: "",
          password: "",
          profileImage: null,
          role: "admin",
        });
      } else {
        alert("Failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h2>Add New Admin</h2>

      {!isAuthorized ? (
        <form onSubmit={handleAccessSubmit}>
          <p>Enter access password:</p>

          <input
            type="password"
            placeholder="Enter password"
            value={accessPassword}
            onChange={(e) => setAccessPassword(e.target.value)}
            required
          />

          <button type="submit">Unlock</button>

          {accessError && <p style={{ color: "red" }}>{accessError}</p>}
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="file"
            name="profileImage"
            onChange={handleChange}
          />

          <button type="submit">Add Admin</button>
        </form>
      )}
    </div>
  );
}

export default AddAdmin;