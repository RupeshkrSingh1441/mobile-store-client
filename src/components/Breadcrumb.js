// src/components/Breadcrumb.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Breadcrumb.css";

const Breadcrumb = () => {
  const location = useLocation();
  const [product, setProduct] = useState(null);

  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Fetch product when URL includes /product/:id
  useEffect(() => {
    const fetchProduct = async () => {
      const productIndex = pathSegments.indexOf("product");

      if (productIndex !== -1 && pathSegments[productIndex + 1]) {
        const productId = pathSegments[productIndex + 1];
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/store/products/${productId}`
          );
          setProduct(res.data);
        } catch (err) {
          console.error("Failed to load product", err);
        }
      }
    };

    fetchProduct();
  }, [location.pathname]);

  const buildPath = (index) => "/" + pathSegments.slice(0, index + 1).join("/");

  const formatSegment = (segment, index) => {
    // Product page special handling
    if (segment === "product") return "";

    if (pathSegments[index - 1] === "product" && product) {
      return `${product.brand} / ${product.model}`;
    }

    return decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <nav className="breadcrumb-nav">
      <ol className="breadcrumb-list">
        <li>
          <Link to="/" className="breadcrumb-link">
            Home
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const label = formatSegment(segment, index);
          const url = buildPath(index);

          return (
            <li key={index} className={isLast ? "active" : ""}>
              {isLast ? (
                <span>{label}</span>
              ) : (
                <Link to={url} className="breadcrumb-link">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
