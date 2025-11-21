// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";
import Loader from "../shared/Loader";
import "./Profile.css";
import Breadcrumb from "../components/Breadcrumb";

const API = process.env.REACT_APP_API_URL;
const API_ROOT = process.env.REACT_APP_API_URL.replace("/api", "");

const Profile = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("No login token found");
      return;
    }

    const axiosAuth = axios.create({
      baseURL: API,
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchData = async () => {
      try {
        setLoading(true);

        const [profileRes, ordersRes] = await Promise.all([
          axiosAuth.get("/auth/profile"),
          axiosAuth.get("/order/user-orders"),
        ]);

        setUser(profileRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Profile Fetch Error:", err);

        if (err.response?.status === 401) {
          // Token expired or invalid
          logout();
          return;
        }

        setError("Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, logout]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="container mt-5">
        <h4 className="text-danger">{error}</h4>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-5">
        <h5>Please login to view your profile.</h5>
      </div>
    );
  }

  return (
    <div className="container profile-page profile-container">
      <Breadcrumb />
      {/* USER CARD */}
      <div className="card profile-header shadow-sm p-4 mb-4">
        <div className="d-flex align-items-center gap-4">
          <div className="profile-avatar">
            {user.fullName
              ? user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : user.email[0].toUpperCase()}
          </div>

          <div>
            <h4 className="mb-1">{user.fullName || user.email}</h4>
            <small className="text-muted">
              Member since {new Date().getFullYear()}
            </small>
          </div>

          <div className="ms-auto">
            <button
              className="btn btn-outline-primary"
              onClick={() => (window.location.href = "/profile/edit")}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <h5 className="section-title">Recent Orders</h5>

      {orders.length === 0 ? (
        <div className="alert alert-light">No recent orders.</div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <img
                  className="order-image"
                  src={
                    order.productImage
                      ? `${API_ROOT}${order.productImage}`
                      : "/placeholder.jpg"
                  }
                  alt="Product"
                  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                />

                <div className="order-details">
                  <div className="fw-bold">
                    {order.productModel || "Product"}
                  </div>

                  <div
                    className={
                      order.status === "captured"
                        ? "order-status delivered"
                        : order.status === "Shipped"
                        ? "order-status shipped"
                        : "order-status pending"
                    }
                  >
                    {order.status || "Pending"}
                  </div>

                  <div className="order-meta">
                    Order #{order.id} •{" "}
                    {new Date(order.orderDate).toLocaleString()}
                  </div>
                </div>

                <div className="ms-auto">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      (window.location.href = `/order/${order.id}`)
                    }
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADDRESS */}
      <div className="card p-3 shadow-sm mt-4 address-card">
        <h6 className="mb-1">Saved Address</h6>
        <p className="mb-0">{user.addressLine1}</p>
        <p>
          {user.city}, {user.state}
        </p>
        <p>
          {user.country} - {user.zipCode}
        </p>
      </div>
    </div>
  );
};

export default Profile;
