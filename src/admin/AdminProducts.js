import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Pagination from "../components/Pagination";
import Loader from "../shared/Loader";

const API_ROOT = process.env.REACT_APP_API_URL.replace("/api", "");

const AdminProducts = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    handleSearch(search);
  }, [search, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/product`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Res:", res.data);
      setProducts(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (!text.trim()) {
      setFiltered(products);
      return;
    }

    const s = text.toLowerCase();
    const f = products.filter(
      (p) =>
        p.brand?.toLowerCase().includes(s) ||
        p.model?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s)
    );

    setFiltered(f);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product deleted");
      loadProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  // pagination slicing
  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const pageData = filtered.slice(start, start + pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // smooth scroll to table top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="container mt-4 mb-5">
      <Breadcrumb />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-semibold">Products</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin-products/new")}
        >
          + Add Product
        </button>
      </div>

      {/* Search bar */}
      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by brand, model or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {loading ? (
            <Loader />
          ) : filtered.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Storage</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {pageData.map((p, i) => (
                    <tr key={p.id}>
                      <td>{start + i + 1}</td>

                      <td>
                        <img
                          src={
                            p.imageUrl
                              ? `${API_ROOT}${p.imageUrl}`
                              : "/placeholder.jpg"
                          }
                          alt={p.model}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: "6px",
                          }}
                        />
                      </td>

                      <td>{p.brand}</td>
                      <td>{p.model}</td>
                      <td>₹{p.price}</td>
                      <td>{p.category || "-"}</td>
                      <td>{p.storage || "-"}</td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() =>
                            navigate(`/admin-products/edit/${p.id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
