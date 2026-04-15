
import { useEffect, useState } from "react";
// import "./AddAlumniModal.css";

const EditUserModal = ({  onUpdate, onClose,editUser ,setEditUser, userData,  }) => {
  if (!editUser) return null;

 
 
 
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNumber: "",
    email: "",
    role: "",
    password: "",
    profileImage: null,
  });
   const [profileImage, setProfileImage] = useState(null);

   useEffect(() =>{
    // fetchAlumni();
if(userData){
    console.log(userData)
    setFormData({
        name: userData.name || "",
        role: userData.role || "",
        enrollmentNumber: userData.enrollmentNumber || "",  
        email: userData.email || "",
        password: "" || "",
        profileImage: null,
    });
   } },[userData]);
  const handleChange = (e) => {
    const {name, value, files} = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    }
    else{
        setFormData({ ...formData, [name]: value });
    }
    // if (e.target.name === "image") {
    //   setFormData({ ...formData, image: e.target.files[0] });
    // } else {
    // //   setFormData({ ...formData, [e.target.name]: e.target.value });
    //  setFormData({ ...formData, [name]: value });
    // }

    // setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// UPDATE ALUMNI
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);
try{
    const token = localStorage.getItem("token");

    const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
    dataToSend.append("role", formData.role);
    dataToSend.append("batch", formData.batch);
    dataToSend.append("desc", formData.desc);
    dataToSend.append("email", formData.email);
    dataToSend.append("linkedin", formData.linkedin);
    // dataToSend.append("image", formData.image);
    if(formData.profileImage){
        dataToSend.append("image", formData.profileImage);
    }
 

    const response = await fetch(`http://localhost:5000/admin/update/${userData._id}`, {
      method: "PUT",
      headers: {
        // "content-type": "application/json",
        Authorization: `Bearer ${token}`

      },
      body: dataToSend
    });
     
    const data = await response.json();

    console.log(data)
      console.log("status", response.status)
        console.log("response",data);
    // console.log(data)
    
      

    if (response.ok) {
      alert("User Updated ✅");
    //   setAlumniFormData({
    //             name: "",
    //             role: "",
    //             batch: "",
    //             desc: "",
    //             email: "",
    //             linkedin: "",
    //             image: null,
               
    //         });
    onUpdate(); // refresh alumni list in parent component
    onClose(); // close the modal   
    //   fetchAlumni();
    //   setShowForm(false);
    } else {
      alert(data.msg);
    };
  }
  catch(err){
    console.log("Error submitting form:", err);
  }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input name="enrollmentNumber" placeholder="Enrollment Number" value={formData.enrollmentNumber} onChange={handleChange} />
          <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} />
          
          <div className="image-section">
            <label htmlFor="profileImage">Upload New Image:</label>
            <input type="file" id="profileImage" name="profileImage" accept="image/*" onChange={handleChange} />
            {/* {alumni.image && (
              <div className="current-image">
                <p>Current Image:</p>
                <img src={`http://localhost:5000/alumniimage/${alumni.image}`} alt={alumni.name} />
              </div>
            )} */}
          </div>

          <button type="submit" className="add-btn">
            Update User
          </button>
          <button type="button" onClick={() => setEditUser(false)} className="add-btn">
            Cancel
            </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;