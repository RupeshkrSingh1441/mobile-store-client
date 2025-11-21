// src/context/CartContext.js
import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // use id if present, else email
  const userKey = user?.id ?? user?.email ?? null;

  const [cart, setCart] = useState([]);

  // Load cart when user changes
  useEffect(() => {
    if (!userKey) {
      setCart([]);
      return;
    }
    const saved = localStorage.getItem(`cart_${userKey}`);
    setCart(saved ? JSON.parse(saved) : []);
  }, [userKey]);

  // Save cart when it changes
  useEffect(() => {
    if (!userKey) return;
    localStorage.setItem(`cart_${userKey}`, JSON.stringify(cart));
  }, [cart, userKey]);

  const addToCart = (product) => {
    if (!userKey) {
      toast.warning("Please login to add items to your cart.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p))
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
