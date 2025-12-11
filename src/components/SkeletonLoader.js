// src/components/SkeletonLoader.js
import React from "react";

const SkeletonCard = () => (
  <div className="card product-card h-100" aria-hidden="true">
    <div style={{ height: 260, background: "#f1f5f9", width: "100%" }} />
    <div className="card-body">
      <div style={{ height: 20, width: "60%", background: "#eef2ff", marginBottom: 8 }} />
      <div style={{ height: 14, width: "40%", background: "#eef2ff", marginBottom: 12 }} />
      <div style={{ height: 12, width: "100%", background: "#f3f4f6", marginBottom: 28 }} />
      <div style={{ height: 36, width: "100%", background: "#eef2ff" }} />
    </div>
  </div>
);

const SkeletonLoader = ({ count = 8 }) => {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
