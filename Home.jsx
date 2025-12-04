import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home({ user, addToCart, addOrder }) {
  const navigate = useNavigate();
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setDbProducts(data))
      .catch((err) => console.log("Home Fetch Error:", err));
  }, []);

  const checkSignIn = () => {
    if (!localStorage.getItem("user")) {
      alert(" Please sign in or register first!");
      return false;
    }
    return true;
  };

  const handleAddToCart = (product) => {
    if (!checkSignIn()) return;
    addToCart(product);
    alert(`${product.name} added to cart ✔`);
  };

  //  BUY NOW → Add to Order → Redirect to Order Page
  const handleBuyNow = (product) => {
    if (!checkSignIn()) return navigate("/signin");

    addOrder(product); // save as order
    navigate("/order"); // redirect to order page
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-green-700 drop-shadow-lg">
          Welcome to Starphone
        </h1>
        <p className="text-lg text-gray-600 mt-3">
          Discover latest smartphones with unbeatable prices 
        </p>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        New Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {dbProducts.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl hover:-translate-y-1 transition-all border"
          >
            <img
              src={`http://localhost:5000${p.image}`}
              className="w-65 h-65 object-cover rounded-xl"
              onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
            />

            <h3 className="font-semibold text-xl mt-4 text-gray-900">
              {p.name}
            </h3>

            <p className="text-green-600 font-bold text-lg mt-1">₹{p.price}</p>

            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={() => handleAddToCart(p)}
                className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 shadow"
              >
                Add To Cart
              </button>

              <button
                onClick={() => handleBuyNow(p)}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 shadow"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {!user && (
        <p className="mt-8 text-center text-gray-700 text-lg">
          Please{" "}
          <Link to="/signin" className="text-green-600 font-semibold">
            Sign in
          </Link>{" "}
          or{" "}
          <Link to="/register" className="text-green-600 font-semibold">
            Register
          </Link>{" "}
          to buy products.
        </p>
      )}
    </div>
  );
}
