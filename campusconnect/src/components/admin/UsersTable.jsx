import React from "react";
import { useEffect, useState } from "react";
import "./UsersTable.css";
import AddUserModal from "./AddUserModel";
// import EditUser from "../../pages/admindashboard/manageuser/EditUser";
import EditUserModal from "./EditUserModal";

const UsersTable = () => {
    const [showForm,setShowForm] = useState(false);
    const [userData,setUserData] = useState([]);
    const [editUser,setEditUser] = useState(false);


    const fetchUsers = async () => {
        try {
          const token = localStorage.getItem("token");
            const res = await fetch('http://localhost:5000/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log(data);
            setUserData(data);
            setEditUser(false); // close edit modal after update

        } catch (err) {
            console.error(err);
        }
    };

  useEffect(() => {
    fetchUsers();
}, []);

const deleteUser = async (id) => {
    try {
       const token = localStorage.getItem("token");
       const res =  await fetch(`http://localhost:5000/admin/users/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // UI update (important)
        setUserData(userData.filter(userData => userData._id !== id));

    } catch (err) {
        console.error(err);
    }
};

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Users List</h3>
        <button onClick={() => setShowForm(true)}>Add User</button>
      </div>
         {editUser && <EditUserModal 
            editUser={editUser}
             setEditUser={setEditUser}  
             userData={editUser}
             onUpdate={fetchUsers}
             onClose={() => setEditUser(false)}
             />}
 
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
            <td>EnrollmentNumber</td>
            <td>Actions</td>
          </tr>
        </thead>

        <tbody>
          {userData.map((data) => (
            <tr key={data._id}>
              <td>{data.name}</td>
              <td>{data.email}</td>
              <td>{data.enrollmentNumber}</td>
              <td>
                <button className="edit" onClick={ () =>{setEditUser(data)}}>Edit</button>
                <button onClick={() =>  deleteUser(data._id) } className="delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddUserModal showForm={showForm} setShowForm={setShowForm}  fetchUsers={fetchUsers}/>
    </div>
  );
};

export default UsersTable;