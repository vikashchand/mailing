import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/userDetails'); // Replace with your API endpoint to fetch users
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRemoveEmployee = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:5000/user/deleteuser/${employeeId}`);

      fetchUsers();
    } catch (error) {
      console.error('Error removing employee:', error);
    }
  };

  const handleToggleAccountStatus = async (userId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/user/updateuser/${userId}`, { account_status: newStatus });

      fetchUsers();
    } catch (error) {
      console.error('Error updating account status:', error);
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>UserName</th>
            <th>Email</th>
            <th>is_admin</th>
            <th>is_verified</th>
            <th>last_login</th>
            <th>account status</th>
            <th>created_at</th>
            <th>last_updated</th>
            <th>Delete</th>
            <th>Account Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ border: '1px solid black', padding: '5px' }}>{user.id}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{user.username}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{user.email}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{user.is_admin}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{user.is_verified}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{user.last_login}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{user.account_status}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{user.created_at}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>{user.updated_at}</td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                <button onClick={() => handleRemoveEmployee(user.id)}>Remove</button>
              </td>
              <td style={{ border: '1px solid black', padding: '5px' }}>
                {user.account_status === 'active' ? (
                  <button onClick={() => handleToggleAccountStatus(user.id, 'inactive')}>Set as Inactive</button>
                  ) : (
                  <button onClick={() => handleToggleAccountStatus(user.id, 'active')}>Set as Active</button>
                  )}
                  </td>
                  </tr>
                  ))}
                  </tbody>
                  </table>
                  </div>
                  );
                  };
                  
                  export default ManageUsers;
