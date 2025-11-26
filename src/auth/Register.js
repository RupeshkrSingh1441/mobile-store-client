import React, { useState } from "react";
import { axiosSecure } from "../api/axiosInstance";
import { Link } from "react-router-dom";
//import './Register.css;'

const Register = () => {
  const [model, setModel] = useState({
    fullName: "",
    email: "",
    password: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setModel({ ...model, [e.target.name]: e.target.value });

  const validate = () => {
    let temp = {};

    if (!(model.fullName ?? "").trim()) temp.fullName = "Full name is required";

    if (!(model.email ?? "").trim()) temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(model.email))
      temp.email = "Enter a valid email";

    if (!(model.password ?? "").trim()) temp.password = "Password is required";
    else if (model.password.length < 6)
      temp.password = "Password must be at least 6 characters";

    if (!(model.addressLine1 ?? "").trim())
      temp.addressLine1 = "Address Line 1 is required";

    if (!(model.city ?? "").trim()) temp.city = "City is required";
    if (!(model.state ?? "").trim()) temp.state = "State is required";
    if (!(model.country ?? "").trim()) temp.country = "Country is required";
    if (!(model.zipCode ?? "").trim()) temp.zipCode = "Zip Code is required";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // ❌ stop if validation fails
    try {
      const res = await axiosSecure.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        model
      );
      setMessage(res.data);
      setErrors({});
    } catch (err) {
      setMessage(err.response?.data || "Error during registration");
    }
  };

  return (
    <div className="register-wrapper d-flex align-items-center justify-content-center">
      <form
        className="register-form p-4 shadow-lg rounded"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-center">Register</h2>
        <div className="mb-3">
          <input
            type="text"
            name="fullName"
            className="form-control mb-2"
            placeholder="Full Name"
            onChange={handleChange}
          />
          {errors.fullName && (
            <small className="text-danger">{errors.fullName}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control mb-2"
            placeholder="Email"
            onChange={handleChange}
          />
          {errors.email && (
            <small className="text-danger">{errors.email}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control mb-2"
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && (
            <small className="text-danger">{errors.password}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="addressLine1"
            className="form-control mb-2"
            placeholder="Address Line 1"
            onChange={handleChange}
          />
          {errors.addressLine1 && (
            <small className="text-danger">{errors.addressLine1}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="addressLine2"
            className="form-control mb-2"
            placeholder="Address Line 2"
            onChange={handleChange}
          />
          {errors.addressLine2 && (
            <small className="text-danger">{errors.addressLine2}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="city"
            className="form-control mb-2"
            placeholder="City"
            onChange={handleChange}
          />
          {errors.city && <small className="text-danger">{errors.city}</small>}
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="state"
            className="form-control mb-2"
            placeholder="State"
            onChange={handleChange}
          />
          {errors.state && (
            <small className="text-danger">{errors.state}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="country"
            className="form-control mb-2"
            placeholder="Country"
            onChange={handleChange}
          />
          {errors.country && (
            <small className="text-danger">{errors.country}</small>
          )}
        </div>
        <div className="mb-3">
          <input
            type="text"
            name="zipCode"
            className="form-control mb-2"
            placeholder="Zip Code"
            onChange={handleChange}
          />
          {errors.zipCode && (
            <small className="text-danger">{errors.zipCode}</small>
          )}
        </div>
        <button className="btn btn-primary w-100">Register</button>
        {message && <div className="mt-3 alert alert-success">{message}</div>}

        <div className="text-center mt-3">
          <small className="text-muted">Already have an account?</small>
          <br />
          <Link to="/login" className="text-primary fw-semibold">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
