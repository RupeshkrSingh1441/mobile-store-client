import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "../components/Breadcrumb";
import "./AdminOrders.css"; // 👉 Add this CSS file

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/order/all-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [token]);

  // Status badge color logic
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "captured":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning text-dark";
      case "failed":
        return "badge bg-danger";
      case "shipped":
        return "badge bg-primary";
      default:
        return "badge bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <Breadcrumb />
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">All Orders</h2>
      </div>

      <div className="card shadow-sm rounded-4 p-3 admin-table-wrapper">
        <table className="table table-hover align-middle admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Payment ID</th>
              <th>Email</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="text-primary fw-semibold">
                    {order.razorpayOrderId}
                  </td>
                  <td>{order.razorpayPaymentId || "-"}</td>
                  <td>{order.email}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="fw-semibold">₹{order.amount}</td>
                  <td>
                    <span className={getStatusClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
