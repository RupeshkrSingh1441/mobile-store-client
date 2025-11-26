// src/shared/Header.js
import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { CartContext } from "../context/CartContext";
import { axiosSecure } from "../api/axiosInstance";
import "../shared/Header.css";

const API_ROOT = process.env.REACT_APP_API_URL.replace("/api", "");

const Header = () => {
  const { user, logout } = useAuth();
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dark, setDark] = useState(false);

  const wrapperRef = useRef();

  // ---------------------------
  // 🔍 SEARCH — DEBOUNCE LOGIC
  // ---------------------------
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axiosSecure.get(
          `${process.env.REACT_APP_API_URL}/product/search-suggestions?q=${query}`
        );
        setSuggestions(res.data);
      } catch (err) {
        console.error("Search Suggest Error", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // ---------------------------
  // 🔄 CLOSE SUGGESTIONS WHEN CLICK OUTSIDE
  // ---------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------------------
  // 🌙 STICKY HEADER + DARK MODE
  // ---------------------------
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

  // ---------------------------
  // 🚪 LOGOUT
  // ---------------------------
  const handleLogout = () => {
    clearCart();
    logout();
  };

  // ---------------------------
  // 🔍 SEARCH SUBMIT
  // ---------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setSuggestions([]);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-header shadow-sm">
      <div className="header-container">
        {/* Logo */}
        <Link className="logo-link" to="/">
          <img
            src="/mobile-store-client/logo.svg"
            className="site-logo"
            alt="logo"
          />
        </Link>

        {/* Search Bar */}
        <div className="search-wrapper ms-auto me-3" ref={wrapperRef}>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control search-input"
              type="search"
              placeholder="Search mobiles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* 🔍 Icon */}
            <i className="bi bi-search search-icon"></i>

            {/* 🟦 SUGGESTION DROPDOWN */}
            {suggestions.length > 0 && (
              <div className="search-suggestion-box">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="search-suggestion-item"
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      setSuggestions([]);
                    }}
                  >
                    <img
                      src={
                        item.image
                          ? `${API_ROOT}${item.image}`
                          : "/placeholder.jpg"
                      }
                      alt={item.name}
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.jpg")
                      }
                    />

                    <span>{item.model || item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Right Actions */}
        <div className="right-actions">
          {/* Cart (only when logged in) */}
          {user && (
            <Link to="/cart" className="cart-btn position-relative">
              <i className="bi bi-cart3"></i>
              {cart.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
              )}
            </Link>
          )}

          {/* User Dropdown OR Login */}
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

                {/* Admin */}
                {user.roles?.includes("Admin") && (
                  <li>
                    <Link className="dropdown-item" to="/admin-order">
                      Admin Panel
                    </Link>
                  </li>
                )}

                {/* Empty Cart Button */}
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

                {/* Logout */}
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
