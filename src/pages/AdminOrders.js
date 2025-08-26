import React,{useEffect,useState} from "react";
import axios from "axios";

const AdminOrders = () => {
const [orders, setOrders] = useState([]);
const token = localStorage.getItem('token');

useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/order/all-orders`, {
        headers: {Authorization: `Bearer ${token}`} 
    }).then(res => setOrders(res.data));
},[token]);

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
                <tr key={order._id}>
                    <td>{order.RazorpayOrderId}</td>
                    <td>{order.RazorpayPaymentId}</td>
                    <td>{order.Email}</td>
                    <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                    <td>${order.Amount.toFixed(2)}</td>
                    <td>{order.Status}</td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
)

}

export default AdminOrders;