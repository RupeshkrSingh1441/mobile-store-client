import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { CartProvider } from "./context/CartContext";

import Header from "./shared/Header";
import Footer from "./shared/Footer";
import ProductList from "./pages/ProductList";
import Loader from "./components/Loader";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import AdminOrders from "./pages/AdminOrders"; // ✅ Import your admin page
import AdminRoute from "./auth/AdminRoute"; // ✅ Import your AdminRoute
import ProtectedRoute from "./auth/ProtectedRoute"; // ✅ Optional if you use protected user-only routes
import NotFound from "./pages/NotFound";

function App() {
  const [loading, setLoading] = useState(true);

  // Simulate initial app load (you can later tie this to actual data fetching)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<ProductList />} />
                <Route path="/mobile-store-client" element={<ProductList />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/product/:id" element={<ProductDetails />} />

                {/* Protected Routes (any logged-in user) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<div>My Profile</div>} />
                  {/* you can add more protected pages here */}
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin-order" element={<AdminOrders />} />
                  {/* you can also include more like: */}
                  {/* <Route path="/admin/products" element={<ProductAdmin />} /> */}
                </Route>

                {/* ✅ Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
