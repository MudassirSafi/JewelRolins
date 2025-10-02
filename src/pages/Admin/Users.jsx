// src/pages/Admin/Users.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const { getAllUsers, updateUserRole } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setUsers(getAllUsers());
  }, [getAllUsers]);

  const changeRole = (id, role) => {
    if (!window.confirm("Change user role?")) return;
    updateUserRole(id, role);
    setUsers(getAllUsers());
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1
        className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] bg-clip-text text-transparent"
      >
        👥 Users
      </h1>

      {users.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          No users registered.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base">
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
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {u.role !== "admin" ? (
                        <button
                          onClick={() => changeRole(u.id, "admin")}
                          className="px-3 py-1 rounded-lg shadow bg-[var(--accent)] text-white hover:opacity-90 transition"
                        >
                          Promote
                        </button>
                      ) : (
                        <button
                          onClick={() => changeRole(u.id, "user")}
                          className="px-3 py-1 rounded-lg shadow bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          Demote
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                        className="px-3 py-1 rounded-lg shadow bg-[var(--brand)] text-white hover:opacity-90 transition"
                      >
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
