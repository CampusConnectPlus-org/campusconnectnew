import { useState } from "react";

function AddAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: null,
    role: "admin"
  });

  const handleChange = (e) => {
    // setForm({ ...form, [e.target.name]: e.target.value });
      if (e.target.name === "profileImage") {
    setForm({ ...form, profileImage: e.target.files[0] });
  } else {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
console.log("Submitting form with data:", form);
try{
 const token = localStorage.getItem("token");
 console.log("Token in AddAdmin handleSubmit:", token);
  const formToSend = new FormData();
    formToSend.append("name", form.name);
    formToSend.append("email", form.email);
    formToSend.append("password", form.password);
    formToSend.append("role", form.role);
    formToSend.append("profileImage", form .profileImage);

      const res = await fetch("http://localhost:5000/api/admin/addAdmin", {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: formToSend
    });

      const data = await res.json();
    console.log(data.message);
    console.log("Response status:", res.status);


    if(res.ok){
      alert("Admin Added ✅");
      setForm({
        name: "",
        email: "",
        password: "",
        profileImage: null,
        role: "admin"
      });
    } else {
      alert("Failed to add admin: " + data.message);
    }
}
   catch (error) {
    console.error("Error adding admin:", error);
    // alert("An error occurred while adding the admin.");

   
   }
  };

  
  

  return (
    <div>
      <h2>Add New Admin</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
           <input
            type="file" 
            name="profileImage" 
            placeholder="Upload Image" 
            onChange={handleChange} />

             

        <button type="submit">Add Admin</button>
      </form>
    </div>
  );
}

export default AddAdmin;