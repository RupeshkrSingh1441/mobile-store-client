import React, { useState, useEffect } from "react";
import { axiosSecure } from "../api/axiosInstance";
import Breadcrumb from "../components/Breadcrumb";

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    brand: "",
    model: "",
    description: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        debugger;
        const res = await axiosSecure.get(`${process.env.REACT_APP_API_URL}/product`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("❌ Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProducts();
  }, [token]);

  // ✅ Handle text field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image upload & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // show live preview
    }
  };

  // ✅ Check if form is valid (all required fields)
  const isFormValid =
    newProduct.brand.trim() &&
    newProduct.model.trim() &&
    newProduct.description.trim() &&
    newProduct.price.toString().trim() &&
    imageFile;

  // ✅ Add new product (with image upload)
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("brand", newProduct.brand);
      formData.append("model", newProduct.model);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("image", imageFile); // backend should expect "image" field

      const res = await axiosSecure.post(
        `${process.env.REACT_APP_API_URL}/product`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts((prev) => [...prev, res.data.product || newProduct]);
      setNewProduct({ brand: "", model: "", description: "", price: "" });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("❌ Failed to add product.");
    }
  };

  // ✅ Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosSecure.delete(`${process.env.REACT_APP_API_URL}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("❌ Failed to delete product.");
    }
  };

  // ✅ Loading & Error UI
  if (loading)
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center">
        <div className="alert alert-danger text-center" style={{ maxWidth: "400px" }}>
          {error}
        </div>
      </div>
    );

  // ✅ Main UI
  return (
    <main className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <Breadcrumb />
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
        <h2 className="admin-title text-center fw-bold mb-4">Admin – Manage Products</h2>

        {/* Product Form */}
        <form onSubmit={handleAddProduct} className="mb-4" encType="multipart/form-data">
          {["brand", "model", "description", "price"].map((field) => (
            <input
              key={field}
              className="form-control mb-3"
              type={field === "price" ? "number" : "text"}
              name={field}
              placeholder={`Product ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              value={newProduct[field]}
              onChange={handleInputChange}
              required
            />
          ))}

          {/* ✅ File Upload Field */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
              required
            />
          </div>

          {/* ✅ Image Preview */}
          {previewUrl && (
            <div className="text-center mb-3">
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={!isFormValid} // ✅ stays disabled until all fields filled
            >
              Add Product
            </button>
          </div>
        </form>

        {/* Product List */}
        <ul className="list-group">
          {products.length === 0 ? (
            <li className="list-group-item text-center text-muted">
              No products available.
            </li>
          ) : (
            products.map((product) => (
              <li
                key={product.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{product.brand}</strong> {product.model} – ₹{product.price}
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
};

export default ProductAdmin;
