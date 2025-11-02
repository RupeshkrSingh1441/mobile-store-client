import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../auth/AuthContext";

const Header = () => {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);


  return (
    <nav className="navbar navbar-expand-lg sticky-header">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
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
        <div className="d-flex align-items-center">
          {user?.roles?.includes('Admin') && (
            <Link to="/admin-order" className="btn btn-outline-dark me-2">
              Admin Orders
            </Link>
          )}
          <Link to="/cart" className="btn btn-outline-primary me-3">
            <span role="img" aria-label="cart">
              🛒
            </span>
            <span className="ms-1">{cart.length}</span>
          </Link>
          {user ? (
            <>
              <span className="me-3 fw-bold">Welcome, {user?.FullName}</span>
              <button className="btn btn-outline-danger" onClick={logout}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-success">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
