import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ✅ Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // <-- ADD THIS LINE
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';  // ✅ ADD THIS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { AuthProvider } from './auth/AuthContext';
import { CartProvider } from './context/CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <CartProvider>
      <App />
       <ToastContainer position="top-right" autoClose={1500} />
    </CartProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
reportWebVitals();
