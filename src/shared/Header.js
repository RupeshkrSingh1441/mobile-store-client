// src/shared/Header.js
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { CartContext } from "../context/CartContext";
import "../shared/Header.css";

const Header = () => {
  const [dark, setDark] = useState(false);
  const { user, logout } = useAuth();
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("bg-dark", dark);

    const onScroll = () => {
      const nav = document.querySelector(".sticky-header");
      if (!nav) return;
      if (window.scrollY > 10) nav.classList.add("scrolled-header");
      else nav.classList.remove("scrolled-header");
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [dark]);

  const handleLogout = () => {
    clearCart();
    logout();
    // logout redirects to /login already
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-header shadow-sm">
      <div className="header-container">
        {/* LEFT: logo */}
        <Link className="logo-link" to="/">
          <img
            src="/mobile-store-client/logo.svg"
            className="site-logo"
            alt="logo"
          />
        </Link>

        {/* CENTER: search */}
        <div className="search-wrapper ms-auto me-3">
          <input
            className="form-control search-input"
            type="search"
            placeholder="Search mobiles..."
          />
          <i className="bi bi-search search-icon"></i>
        </div>

        {/* RIGHT: user + cart */}
        <div className="right-actions">
          {/* Cart only when logged in */}
          {user && (
            <Link to="/cart" className="cart-btn position-relative">
              <i className="bi bi-cart3"></i>
              {cart.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
              )}
            </Link>
          )}

          {/* User dropdown or Sign In */}
          {user ? (
            <div className="dropdown">
              <button
                className="btn user-btn dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {user.fullName || user.email}
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>

                {/* Admin link if roles indicate admin */}
                {user.roles?.includes("Admin") && (
                  <li>
                    <Link className="dropdown-item" to="/admin-order">
                      Admin Panel
                    </Link>
                  </li>
                )}

                <li>
                  <button
                    className="dropdown-item text-warning fw-semibold"
                    onClick={() => {
                      clearCart();
                      navigate("/cart");
                    }}
                  >
                    🗑️ Empty Cart
                  </button>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary login-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
