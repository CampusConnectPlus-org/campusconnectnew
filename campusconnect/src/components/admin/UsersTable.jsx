import React from "react";
import { useEffect, useState } from "react";
import "./UsersTable.css";
import AddUserModal from "./AddUserModel";
const UsersTable = () => {
    const [showForm,setShowForm] = useState(false);
    const [users,setUsers] = useState([]);


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
            setUsers(data);

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
        setUsers(users.filter(user => user._id !== id));

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
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.enrollmentNumber}</td>
              <td>
                <button className="edit">Edit</button>
                <button onClick={() =>  deleteUser(user._id) } className="delete">Delete</button>
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