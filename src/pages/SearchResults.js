import React, { useEffect, useState } from "react";
import { axiosSecure } from "../api/axiosInstance";
import { useSearchParams } from "react-router-dom";
import ProductList from "./ProductList";

const API = process.env.REACT_APP_API_URL;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosSecure.get(`${API}/product/search?q=${query}`);
      setResults(res.data);
    };
    fetchData();
  }, [query]);

  return (
    <div className="container mt-4">
      <h3>Search results for “{query}”</h3>

      <div className="row mt-3">
        {results.length === 0 ? (
          <p>No items found.</p>
        ) : (
          results.map((p) => (
            <div key={p.id} className="col-md-3">
              <ProductList product={p} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;
