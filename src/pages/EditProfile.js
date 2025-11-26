// src/pages/EditProfile.js
import React, { useState, useEffect, useContext } from "react";
import { axiosSecure } from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL;

const EditProfile = () => {
  const { accessToken } = useAuth() || {};
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    addressLine1: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const authToken = accessToken || localStorage.getItem("accessToken");

  const axiosAuth = axiosSecure.create({
    baseURL: API,
    headers: { Authorization: `Bearer ${authToken}` },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axiosAuth.get("/auth/profile");
      setForm(res.data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axiosAuth.put("/auth/update-profile", form);
      alert("Profile updated successfully");

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="container py-4">
      <Breadcrumb />
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h3 className="mb-4">Edit Profile</h3>

      <div className="card p-4 shadow-sm">
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Full Name</label>
            <input
              name="fullName"
              className="form-control"
              value={form.fullName || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <h5 className="mt-3 mb-2">Address</h5>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Address Line</label>
            <input
              name="addressLine1"
              className="form-control"
              value={form.addressLine1 || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">City</label>
            <input
              name="city"
              className="form-control"
              value={form.city || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">State</label>
            <input
              name="state"
              className="form-control"
              value={form.state || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Country</label>
            <input
              name="country"
              className="form-control"
              value={form.country || ""}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Zip Code</label>
            <input
              name="zipCode"
              className="form-control"
              value={form.zipCode || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="btn btn-primary mt-3" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
