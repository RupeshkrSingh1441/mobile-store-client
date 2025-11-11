import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } =
    useContext(CartContext);
  const [selectedItems, setSelectedItems] = useState([]); // ✅ Track selected products
  const navigate = useNavigate();

  useEffect(() => {
    // By default, select all items when cart changes
    setSelectedItems(cart.map((item) => item.id));
  }, [cart]);

  // ✅ Toggle selection
  const toggleSelection = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  // ✅ Select/Deselect all items
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]); // deselect all
    } else {
      setSelectedItems(cart.map((item) => item.id)); // select all
    }
  };

  // ✅ Calculate total for selected items
  const getTotalAmount = () => {
    return cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handlePayNow = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Please select at least one product for checkout!");
      return;
    }

    try {
      const selectedProducts = cart.filter((item) =>
        selectedItems.includes(item.id)
      );

      const totalAmount = getTotalAmount();
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/payment/create-order`,
        {
          amount: totalAmount,
          products: selectedProducts,
          receiptId: "receipt#1",
          email: "customer@example.com",
        }
      );

      const { orderId, key, amount } = res.data;
      const options = {
        key,
        amount,
        currency: "INR",
        name: "Mobile Store",
        description: "Order Payment",
        order_id: orderId,
        handler: function (response) {
          toast.success("Payment Successful!");
          clearCart();
          navigate("/");
        },
        theme: { color: "#1E40AF" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment initiation failed!");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="mb-4 text-secondary">Your cart is empty 😕</h3>
        <button className="btn btn-primary px-4" onClick={() => navigate(-1)}>
          ← Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {/* === Header Section === */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-semibold text-primary">Your Cart</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* === Select All === */}
      <div className="d-flex align-items-center mb-3">
        <input
          type="checkbox"
          checked={selectedItems.length === cart.length}
          onChange={toggleSelectAll}
          className="form-check-input me-2"
        />
        <label className="form-check-label fw-semibold">Select All</label>
      </div>

      {/* === Cart Items === */}
      <div className="row g-3">
        {cart.map((product) => (
          <div className="col-md-6 col-lg-4" key={product.id}>
            <div
              className={`card shadow-sm border-0 h-100 rounded-3 ${
                selectedItems.includes(product.id)
                  ? "border-primary border-2"
                  : ""
              }`}
            >
              <div className="p-2 d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={selectedItems.includes(product.id)}
                  onChange={() => toggleSelection(product.id)}
                />
                <img
                  src={product.imageUrl || "/placeholder.jpg"}
                  alt={product.brand}
                  style={{
                    height: "100px",
                    width: "100px",
                    objectFit: "contain",
                    background: "#f9fafb",
                    borderRadius: "6px",
                  }}
                />
                <div className="ms-3">
                  <h6 className="fw-bold mb-0">{product.brand}</h6>
                  <small className="text-muted">{product.model}</small>
                  <p className="fw-semibold mt-2 mb-1">
                    ₹{product.price.toLocaleString()}
                  </p>

                  {/* Quantity Controls */}
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() => decreaseQuantity(product.id)}
                    >
                      −
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      onClick={() => increaseQuantity(product.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-footer bg-white border-0 text-end">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeFromCart(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === Cart Footer Summary === */}
      <div className="d-flex justify-content-between align-items-center mt-5 p-3 rounded shadow-sm bg-light">
        <div>
          <h5 className="fw-semibold mb-0">
            Total for Selected Items: ₹{getTotalAmount().toLocaleString()}
          </h5>
          <small className="text-muted">
            {selectedItems.length} of {cart.length} items selected
          </small>
        </div>

        <div className="d-flex gap-3">
          <button
            className="btn btn-outline-primary px-4"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
          <button className="btn btn-success px-4" onClick={handlePayNow}>
            Checkout Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
