import React, { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  // ========================
  // Fetch all products
  // ========================
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle textbox, textarea change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  // ========================
  // Add new product
  // ========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Product added successfully!");
        setForm({ name: "", price: "", description: "" });
        setImage(null);
        fetchProducts();
      } else {
        alert("Failed to add product!");
      }
    } catch (error) {
      console.log("Submit Error:", error);
    }
  };

  // ========================
  // Delete product
  // ========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Product deleted successfully!");
        setProducts(products.filter((p) => p._id !== id)); // remove instantly
      } else {
        alert("Failed to delete product!");
      }
    } catch (error) {
      console.log("Delete Error:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

      {/* Add Product */}
      <div className="bg-white p-6 rounded shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="p-2 border rounded col-span-1 sm:col-span-2"
          />

          {/* File Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="p-2 border rounded col-span-1 sm:col-span-2"
            required
          />

          <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 col-span-1 sm:col-span-2">
            Add Product
          </button>
        </form>
      </div>

      {/* Product List */}
      <h2 className="text-2xl font-semibold mb-4">All Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-5 rounded shadow">

            {/* Image */}
            <img
              src={`http://localhost:5000${p.image}`}
              alt={p.name}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/200")
              }
              className="w-full h-100 object-cover rounded"
            />

            <h3 className="text-lg font-bold mt-3">{p.name}</h3>
            <p className="text-gray-700">₹ {p.price}</p>
            <p className="text-gray-500 text-sm mt-2">{p.description}</p>

            <button
              onClick={() => handleDelete(p._id)}
              className="mt-4 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
