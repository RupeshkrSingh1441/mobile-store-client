import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CheckoutButton from "../components/CheckoutButton";
import { toast } from "react-toastify";
import Loader from "../shared/Loader";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart } = useContext(CartContext);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // or 8 for mobile grid
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    console.log("In Cart:", inCart);
    if (inCart) {
      // Redirect to cart page
      navigate("/cart");
    } else {
      // Add product to cart
      addToCart(product);
      // toast.success(`${product.brand} added to cart!`, {
      //   position: "top-right",
      //   autoClose: 1500,
      // });
    }
  };

  const handlePageChange = (page) => {
  setCurrentPage(page);

  // Smooth scroll to top of the page/table
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};


  if (loading) return <Loader />;
  if (error) return <div className="text-danger mt-5">{error}</div>;

  return (
    <div className="container mt-4 mb-10">
      <Breadcrumb />

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
        {currentItems.map((product) => {
          const inCart = cart.some((item) => item.id === product.id);

          return (
            <div
              className="product-card"
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
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
                  <div onClick={(e) => e.stopPropagation()}>
                    <CheckoutButton amount={product.price} />
                  </div>

                  <button
                    className={`btn ${
                      inCart
                        ? "btn-goto-cart shadow-sm"
                        : "btn-outline-secondary shadow-sm"
                    }`}
                    style={{ minWidth: "120px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCartAction(product);
                    }}
                  >
                    {inCart ? "Go to Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductList;
