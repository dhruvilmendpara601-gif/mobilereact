import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (!storedAdmin) {
      navigate("/admin/login");
    } else {
      setAdmin(storedAdmin);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/*  Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>

        <nav className="space-y-4">
          <Link
            to="/admin"
            className="block bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className="block bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Manage Users
          </Link>

          <Link
            to="/admin/products"
            className="block bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Manage Products
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-center"
        >
          Logout
        </button>
      </aside>

      {/*  Main Content */}
      <main className="flex-1 p-8">

        <h1 className="text-3xl font-bold">Dashboard</h1>
        {admin && (
          <p className="text-gray-700 mt-2">Welcome, {admin.name}</p>
        )}

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

          {/* Users Card */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-gray-600 mb-4">Manage registered users.</p>
            <Link
              to="/admin/users"
              className="text-blue-600 font-medium hover:underline"
            >
              View Users →
            </Link>
          </div>

          {/* Products Card */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            <p className="text-gray-600 mb-4">Manage store products.</p>
            <Link
              to="/admin/products"
              className="text-green-600 font-medium hover:underline"
            >
              View Products →
            </Link>
          </div>

          {/* Orders Card (Coming soon) */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Orders</h2>
            <p className="text-gray-600 mb-4">Manage customer orders.</p>
            <button className="text-gray-400 cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
