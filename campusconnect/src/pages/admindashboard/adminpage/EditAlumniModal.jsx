
import { useEffect, useState } from "react";
import "./AddAlumniModal.css";

const EditAlumniModal = ({  onUpdate, onClose,editingAlumni ,setEditingAlumni, alumni,  }) => {
  if (!editingAlumni) return null;

 
 
 
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    batch: "",
    desc: "",
    email: "",
    linkedin: "",
    image: null,
  });
   const [image, setImage] = useState(null);

   useEffect(() =>{
    // fetchAlumni();
if(alumni){
    console.log(alumni)
    setFormData({
        name: alumni.name || "",
        role: alumni.role || "",
        batch: alumni.batch || "",
        desc: alumni.desc || "",
        email: alumni.email || "",
        linkedin: alumni.linkedin || "",
        image: null,
    });
   } },[alumni]);
  const handleChange = (e) => {
    const {name, value, files} = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
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
    if(formData.image){
        dataToSend.append("image", formData.image);
    }
 

    const response = await fetch(`http://localhost:5000/admin/update/${alumni._id}`, {
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
      alert("Alumni Added ✅");
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
        <h2>Edit Alumni</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          <input name="role" placeholder="Role" value={formData.role} onChange={handleChange} />
          <input name="batch" placeholder="Batch" value={formData.batch} onChange={handleChange} />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} />
          <textarea className="desc" name="desc" placeholder="Description" value={formData.desc} onChange={handleChange}></textarea>
          
          <div className="image-section">
            <label htmlFor="image">Upload New Image:</label>
            <input type="file" id="image" name="image" accept="image/*" onChange={handleChange} />
            {/* {alumni.image && (
              <div className="current-image">
                <p>Current Image:</p>
                <img src={`http://localhost:5000/alumniimage/${alumni.image}`} alt={alumni.name} />
              </div>
            )} */}
          </div>

          <button type="submit" className="add-btn">
            Update Alumni
          </button>
          <button type="button" onClick={() => setEditingAlumni(false)} className="add-btn">
            Cancel
            </button>
        </form>
      </div>
    </div>
  );
};

export default EditAlumniModal;