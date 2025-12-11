// src/pages/ProductList.js
import React, { useState, useEffect, useContext, useMemo } from "react";
import { axiosSecure } from "../api/axiosInstance";
import { CartContext } from "../context/CartContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";
import Sidebar from "../components/Sidebar";
import Loader from "../shared/Loader";
import SkeletonLoader from "../components/SkeletonLoader";
import MobileFilterBar from "../components/MobileFilterBar";
import "./ProductList.css";

const API = process.env.REACT_APP_API_URL;
const API_ROOT = API.replace("/api", "");

const ProductList = () => {
  const { cart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState("filters"); // or "sort"

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 12;

  // Filters read from URL
  const filters = useMemo(() => {
    return {
      q: searchParams.get("q") || "",
      brand: searchParams.get("brand") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sort: searchParams.get("sort") || "",
    };
  }, [searchParams]);

  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 });
    }
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (filters.q) params.append("q", filters.q);
        if (filters.brand) params.append("brand", filters.brand);
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.sort) params.append("sort", filters.sort);

        params.append("page", page);
        params.append("pageSize", pageSize);

        const url = `${API}/store/products?${params.toString()}`;
        const res = await axiosSecure.get(url);

        setProducts(res.data.items || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error("Product fetch error", err);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, page]);

  // When Sidebar changes filter
  const onFilterChange = (newFilters) => {
    const updated = {
      ...Object.fromEntries(searchParams),
      ...newFilters,
      page: 1,
    };

    // remove empty
    Object.keys(updated).forEach(
      (k) =>
        (updated[k] === "" || updated[k] === undefined) && delete updated[k]
    );

    setSearchParams(updated);
  };

  const handleCartAction = (product) => {
    const inCart = cart.some((c) => c.id === product.id);
    if (inCart) navigate("/cart");
    else addToCart(product);
  };

  const openDrawer = (mode) => {
    setDrawerMode(mode);
    setShowDrawer(true);
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    document.body.style.overflow = "";
  };

  const currentFilters = Object.fromEntries([...searchParams]);

  // if (loading) return <Loader />;

  return (
    <div className="container mt-4 product-list-page">
      <Breadcrumb />
      <h2 className="mb-3 fw-semibold">Mobile Phones</h2>

      {/* SORTING BAR (sticky) */}
      <div className="mb-3 bg-white py-2" style={{ top: 72, zIndex: 99 }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <small className="text-muted">Showing</small>{" "}
            <strong>{total}</strong> <small className="text-muted">items</small>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <label className="mb-0 me-2">Sort:</label>
            <select
              className="form-select form-select-sm"
              value={filters.sort || ""}
              onChange={(e) => {
                const sf = {
                  ...Object.fromEntries(searchParams),
                  sort: e.target.value,
                  page: 1,
                };
                Object.keys(sf).forEach(
                  (k) => (sf[k] === "" || sf[k] === undefined) && delete sf[k]
                );
                setSearchParams(sf);
              }}
              style={{ minWidth: 180 }}
            >
              <option value="">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="d-flex gap-4">
        {/* SIDEBAR */}
        <div
          className="d-none d-lg-block"
          style={{ width: "250px", flexShrink: 0 }}
        >
          <Sidebar initial={filters} onFilterChange={onFilterChange} />
        </div>

        {/* PRODUCTS */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <SkeletonLoader count={12} />
          ) : products.length === 0 ? (
            <div className="p-4 bg-white rounded">No products found.</div>
          ) : (
            <div className="product-grid">
              {products.map((product) => {
                const inCart = cart.some((c) => c.id === product.id);
                return (
                  <div key={product.id} className="product-card">
                    

                    <div className="card h-100 border-0 d-flex flex-column">
                      <a
                      href={`/product/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      <div className="card-img-top-wrapper overflow-hidden">
                        <img
                          src={
                            product.imageUrl
                              ? `${API_ROOT}${product.imageUrl}`
                              : "/placeholder.jpg"
                          }
                          className="card-img-top"
                          alt={product.model}
                        />
                      </div>
                      </a>

                      <div className="card-body d-flex flex-column">
                        <h5 className="mb-1">{product.brand}</h5>
                        <small className="text-muted">{product.model}</small>
                        <p className="mt-2 text-muted small flex-grow-1">
                          {product.description}
                        </p>

                        <div className="product-footer mt-3 d-flex justify-content-between align-items-center">
                          <strong>₹{product.price}</strong>
                          <button
                            className={`btn btn-sm ${
                              inCart
                                ? "btn-goto-cart shadow-sm"
                                : "btn-outline-dark"
                            }`}
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
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / pageSize)}
              onPageChange={(p) => {
                setSearchParams({
                  ...currentFilters,
                  page: p,
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile filter bar */}
      <MobileFilterBar onOpen={openDrawer} />

      {/* Mobile drawer (simple) */}
      {showDrawer && (
        <div className="mobile-drawer-overlay" onClick={closeDrawer}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {drawerMode === "filters" ? "Filters" : "Sort"}
              </h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={closeDrawer}
              >
                Close
              </button>
            </div>

            <div className="mobile-drawer-content">
              {drawerMode === "filters" ? (
                <Sidebar
                  initial={filters}
                  onFilterChange={(f) => {
                    onFilterChange(f);
                    closeDrawer();
                  }}
                />
              ) : (
                <div>
                  <label className="form-label">Sort</label>
                  <select
                    className="form-select"
                    value={filters.sort || ""}
                    onChange={(e) => {
                      const sf = {
                        ...Object.fromEntries(searchParams),
                        sort: e.target.value,
                        page: 1,
                      };
                      Object.keys(sf).forEach(
                        (k) =>
                          (sf[k] === "" || sf[k] === undefined) && delete sf[k]
                      );
                      setSearchParams(sf);
                      closeDrawer();
                    }}
                  >
                    <option value="">Recommended</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
