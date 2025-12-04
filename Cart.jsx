import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart({ cart, setCart, setOrders, orders }) {
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0 && savedCart.length > 0) {
      setCart(savedCart);
    }
  }, []);

  const saveToLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // ⭐ ALWAYS return unique key for every product
  const getKey = (item) =>
    item._id || item.id || `${item.name}-${item.price}`;

  const increaseQty = (key) => {
    const updatedCart = cart.map((item) =>
      getKey(item) === key ? { ...item, qty: (item.qty || 1) + 1 } : item
    );
    setCart(updatedCart);
    saveToLocal("cart", updatedCart);
  };

  const decreaseQty = (key) => {
    const updatedCart = cart
      .map((item) =>
        getKey(item) === key ? { ...item, qty: (item.qty || 1) - 1 } : item
      )
      .filter((item) => item.qty > 0);

    setCart(updatedCart);
    saveToLocal("cart", updatedCart);
  };

  const removeFromCart = (key) => {
    const updatedCart = cart.filter((item) => getKey(item) !== key);
    setCart(updatedCart);
    saveToLocal("cart", updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    saveToLocal("cart", []);
  };

  // Buy single item
  const handleBuyItem = (item) => {
    const confirmed = window.confirm(
      `Do you want to buy "${item.name}" for ₹${item.price * (item.qty || 1)}?`
    );
    if (!confirmed) return;

    const order = {
      ...item,
      qty: item.qty || 1,
      date: new Date().toLocaleString(),
      status: "Confirmed",
    };

    const updatedOrders = [...orders, order];
    const updatedCart = cart.filter((p) => getKey(p) !== getKey(item));

    setOrders(updatedOrders);
    setCart(updatedCart);

    saveToLocal("orders", updatedOrders);
    saveToLocal("cart", updatedCart);
    saveToLocal("recentOrder", [order]);

    navigate("/order");
  };

  // Buy all items
  const handleBuyAll = () => {
    if (cart.length === 0) return alert("Your cart is empty 🛒");

    const confirmed = window.confirm("Do you want to buy all products?");
    if (!confirmed) return;

    const allOrders = cart.map((item) => ({
      ...item,
      qty: item.qty || 1,
      date: new Date().toLocaleString(),
      status: "Confirmed",
    }));

    const updatedOrders = [...orders, ...allOrders];

    setOrders(updatedOrders);
    setCart([]);

    saveToLocal("orders", updatedOrders);
    saveToLocal("cart", []);
    saveToLocal("recentOrder", allOrders);

    navigate("/order");
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => {
            const key = getKey(item);

            return (
              <div
                key={key}
                className="flex flex-col sm:flex-row justify-between items-center border p-4 rounded-lg shadow gap-2"
              >
                {/* 🖼 FIXED BIG IMAGE */}
                <img
                  src={
                    item.image
                      ? `http://localhost:5000${item.image}` // admin
                      : item.img
                      ? item.img // static
                      : "https://via.placeholder.com/150"
                  }
                  alt={item.name}
                  className="w-32 h-32 object-contain rounded mr-4"
                />

                <span className="font-medium flex-1 text-left">
                  {item.name} - ₹{item.price} × {item.qty || 1}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQty(key)}
                    className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span className="px-2">{item.qty || 1}</span>
                  <button
                    onClick={() => increaseQty(key)}
                    className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleBuyItem(item)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Buy
                  </button>

                  <button
                    onClick={() => removeFromCart(key)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <h2 className="text-xl font-semibold mt-6">Total: ₹{total}</h2>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={clearCart}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear Cart
            </button>
            <button
              onClick={handleBuyAll}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Buy All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
