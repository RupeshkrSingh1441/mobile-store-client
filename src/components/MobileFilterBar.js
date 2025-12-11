// src/components/MobileFilterBar.js
import React from "react";

const MobileFilterBar = ({ onOpen }) => {
  return (
    <div className="mobile-filter-bar d-lg-none fixed-bottom bg-white border-top p-2 d-flex justify-content-between align-items-center">
      <button className="btn btn-outline-secondary btn-sm" onClick={() => onOpen("filters")}>
        Filters
      </button>
      <button className="btn btn-outline-secondary btn-sm" onClick={() => onOpen("sort")}>
        Sort
      </button>
    </div>
  );
};

export default MobileFilterBar;
