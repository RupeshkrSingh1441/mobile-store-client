import React,{useEffect,useState} from "react";
import axios from "axios";

const AdminOrders = () => {
const [orders, setOrders] = useState([]);
const token = localStorage.getItem('token');

 useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/order/all-orders`,
          {}, // No body data, send empty object
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
    console.log("Fetched Orders:", orders);
  }, [token]);

return (
    <div className="container mt-4">
    <h2>All Orders</h2>
    <table className="table table-bordered">
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
            {orders.map(order => (
                <tr key={order.id}>
                    <td>{order.razorpayOrderId}</td>
                    <td>{order.razorpayPaymentId}</td>
                    <td>{order.email}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>₹{order.amount}</td> {/* ${order.Amount.toFixed(2)}*/}
                    <td>{order.status}</td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
)

}

export default AdminOrders;