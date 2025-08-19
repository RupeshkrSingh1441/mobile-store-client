import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
    const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

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
        </div>
    );
};

export default CartPage;