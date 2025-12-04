import React, { useEffect, useState } from "react";

export default function Order({ orders: appOrders, setOrders }) {
  const [orders, setLocalOrders] = useState(() => {
    return JSON.parse(localStorage.getItem("orders")) || [];
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders")) || [];

    // If App state has orders → use those
    if (appOrders.length > 0) {
      setLocalOrders(appOrders);
      localStorage.setItem("orders", JSON.stringify(appOrders));
    } 
    // If App state empty but localStorage has → load from localStorage
    else if (stored.length > 0) {
      setLocalOrders(stored);
      setOrders(stored);
    }
  }, [appOrders, setOrders]);

  const handleCancel = (index) => {
    if (!window.confirm("Cancel this order?")) return;

    const updated = orders.filter((_, i) => i !== index);

    setLocalOrders(updated);
    setOrders(updated);

    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">📦 Your Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {orders.map((o, i) => (
            <div key={i} className="border p-4 shadow rounded-xl">
              <img
                src={
                  o.image
                    ? `http://localhost:5000${o.image}`
                    : o.img
                    ? o.img
                    : "https://via.placeholder.com/200"
                }
                className="w-60 h-60  object-cover rounded-md mb-3"
              />

              <h3 className="text-lg font-semibold">{o.name}</h3>
              <p>₹{o.price}</p>
              <p className="text-green-600">{o.status}</p>
              <p className="text-gray-500 text-sm">{o.date}</p>

              <button
                className="bg-red-500 text-white px-3 py-2 rounded mt-3"
                onClick={() => handleCancel(i)}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
