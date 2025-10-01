// src/pages/Admin/Users.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function Users() {
  const { getAllUsers, updateUserRole } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(getAllUsers());
  }, [getAllUsers]);

  const changeRole = (id, role) => {
    if (!window.confirm("Change user role?")) return;
    updateUserRole(id, role);
    setUsers(getAllUsers());
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {users.length === 0 ? (
        <div className="bg-white p-6 rounded shadow">No users registered.</div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.firstName} {u.lastName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {u.role !== "admin" ? (
                        <button onClick={() => changeRole(u.id, "admin")} className="px-3 py-1 border rounded">
                          Promote to Admin
                        </button>
                      ) : (
                        <button onClick={() => changeRole(u.id, "user")} className="px-3 py-1 border rounded text-red-600">
                          Demote to User
                        </button>
                      )}
                      <button onClick={() => alert(JSON.stringify(u, null, 2))} className="px-3 py-1 border rounded">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
