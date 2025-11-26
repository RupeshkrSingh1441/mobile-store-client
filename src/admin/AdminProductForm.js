// src/admin/AdminProductForm.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosSecure } from "../api/axiosInstance"; 
import { toast } from "react-toastify";
import Loader from "../shared/Loader";
import Breadcrumb from "../components/Breadcrumb";

const API_ROOT = process.env.REACT_APP_API_URL.replace("/api", "");

const AdminProductForm = () => {
  const { id } = useParams(); // if present => edit mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [product, setProduct] = useState({
    brand: "",
    model: "",
    price: "",
    description: "",
    category: "",
    color: "",
    storage: "",
    warranty: "",
    imageUrl: "",
  });

  const token = localStorage.getItem("token");

  // ---------- load existing product in edit mode ----------
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(
          `${process.env.REACT_APP_API_URL}/product/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProduct({
          brand: res.data.brand || "",
          model: res.data.model || "",
          price: res.data.price || "",
          description: res.data.description || "",
          category: res.data.category || "",
          color: res.data.color || "",
          storage: res.data.storage || "",
          warranty: res.data.warranty || "",
          imageUrl: res.data.imageUrl || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEditMode, token]);

  // ---------- helpers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    debugger;
    const newErrors = {};
    if (!product.brand.trim()) newErrors.brand = "Brand is required";
    if (!product.model.trim()) newErrors.model = "Model is required";
    if (!product.price || isNaN(product.price) || Number(product.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!product.category.trim()) newErrors.category = "Category is required";
    if (!product.imageUrl.trim())
      newErrors.imageUrl = "Main image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- submit ----------
  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const url = `${process.env.REACT_APP_API_URL}/product${
        isEditMode ? `/${id}` : ""
      }`;

      const method = isEditMode ? "put" : "post";

      await axiosSecure[method](url, product, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        isEditMode
          ? "Product updated successfully"
          : "Product created successfully"
      );
      navigate("/admin-products"); // adjust to your route for product list
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/admin-products");

  const handleFileSelect = async (e) => {
    debugger;
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/product/image`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    // Set the uploaded image path returned by backend
    setProduct((prev) => ({
      ...prev,
      imageUrl: data.imageUrl,
    }));
  } catch (err) {
    console.error("Image upload failed:", err);
  }
};


  if (loading) return <Loader />;

  return (
    <div className="container mt-4 mb-5">
      <Breadcrumb />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-semibold">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h2>
        <button className="btn btn-outline-secondary" onClick={handleCancel}>
          ← Back
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3 admin-product-form">
            {/* Brand */}
            <div className="col-md-4">
              <label className="form-label">Brand</label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                className={`form-control ${errors.brand ? "is-invalid" : ""}`}
              />
              {errors.brand && (
                <div className="invalid-feedback">{errors.brand}</div>
              )}
            </div>

            {/* Model */}
            <div className="col-md-4">
              <label className="form-label">Model</label>
              <input
                type="text"
                name="model"
                value={product.model}
                onChange={handleChange}
                className={`form-control ${errors.model ? "is-invalid" : ""}`}
              />
              {errors.model && (
                <div className="invalid-feedback">{errors.model}</div>
              )}
            </div>

            {/* Price */}
            <div className="col-md-4">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
              />
              {errors.price && (
                <div className="invalid-feedback">{errors.price}</div>
              )}
            </div>

            {/* Category */}
            <div className="col-md-4">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                className={`form-control ${
                  errors.category ? "is-invalid" : ""
                }`}
                placeholder="Flagship, Mid-range, Budget..."
              />
              {errors.category && (
                <div className="invalid-feedback">{errors.category}</div>
              )}
            </div>

            {/* Color */}
            <div className="col-md-4">
              <label className="form-label">Color</label>
              <input
                type="text"
                name="color"
                value={product.color}
                onChange={handleChange}
                className="form-control"
                placeholder="Black, Blue, etc."
              />
            </div>

            {/* Storage */}
            <div className="col-md-4">
              <label className="form-label">Storage</label>
              <input
                type="text"
                name="storage"
                value={product.storage}
                onChange={handleChange}
                className="form-control"
                placeholder="128 GB / 256 GB..."
              />
            </div>

            {/* Warranty */}
            <div className="col-md-4">
              <label className="form-label">Warranty</label>
              <input
                type="text"
                name="warranty"
                value={product.warranty}
                onChange={handleChange}
                className="form-control"
                placeholder="1 Year Manufacturer Warranty"
              />
            </div>

            {/* Image URL */}
            <label className="form-label">Image</label>
            <div className="d-flex gap-3 align-items-start">                
                {/* File upload */}
                <input
                  type="file"
                  accept="image/*"
                  className={`form-control mt-2  ${
                  errors.category ? "is-invalid" : ""
                }`}
                  onChange={(e) => handleFileSelect(e)}
                />

              {/* Preview */}
              {product.imageUrl && (
                <img
                  src={`${API_ROOT}${product.imageUrl}`}
                  alt="Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                  }}
                />
              )}
              {errors.imageUrl && (
                <div className="invalid-feedback">{errors.imageUrl}</div>
              )}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                rows="3"
                value={product.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Short description about the phone"
              />
            </div>

            {/* Buttons */}
            <div className="col-12 d-flex justify-content-end gap-2 mt-2">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update Product"
                  : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
