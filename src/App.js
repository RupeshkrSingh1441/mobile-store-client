import React,{useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  Register  from './pages/Register';
import Login from './pages/Login';
import ConfirmEmail from './pages/ConfirmEmail';
import ProductList from './pages/ProductList';
import ProductAdmin from './pages/ProductAdmin';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminRoute from './auth/AdminRoute';
import CartPage from './pages/CartPage';
import Header from './shared/Header';
import Footer from './shared/Footer';
import AdminOrders from './pages/AdminOrders';

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Router>
    <Header />
    <main className="container my-4">
      <div className="row">
       
        <div className="col-md-12">
      <Routes>
      <Route path = "/" element={<ProductList/>}/>
        <Route path = "/register" element={<Register/>}/>
        <Route path = "/login" element={<Login/>}/>
        <Route path="/cart" element={<CartPage />} />
        <Route path = "/store-products" element={
          <ProtectedRoute>
            <ProductList/>
          </ProtectedRoute>
        }/>        
        <Route path = "/confirm-email" element={<ConfirmEmail/>}/>
        <Route path ="/admin-products" element={
          <AdminRoute>
            <ProductAdmin/>
          </AdminRoute>
        }/>
        <Route path ="/admin-order" element={
          <AdminRoute>
            <AdminOrders/>
          </AdminRoute>
        }/>
      </Routes>
        </div>
      </div>
    </main>
    <Footer />  
    </Router>
    // <div>
    //   <h1>Hello World!</h1>
    // </div>
  );
}

export default App;
