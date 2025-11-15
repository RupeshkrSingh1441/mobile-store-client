// src/pages/Profile.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import Loader from "../components/Loader";
import "./Profile.css";
import Breadcrumb from "../components/Breadcrumb";

const API = process.env.REACT_APP_API_URL;
const API_ROOT = process.env.REACT_APP_API_URL.replace("/api", "");

const Profile = () => {
  const { token } = useContext(AuthContext) || {};
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const authToken = token || localStorage.getItem("token");

  const axiosAuth = axios.create({
    baseURL: API,
    headers: { Authorization: `Bearer ${authToken}` },
  });

  useEffect(() => {
    if (!authToken) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [profileRes, ordersRes] = await Promise.all([
          axiosAuth.get("/auth/profile"),
          axiosAuth.get("/order/user-orders"),
        ]);

        setUser(profileRes.data);
        console.log("ordersRes:", ordersRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  if (!authToken) {
    return (
      <div className="text-center mt-5">
        <h5>Please login to view your profile.</h5>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="container profile-page profile-container">
        <Breadcrumb />
      {/* ------------------ USER CARD ------------------ */}
      <div className="card profile-header shadow-sm p-4 mb-4">
        <div className="d-flex align-items-center gap-4">
          {/* Avatar */}
          <div className="profile-avatar">
            {user.fullName
              ? user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : user.email[0].toUpperCase()}
          </div>

          {/* User Details */}
          <div>
            <h4 className="mb-1">{user.fullName || user.email}</h4>
            <small className="text-muted">
              Member since {new Date().getFullYear()}
            </small>
          </div>

          <div className="ms-auto">
            <button className="btn btn-outline-primary">Edit Profile</button>
          </div>
        </div>
      </div>

      {/* ------------------ RECENT ORDERS ------------------ */}
      <h5 className="section-title">Recent Orders</h5>

      {orders.length === 0 ? (
        <div className="alert alert-light">No recent orders.</div>
      ) : (
        <div className="order-list">
          {orders.map((order) => {
            // const product = order.items?.[0]?.product;

            return (
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
                    <button className="btn btn-outline-primary btn-sm">
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------ SAVED ADDRESS ------------------ */}
      <div className="card p-3 shadow-sm mt-4 address-card">
        <h6 className="mb-1">Saved Address</h6>
        <p className="mb-0">{user.addressLine1}</p>
        <p>{user.city}, {user.state}</p>
        <p>{user.country} - {user.zipCode}</p>
        {/* <small className="text-muted">{user.pincode || "400001"}</small> */}
      </div>
    </div>
  );
};

export default Profile;
