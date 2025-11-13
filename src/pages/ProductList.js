import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CheckoutButton from "../components/CheckoutButton";
import { toast } from "react-toastify";
import Loader from "../components/Loader";


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart } = useContext(CartContext);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = `${process.env.REACT_APP_API_URL}/store/products?`;
      if (search) query += `&search=${search}`;
      if (brand) query += `&brand=${brand}`;

      const res = await axios.get(query);
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchProducts();
  }, [search, brand]);

  // ✅ Handle Add or Go to Cart
  const handleCartAction = (product) => {
    const inCart = cart.some((item) => item.id === product.id);
    if (inCart) {
      // Redirect to cart page
      navigate("/cart");
    } else {
      // Add product to cart
      addToCart(product);
      toast.success(`${product.brand} added to cart!`, {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  if (loading)return <Loader />;;
  if (error) return <div className="text-danger mt-5">{error}</div>;

  return (
    <div className="container mt-4 mb-10">
      <h2 className="mb-4 fw-semibold">Mobile Phones</h2>

      {/* Filters */}
      <div className="filters mb-4 d-flex">
        <input
          type="text"
          placeholder="Search by model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="ms-2"
        >
          <option value="">All Brands</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="OnePlus">OnePlus</option>
          <option value="Xiaomi">Xiaomi</option>
          <option value="Google">Google</option>
        </select>
      </div>

      {/* Products */}
      <div className="product-list">
        {products.map((product) => {
          const inCart = cart.some((item) => item.id === product.id);

          return (
            <div className="product-card" key={product.id} onClick={() => navigate(`/product/${product.id}`)} 
            style={{ cursor: "pointer" }}>
              <img
                src={product.imageUrl || "/placeholder.jpg"}
                alt={product.brand}
                className="product-image mb-3 w-100"
                style={{
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <div className="product-info">
                <h5 className="product-name">{product.brand}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {product.model}
                </h6>
                <p className="product-description">{product.description}</p>

                <div className="d-flex gap-2 align-items-center mb-2">
                  <CheckoutButton amount={product.price} />

                  <button
                    className={`btn ${
                      inCart
                        ? "btn-goto-cart shadow-sm"
                        : "btn-outline-secondary shadow-sm"
                    }`}
                    style={{ minWidth: "120px" }}
                    onClick={() => handleCartAction(product)}
                  >
                    {inCart ? "Go to Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
