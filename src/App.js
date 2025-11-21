import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./shared/Header";
import Footer from "./shared/Footer";
import Loader from "./shared/Loader";

import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ConfirmEmail from "./auth/ConfirmEmail";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import CartPage from "./pages/CartPage";

import AdminProducts from "./admin/AdminProducts";
import AdminProductForm from "./admin/AdminProductForm";
import AdminOrders from "./admin/AdminOrders";
//import ProductAdmin from "./admin/ProductAdmin";

import NotFound from "./pages/NotFound";
import IdleLogoutModal from "./components/IdleLogoutModal";
import useIdleLogout from "./hooks/useIdleLogout";
import { useAuth } from "./auth/AuthContext";

// Protect normal user routes
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Protect admin-only routes
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "Admin" ? children : <Navigate to="/" replace />;
};

function App() {
  const { logout, user, initializing } = useAuth(); // ⬅ KEY FIX
  const [loading, setLoading] = useState(true);
  const [showIdleModal, setShowIdleModal] = useState(false);

  // 🔥 Enable auto logout ONLY if user is logged in
  const { continueSession, forceLogout } = useIdleLogout(() => {
    if (user) logout();
    window.location.href = "/login";
  }, setShowIdleModal);

  // Wait for AuthContext initialization
  useEffect(() => {
    if (!initializing) {
      setLoading(false);
    }
  }, [initializing]);

  if (loading) return <Loader />;

  return (
    <div className="app-container">
      <IdleLogoutModal
        show={showIdleModal}
        onContinue={continueSession}
        onLogout={forceLogout}
      />
      <Header />

      <main className="main-content">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Prevent logged-in users from accessing login/register */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />

          <Route path="/confirm-email" element={<ConfirmEmail />} />

          {/* Private pages */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />

          {/* Admin-only */}
          <Route
            path="/admin-products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />

          <Route
            path="/admin-products/new"
            element={
              <AdminRoute>
                <AdminProductForm />
              </AdminRoute>
            }
          />

          <Route
            path="/admin-products/edit/:id"
            element={
              <AdminRoute>
                <AdminProductForm />
              </AdminRoute>
            }
          />

          <Route
            path="/admin-order"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          {/* Remove this if not needed */}
          <Route path="/product-admin" element={<Navigate to="/" />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
