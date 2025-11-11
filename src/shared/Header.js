// Header.js
import React, { useContext, useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { CartContext } from "../context/CartContext";

const Header = () => {
  const [dark, setDark] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
  document.body.classList.toggle('bg-dark', dark);
}, [dark]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm sticky-top sticky-header">
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex fw-bold align-items-center" to="/">
          {/* Mobile Store Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-phone"
            viewBox="0 0 16 16"
          >
            <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zm-6 1v12h6V2H5z" />
            <path d="M8 13.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
          </svg>
          <span className="ms-2">Mobile Store</span>
        </Link>

        <form className="d-flex ms-auto me-3" role="search">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search mobiles..."
            aria-label="Search"
            style={{ width: "250px" }}
          />
          <button className="btn cart-btn" type="submit">
            Search
          </button>
        </form>

        <div className="d-flex align-items-center gap-3">
          <Link to="/cart" className="cart-btn">
            <i className="bi bi-cart3"></i>
            {cart.length > 0 && (
              <span className="cart-badge">
                {cart.length}
              </span>
            )}
          </Link>

          {user? (
            <div className="dropdown">
              <button
                className="btn cart-btn dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                {user?.FullName || user?.email}
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
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary shadow-sm px-4">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
