// import { useState } from "react";


// const AddAlumniModal = ({ show, setShow, fetchAlumni }) => {
//   if (!show) return null;

//   const [formData, setFormData] = useState({
//     name: "",
//     role: "",
//     batch: "",
//     desc: "",
//     email: "",
//     linkedin: "",
//     image: null
//   });

//   const handleChange = (e) => {
//     if (e.target.name === "image") {
//       setFormData({ ...formData, image: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");

//     const dataToSend = new FormData();
//     Object.keys(formData).forEach((key) => {
//       dataToSend.append(key, formData[key]);
//     });

//     const res = await fetch("http://localhost:5000/admin/alumni", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       body: dataToSend
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Alumni Added ✅");
//       fetchAlumni();
//       setShow(false);
//     } else {
//       alert(data.msg);
//     }
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>Add Alumni</h2>

//         <form onSubmit={handleSubmit}>
//           <input name="name" placeholder="Name" onChange={handleChange} />
//           <input name="role" placeholder="Role" onChange={handleChange} />
//           <input name="batch" placeholder="Batch" onChange={handleChange} />
//           <input name="email" placeholder="Email" onChange={handleChange} />
//           <input name="linkedin" placeholder="LinkedIn URL" onChange={handleChange} />

//           <textarea name="desc" placeholder="Description" onChange={handleChange}></textarea>

//           <input type="file" name="image" onChange={handleChange} />

//           <button type="submit">Add</button>
//           <button type="button" onClick={() => setShow(false)}>Cancel</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddAlumniModal;




import { useState } from "react";
import "./AddAlumniModal.css";

const AddAlumniModal = ({ showForm, setShowForm, fetchAlumni }) => {
  if (!showForm) return null;

  const [alumniFormData, setAlumniFormData] = useState({
    name: "",
    role: "",
    batch: "",
    desc: "",
    email: "",
    linkedin: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setAlumniFormData({ ...alumniFormData, image: e.target.files[0] });
    } else {
      setAlumniFormData({ ...alumniFormData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", alumniFormData);
try{
    const token = localStorage.getItem("token");

    const dataToSend = new FormData();
      dataToSend.append("name", alumniFormData.name);
    dataToSend.append("role", alumniFormData.role);
    dataToSend.append("batch", alumniFormData.batch);
    dataToSend.append("desc", alumniFormData.desc);
    dataToSend.append("email", alumniFormData.email);
    dataToSend.append("linkedin", alumniFormData.linkedin);
    dataToSend.append("image", alumniFormData.image);
    // Object.keys(formData).forEach((key) => {
    //   dataToSend.append(key, formData[key]);
    // });
// console.log("Data to send:", Array.from(dataToSend.entries()));
    const response = await fetch("http://localhost:5000/admin/alumni", {
      method: "POST",
      headers: {
        // "content-type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: dataToSend
    });
     
    const data = await response.json();
    // console.log(data)
      console.log("status", response.status)
        console.log("response",data);
      

    if (response.ok) {
      alert("Alumni Added ✅");
      setAlumniFormData({
                name: "",
                role: "",
                batch: "",
                desc: "",
                email: "",
                linkedin: "",
                image: null,
               
            });
      fetchAlumni();
      setShowForm(false);
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
        <h2>Add Alumni</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="role" placeholder="Role" onChange={handleChange} />
          <input name="batch" placeholder="Batch" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="linkedin" placeholder="LinkedIn URL" onChange={handleChange} />
          <textarea className="desc" name="desc" placeholder="Description" onChange={handleChange}></textarea>
          <input type="file" name="image" onChange={handleChange} />

          <button type="submit" className="add-btn">
            Add
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="add-btn">
            Cancel
            </button>
        </form>
      </div>
    </div>
  );
};

export default AddAlumniModal;