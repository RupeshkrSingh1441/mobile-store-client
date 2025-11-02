import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import CheckoutButton from "../components/CheckoutButton";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [addedId, setAddedId] = useState(null);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");

  
    const fetchProducts = async () => {
        setLoading(true);
      try {
        let query =
        `${process.env.REACT_APP_API_URL}/store/products?`;
            if(search) query += `&search=${search}`;
            if(brand) query += `&brand=${brand}`;
            
            const res = await axios.get(query);
            setProducts(res.data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

useEffect(() => {
    fetchProducts();
  }, [search, brand]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4 mb-10">
      <h2>Mobile Phones</h2>
      <div className="row mt-4 mb-5">

        <div className=" filters mb-20">
            <input
            type="text"
            placeholder="Search by model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
                />
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="ms-2">
                <option value="">All Brands</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="OnePlus">OnePlus</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Google">Google</option>
            </select>
            {/* <button className="btn btn-secondary ms-2" onClick={fetchProducts}>Apply</button> */}
            </div>

        <div className="product-list">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
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
                  <strong className="product-price">
                    {/* ₹{product.price.toLocaleString()} */}
                    <CheckoutButton amount={product.price} />
                  </strong>
                  <button
                    className={`btn ${
                      addedId === product.id ? "btn-success" : "btn-primary"
                    }`}
                    style={{ minWidth: "120px" }}
                    onClick={() => handleAddToCart(product)}
                    disabled={addedId === product.id}
                  >
                    {addedId === product.id ? "Added!" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
