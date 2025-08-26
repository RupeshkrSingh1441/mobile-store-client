import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';

const CartPage = () => {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
    
    const getTotalAmount = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const handlePayNow = async () => {
        try {
            // Call backend to create Razorpay order
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/payment/create-order`, {
                amount: getTotalAmount(), // Razorpay expects amount in paise
                receiptId: "receipt#1",
                email: "rs.rupesh105@gmail.com", // Add user email if available
            });
            const { orderId, key, amount} = res.data;

            const options = {
                key: key, // Razorpay key_id from backend
                amount: amount,
                currency: "INR",
                name: "Mobile Store",
                description: "Order Payment",
                order_id: orderId,
                handler: function (response) {
                    alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                    // You can call backend to verify payment here
                },
                prefill: {
                    // You can add user details here if available
                    email:"rs.rupesh105@gmail.com",
                    contact: ""
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            alert("Payment initiation failed!");
        }
    };

    if (cart.length === 0) {
        return <div className="container mt-4"><h3>Your cart is empty.</h3></div>;
    }

    return (
        <div className="container mt-4 mb-10">
            <h2>Your Cart</h2>
            <div className="row mt-4 mb-5">
                <div className="product-list" >
                {cart.map((product) => (
                    <div className="product-card" key={product.id}>
                        <img src={product.imageUrl || "/placeholder.jpg"} alt={product.brand} className="product-image" />
                        <div className="product-info">
                            <h5 className="product-name">{product.brand}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">{product.model}</h6>
                            <p className="product-description">{product.description}</p>
                            <strong className="product-price">₹{product.price}</strong>
                             <div className="d-flex align-items-center mt-2">
                                <button className="btn btn-outline-secondary me-2" onClick={() => decreaseQuantity(product.id)}>-</button>
                                <span>{product.quantity}</span>
                                <button className="btn btn-outline-secondary ms-2" onClick={() => increaseQuantity(product.id)}>+</button>
                                <button className="btn btn-outline-danger ms-3" onClick={() => removeFromCart(product.id)}>Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
            <div className="d-flex justify-content-end align-items-center">
                <h4 className="me-4">Total: ₹{getTotalAmount()}</h4>
                <button className="btn btn-success" onClick={handlePayNow}>Pay Now</button>
            </div>
        </div>
    );
};

export default CartPage;