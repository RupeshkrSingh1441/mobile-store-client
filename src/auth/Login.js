import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosSecure } from "../api/axiosInstance";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosSecure.post("/auth/login", form);
      const { accessToken, refreshToken } = res.data;

      if (!accessToken || !refreshToken) {
        toast.error("Invalid login response. Tokens missing.",{
  duration: 20000, // Set the duration to 20000ms (20 seconds)
});
        setLoading(false);
        return;
      }

      await login(accessToken, refreshToken);
      toast.success("Login successful!",{
  duration: 10000, // Set the duration to 20000ms (20 seconds)
});
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err);
      toast.error(err.response?.data || "Login failed",{
  duration: 20000, // Set the duration to 20000ms (20 seconds)
});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center mt-5">
      <form
        onSubmit={handleSubmit}
        className="login-form p-4 shadow-lg rounded"
      >
        <h3 className="mb-4 text-center">Login</h3>
        <input
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="form-control mb-3"
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button disabled={loading} className="btn btn-success w-100">
          {loading ? "Please wait..." : "Login"}
        </button>
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
