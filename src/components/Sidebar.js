// src/components/Sidebar.js
import React, { useEffect, useState } from "react";
import { axiosSecure } from "../api/axiosInstance";
import "./Sidebar.css";

const Sidebar = ({ onFilterChange, initial }) => {
  const [brands, setBrands] = useState([]);

  const [category, setCategory] = useState(initial.category || "");
  const [brand, setBrand] = useState(initial.brand || "");
  const [minPrice, setMinPrice] = useState(initial.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice || "");
  const [sort, setSort] = useState(initial.sort || "");

  useEffect(() => {
    axiosSecure
      .get(`${process.env.REACT_APP_API_URL}/store/brands`)
      .then((res) => setBrands(res.data || []));
  }, []);

  useEffect(() => {
    onFilterChange({ brand, category, minPrice, maxPrice, sort });
  }, [brand, category, minPrice, maxPrice, sort]);

    const clearFilters = () => {
    setBrand("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    // onFilterChange will auto-fire from effects
  };

  return (
    <aside className="sidebar-container">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h5 className="sidebar-title mb-0">Filters</h5>
        <button className="btn btn-link p-0 text-muted" onClick={clearFilters}>
          Clear
        </button>
      </div>

      <div className="sidebar-section mb-3">
        <label className="form-label">Category</label>
        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          <option value="Smartphone">Smartphone</option>
          <option value="Accessory">Accessory</option>
        </select>
      </div>

      <div className="sidebar-section mb-3">
        <label className="form-label">Brand</label>
        <select className="form-select" value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="sidebar-section mb-3">
        <label className="form-label">Price</label>
        <div className="price-inputs d-flex gap-2">
          <input
          className="form-control"
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
          className="form-control"
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-section mb-1">
        <label className="form-label">Sort</label>
        <select className="form-select"  value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Recommended</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="mt-3">
        <button className="btn btn-primary w-100" onClick={() => onFilterChange({ brand, category, minPrice, maxPrice, sort })}>
          Apply
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
