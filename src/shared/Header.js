// Header.js
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { CartContext } from "../context/CartContext";
import "../components/Header.css";

const Header = () => {
  const [dark, setDark] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("bg-dark", dark);
    const onScroll = () => {
      const nav = document.querySelector(".sticky-header");
      if (window.scrollY > 10) nav.classList.add("scrolled-header");
      else nav.classList.remove("scrolled-header");
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-header shadow-sm">
      <div className="header-container">
        {/* === LEFT: LOGO === */}
        <Link className="logo-link" to="/">
          <img
            src="/mobile-store-client/logo.svg"
            className="site-logo"
            alt="logo"
          />
        </Link>

        {/* === CENTER: SEARCH === */}
        <div className="search-wrapper ms-auto me-3">
          <input
            className="form-control search-input"
            type="search"
            placeholder="Search mobiles..."
            aria-label="Search"
          />
          <i className="bi bi-search search-icon"></i>
        </div>

        {/* === RIGHT: USER + CART === */}
        <div className="right-actions">
          <Link to="/cart" className="cart-btn position-relative">
            <i className="bi bi-cart3"></i>
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </Link>

          {user ? (
            <div className="dropdown">
              <button
                className="btn user-btn dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {user.FullName || user.email}
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                </li>

                {user.roles?.includes("Admin") && (
                  <li>
                    <Link className="dropdown-item" to="/admin-order">
                      Admin Panel
                    </Link>
                  </li>
                )}

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
