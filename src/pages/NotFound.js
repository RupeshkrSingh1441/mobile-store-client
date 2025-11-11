import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      <img
        src="/mobile-store-client/images/404.png"
        alt="Not found"
        className="img-fluid mb-3"
        style={{ maxWidth: "350px" }}
      />

      <h3
        className="display-1 fw-bold"
        style={{ animation: "pulse 1s infinite" }}
      >
        Oops! Page not found
      </h3>
      <p className="text-muted mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <button className="btn btn-primary px-4" onClick={() => navigate("/")}>
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
