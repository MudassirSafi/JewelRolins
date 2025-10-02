// src/pages/Admin/UserDetail.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAllUsers } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const users = getAllUsers();
    const found = users.find((u) => u.id.toString() === id.toString());
    setUser(found);
  }, [id, getAllUsers]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-6 text-center">
        <h2 className="text-xl font-semibold mb-4 text-red-500">
          ⚠️ User not found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-6">
      <h2
        className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] bg-clip-text text-transparent"
      >
        User Details
      </h2>

      <div className="space-y-3 text-sm sm:text-base">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg shadow font-semibold bg-[var(--brand)] text-white hover:opacity-90 transition"
        >
          ⬅ Back to Users
        </button>
      </div>
    </div>
  );
}
