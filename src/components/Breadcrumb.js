import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumb.css";

const Breadcrumb = ({ productName }) => {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((x) => x && x.trim() !== "");

  // Build clean breadcrumb list
  const crumbs = [];

  // Always include Home
  crumbs.push({ label: "Home", url: "/" });

  // Handle Admin Products section
  if (pathSegments[0] === "admin-products") {
    crumbs.push({
      label: "Admin Products",
      url: "/admin-products",
    });

    // Add Product
    if (pathSegments.includes("add")) {
      crumbs.push({
        label: "Add Product",
        url: null, // not clickable
      });
    }

    // Edit Product: pattern /admin-products/edit/:id
    if (pathSegments.includes("edit")) {
      crumbs.push({
        label: "Edit Product",
        url: null, // not clickable
      });
    }
  }

  // Product Detail page → /product/:id
if (pathSegments[0] === "product" && pathSegments.length === 2) {
  crumbs.push({
    label: "Products",
    url: null, // not clickable
  });

  crumbs.push({
    label: productName || "Product Details",
    url: null
  });
}

if(pathSegments[0] === "cart") {
    crumbs.push({
      label: "Cart",
      url: null,
    });   
}

if(pathSegments[0] === "profile") {
    crumbs.push({
      label: "Profile",
      url: null,
    });   
}

if(pathSegments[0] === "admin-order") {
    crumbs.push({
      label: "Admin Orders",
      url: null,
    });   
}

  // --- You can extend same pattern for other admin sections later ---
  // Example: admin-orders, admin-users, etc.

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-wrapper">
      <ol className="breadcrumb">
         

        {crumbs.map((c, index) => (
          <li
            key={index}
            className={
              index === crumbs.length - 1
                ? "breadcrumb-item active"
                : "breadcrumb-item"
            }
          >
            {c.url ? (
              <Link to={c.url} className="breadcrumb-link">
                {c.label}
              </Link>
            ) : (
              <span>{c.label}</span>
            )}
          </li>
        ))}

      </ol>
    </nav>
  );
};

export default Breadcrumb;
