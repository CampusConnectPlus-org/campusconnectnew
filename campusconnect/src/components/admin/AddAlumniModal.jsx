// import { useState } from "react";
// // import "./AddAlumniModal.css";

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
//       dataToSend.append("name", formData.name);
//     dataToSend.append("role", formData.role);
//     dataToSend.append("batch", formData.batch);
//     dataToSend.append("email", formData.email);
//     dataToSend.append("linkedin", formData.linkedin);
//     dataToSend.append("image", formData.image);
//     // Object.keys(formData).forEach((key) => {
//     //   dataToSend.append(key, formData[key]);
//     // });

//     const res = await fetch("http://localhost:5000/api/alumnis", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       body: dataToSend
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Alumni Added ✅");
//       setFormData({
//                 name: "",
//                 role: "",
//                 batch: "",
//                 desc: "",
//                 email: "",
//                 linkedin: "",
//                 image: null,
               
//             });
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