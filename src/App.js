import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  Register  from './pages/Register';
import Login from './pages/Login';
import ConfirmEmail from './pages/ConfirmEmail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/register" element={<Register/>}/>
        <Route path = "/login" element={<Login/>}/>
        <Route path = "/confirm-email" element={<ConfirmEmail/>}/>
      </Routes>
    </Router>
  );
}

export default App;
