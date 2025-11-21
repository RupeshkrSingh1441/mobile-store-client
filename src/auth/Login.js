import React, { useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [model, setModel] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) =>
    setModel({ ...model, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        model
      );
      const token = res.data.token;
      if (!token) throw new Error("Token not returned");
      login(token); // ✅ Handles role-based redirect internally      
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center">
      <form
        className="login-form p-4 shadow-lg rounded"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-center">Login</h2>
        <div className="mb-3">
          {" "}
          <input
            type="email"
            name="email"
            className="form-control mb-2"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control mb-2"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-success w-100">Login</button>
        {error && <div className="mt-3 alert alert-danger">{error}</div>}

        <div className="text-center mt-3">
          <small className="text-muted">Don't have an account?</small>
          <br />
          <Link to="/register" className="text-primary fw-semibold">
            Create an Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
