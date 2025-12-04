import React, { useState, useEffect } from "react";

export default function Address() {
  //  Load addresses directly from localStorage immediately
  const [addresses, setAddresses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("addresses")) || [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [editIndex, setEditIndex] = useState(null);

  //  Keep localStorage in sync whenever addresses change
  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // 📝 Update existing address
      const updated = [...addresses];
      updated[editIndex] = { ...form, active: addresses[editIndex].active };
      setAddresses(updated);
      setEditIndex(null);
      alert(" Address updated successfully!");
    } else {
      // ➕ Add new address
      const newAddress = { ...form, active: addresses.length === 0 };
      setAddresses([...addresses, newAddress]);
      alert(" Address added successfully!");
    }

    // 🧹 Reset form
    setForm({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    });
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const updated = addresses.filter((_, i) => i !== index);

      // if deleting active one → make first remaining active
      if (addresses[index].active && updated.length > 0) {
        updated[0].active = true;
      }

      setAddresses(updated);
      alert("🗑️ Address deleted successfully!");
    }
  };

  const handleEdit = (index) => {
    setForm(addresses[index]);
    setEditIndex(index);
  };

  const handleSetActive = (index) => {
    const updated = addresses.map((addr, i) => ({
      ...addr,
      active: i === index,
    }));
    setAddresses(updated);
    alert(" Active address updated!");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📍 Manage Addresses</h1>

      {/* 🧾 Address Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-8 border p-4 rounded-lg shadow">
        <input
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="street"
          value={form.street}
          onChange={handleChange}
          placeholder="Street Address"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="zip"
          value={form.zip}
          onChange={handleChange}
          placeholder="Pin Code"
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {editIndex !== null ? "Update Address" : "Save Address"}
        </button>
      </form>

      {/* 📦 Address List */}
      {addresses.length === 0 ? (
        <p className="text-gray-500 text-center">No addresses added yet 🏠</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr, index) => (
            <div
              key={index}
              className={`border p-4 rounded-lg shadow ${
                addr.active ? "border-green-500 bg-green-50" : "border-gray-200"
              }`}
            >
              <p className="font-semibold">{addr.fullName}</p>
              <p>{addr.phone}</p>
              <p>
                {addr.street}, {addr.city}, {addr.state} - {addr.zip}
              </p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleSetActive(index)}
                  className={`px-3 py-1 rounded ${
                    addr.active
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 hover:bg-green-100"
                  }`}
                >
                  {addr.active ? "Active" : "Set Active"}
                </button>

                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
