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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] bg-clip-text text-transparent">
        👥 Users
      </h1>

      {users.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">No users registered.</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* ---------- TABLE (shown on sm and up) ---------- */}
          <div className="hidden sm:block overflow-x-auto">
            {/* table-fixed + column widths keep columns stable and prevent large growth */}
            <table className="min-w-full table-fixed w-full">
              <colgroup>
                <col className="w-24" />       {/* ID */}
                <col className="w-40 sm:w-48" />{/* Name */}
                <col className="w-[35%]" />    {/* Email (flexable but constrained) */}
                <col className="w-24" />       {/* Role */}
                <col className="w-36" />       {/* Actions */}
              </colgroup>

              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 sm:p-3 text-left">ID</th>
                  <th className="p-2 sm:p-3 text-left">Name</th>
                  <th className="p-2 sm:p-3 text-left">Email</th>
                  <th className="p-2 sm:p-3 text-left">Role</th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="p-2 sm:p-3 align-top">
                      <div className="max-w-[6rem] truncate text-sm" title={u.id}>
                        {u.id}
                      </div>
                    </td>

                    <td className="p-2 sm:p-3 align-top">
                      {/* truncated name so it doesn't expand column */}
                      <div className="max-w-[10rem] truncate font-medium" title={`${u.firstName} ${u.lastName}`}>
                        {u.firstName} {u.lastName}
                      </div>
                    </td>

                    <td className="p-2 sm:p-3 align-top">
                      <div className="max-w-[22rem] truncate text-sm text-gray-700" title={u.email}>
                        {u.email}
                      </div>
                    </td>

                    <td className="p-2 sm:p-3 align-top capitalize">
                      <div className="text-sm">{u.role}</div>
                    </td>

                    <td className="p-2 sm:p-3 align-top">
                      <div className="flex flex-wrap gap-2">
                        {u.role !== "admin" ? (
                          <button
                            onClick={() => changeRole(u.id, "admin")}
                            className="px-3 py-1 rounded-lg shadow bg-[var(--accent)] text-white hover:opacity-90 transition text-xs sm:text-sm"
                          >
                            Promote
                          </button>
                        ) : (
                          <button
                            onClick={() => changeRole(u.id, "user")}
                            className="px-3 py-1 rounded-lg shadow bg-red-500 text-white hover:bg-red-600 transition text-xs sm:text-sm"
                          >
                            Demote
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                          className="px-3 py-1 rounded-lg shadow bg-[var(--brand)] text-white hover:opacity-90 transition text-xs sm:text-sm"
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

          {/* ---------- MOBILE: card/list view (shown under sm) ---------- */}
          <div className="sm:hidden p-3 space-y-3">
            {users.map((u) => (
              <div key={u.id} className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate" title={`${u.firstName} ${u.lastName}`}>
                      {u.firstName} {u.lastName}
                    </div>
                    <div className="text-xs text-gray-600 break-all" title={u.email}>
                      {u.email}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-semibold">ID: </span>
                      <span className="break-all">{u.id}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-700 capitalize">{u.role}</div>
                </div>

                <div className="mt-3 flex gap-2 flex-wrap">
                  {u.role !== "admin" ? (
                    <button
                      onClick={() => changeRole(u.id, "admin")}
                      className="px-3 py-1 rounded-lg shadow bg-[var(--accent)] text-white hover:opacity-90 transition text-xs"
                    >
                      Promote
                    </button>
                  ) : (
                    <button
                      onClick={() => changeRole(u.id, "user")}
                      className="px-3 py-1 rounded-lg shadow bg-red-500 text-white hover:bg-red-600 transition text-xs"
                    >
                      Demote
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                    className="px-3 py-1 rounded-lg shadow bg-[var(--brand)] text-white hover:opacity-90 transition text-xs"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
