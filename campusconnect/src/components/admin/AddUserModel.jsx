import { useState } from "react";
import "./AddUserModal.css";

const AddUserModal = ({ showForm, setShowForm, fetchUsers }) => {
  if(!showForm) return null;
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    email: "",
    password: "",
    profileImage: null,
    role: "user"
  });
 

  const handleChange = (e) => {
    
    // setFormData({ ...formData, [e.target.name]: e.target.value });
  
  if (e.target.name === "profileImage") {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  } else {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }


  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("sending data",formData)
     try {
        const token = localStorage.getItem("token");
        console.log("TOKEN", token);
         const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("enrollmentNumber", formData.enrollmentNumber);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("profileImage", formData.profileImage);
        const res = await fetch('http://localhost:5000/admin/users', {
            method: "POST",
            headers: {
                // "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            // body: JSON.stringify(formData)
             body: formDataToSend
        });


        const data = await res.json();
          console.log("status", res.status)
        console.log("response",data);
      

        if (res.ok) {
            alert("User Added ✅");

            // optional: reset form
            setFormData({
                name: "",
                enrollmentNumber: "",
                email: "",
                password: "",
                profileImage: null,
                role: "user",
            });
            // refresh list
            fetchUsers();
            setShowForm(false); //modal close          
        }else{
          alert(data.message || "Error adding user");
        };
} 
catch (err) {
        console.error(err);
    }
    //   refreshUsers();
    // closeModal();

 
   
  };


  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add User</h2>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
           <input name="enrollmentNumber" placeholder="enrollmentNumber" value={formData.enrollmentNumber} onChange={handleChange} />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <input  type="file" name="profileImage" placeholder="Upload Image" onChange={handleChange} />

          <select name="role" onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="add-btn">Add</button>
          <button type="button" onClick={() => setShowForm(false)} className="add-btn">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;