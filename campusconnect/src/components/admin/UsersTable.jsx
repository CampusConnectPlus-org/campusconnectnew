import React from "react";
import { useEffect, useState } from "react";
import "./UsersTable.css";
import AddUserModal from "./AddUserModel";
const UsersTable = () => {
    const [showForm,setShowForm] = useState(false);
    const [userData,setUserData] = useState([]);


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
 
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>EnrollmentNumner</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {userData.map((data) => (
            <tr key={data._id}>
              <td>{data.name}</td>
              <td>{data.email}</td>
              <td>{data.enrollmentNumber}</td>
              <td>
                <button className="edit">Edit</button>
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