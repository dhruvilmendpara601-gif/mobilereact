import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ user, setUser, cart }) {
  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Active & Inactive CSS classes
  const linkClasses = ({ isActive }) =>
    isActive
      ? "px-3 py-1 rounded bg-white text-green-600 font-semibold"
      : "hover:underline";

  return (
    <nav className="bg-green-500 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Starphone</div>

      <div className="flex items-center space-x-4">

        <NavLink to="/" className={linkClasses}>
          Home
        </NavLink>

        <NavLink to="/products" className={linkClasses}>
          Products
        </NavLink>

        <NavLink to="/about" className={linkClasses}>
          About
        </NavLink>

        <NavLink to="/order" className={linkClasses}>
          Order
        </NavLink>

        <NavLink to="/address" className={linkClasses}>
          Address
        </NavLink>

        {/* Cart badge */}
        <NavLink to="/cart" className={linkClasses}>
          <div className="relative">
            Cart
            {cart && cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </div>
        </NavLink>

        {/* Auth section */}
        {!user ? (
          <>
            <NavLink to="/signin" className={linkClasses}>
              Sign In
            </NavLink>

            <NavLink to="/register" className={linkClasses}>
              Register
            </NavLink>
          </>
        ) : (
          <>
            <span>Welcome, {user.name || "User"}</span>

            <button
              onClick={handleSignOut}
              className="ml-2 px-3 py-1 rounded bg-white text-green-500 font-semibold hover:bg-gray-100 transition"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
