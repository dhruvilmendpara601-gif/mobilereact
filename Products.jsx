import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Products({ addToCart, addOrder, user }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Error fetching products:", err));
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      alert("⚠️ Please sign in or register first!");
      return;
    }
    addToCart(product);
    alert(`${product.name} added to cart ✔`);
  };

  // ⭐ Buy Now → Add order → Save → Redirect to /order
  const handleBuyNow = (product) => {
    if (!user) {
      alert("⚠️ Please sign in or register first!");
      return;
    }

    const orderData = {
      ...product,
      qty: 1,
      date: new Date().toLocaleString(),
      status: "Confirmed",
      image: product.image,
    };

    // Save order in App.jsx state
    addOrder(orderData);

    // Save in localStorage also
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = [...savedOrders, orderData];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    alert(` Order placed for ${product.name}! Redirecting...`);

    navigate("/order");
  };

  return (
    <div className=" p-1  xt-center">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-50">
        {products.map((product) => (
          <div
            key={product._id}
            className="border h-60 w-60 p-4 rounded-xl shadow-md hover:shadow-xl transition"
          >
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="w-full h-60 object-cover rounded-md mb-3"
              onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
            />

            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700 mb-3">₹{product.price}</p>

            <button
              onClick={() => handleAddToCart(product)}
              className="bg-green-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-700"
            >
              Add to Cart
            </button>

            <button
              onClick={() => handleBuyNow(product)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
