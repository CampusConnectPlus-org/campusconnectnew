import React from 'react'
import { useEffect, useState } from 'react'
import "./AlumniRecord.css";
import AddAlumniModal from './AddAlumniModal';
const AlumniRecord = () => {
   const [showForm,setShowForm] = useState(false);
 const [alumni, setAlumni] = useState([]);
 
   const fetchAlumni = async () => {
          try {
            const token = localStorage.getItem("token");
              const res = await fetch('http://localhost:5000/alumni', {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });
  
              const data = await res.json();
              console.log(data);
              setAlumni(data);
  
          } catch (err) {
              console.error(err);
          }
      };
  
    useEffect(() => {
      fetchAlumni();
  }, []);

  const deleteAlumni = async (id) => {
    console.log
    try {
       const token = localStorage.getItem("token");
       const res =  await fetch(`http://localhost:5000/admin/alumni/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
         console.log(res);
         if (!res.ok) {
            throw new Error('Failed to delete alumni');
        }
        // UI update (important)
        setAlumni(alumni.filter(alumni => alumni._id !== id));
        

    } catch (err) {
        console.error(err);
    }
};
  return (
    <div>
       <div className="table-header">
        <h3>ALUMNI DATA</h3>
        {/* <button onClick={() => setShowForm(true)}>ADD ALUMNI</button> */}
        <button onClick={() => { setShowForm(true);}}>
  Add Alumni
</button>
      </div>
      {showForm && <AddAlumniModal showForm={showForm} setShowForm={setShowForm}  fetchAlumni={fetchAlumni}/>}
     <table>
        <thead>
          <tr >
          
            <td>Name</td>
            <td>Batch</td>
            <td>Role</td>
            {/* <td>Email</td> */}
          </tr>
        </thead>

        <tbody>
          {alumni.map((alumni) => (
            <tr key={alumni._id}>
              <td>{alumni.name}</td>
              <td>{alumni.batch}</td>
              <td>{alumni.role}</td>
              <td>
                <button className="edit">Edit</button>
                <button onClick={(e) => {
                  console.log("Delete button clicked for alumni with id:", alumni._id);
                  console.log(e.target)
                   deleteAlumni(alumni._id)
                } } className="delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  )
}

export default AlumniRecord
