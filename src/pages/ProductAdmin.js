import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    brand: "",
    model: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await axios
          .get(`${process.env.REACT_APP_API_URL}/product`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setProducts(res.data.products || []);
          });
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(`${process.env.REACT_APP_API_URL}/product`, newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data);
        });
      setProducts([...products, newProduct]);
      setNewProduct({
        brand: "",
        model: "",
        description: "",
        price: "",
        imageUrl: "",
      });
    } catch (err) {
      setError("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios
        .delete(`${process.env.REACT_APP_API_URL}/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data);

          setProducts(products.filter((product) => product.id !== id));
        });
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin - Manage Products</h2>
      <form onSubmit={handleAddProduct} className="admin-form mb-4">
        <input
          className="form-control mb-2"
          type="text"
          name="brand"
          placeholder="Product Brand"
          value={newProduct.brand}
          onChange={handleInputChange}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          name="model"
          placeholder="Product Model"
          value={newProduct.model}
          onChange={handleInputChange}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
          required
        />
        <input
          className="form-control mb-2"
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={newProduct.imageUrl}
          onChange={handleInputChange}
        />
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "120px" }}
          >
            Add Product
          </button>
        </div>
      </form>
      <ul className="admin-list-group list-group">
        {products.map((product) => (
          <li
            key={product.id}
            className="admin-list-group-item list-group-item"
          >
            <div>
              {product.brand} {product.model} - ₹{product.price}
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteProduct(product.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProductAdmin;
