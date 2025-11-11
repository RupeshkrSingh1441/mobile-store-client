import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [pincode, setPincode] = useState("");
  const [reviews, setReviews] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductFull = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/store/product-full/${id}`
        );

        const data = res.data;
        console.log(data);
        setProduct(data.product);
        setImages(data.images || []);
        setMainImage(data.images?.[0] || data.product.imageUrl);
        setFeatures(data.features || []);
        setRelatedProducts(data.relatedProducts || []);
        setReviews(data.reviews || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductFull();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleCheckPincode = async () => {
    if (!pincode) return toast.error("Enter pincode");

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/store/delivery/${pincode}`
      );
      toast.info(res.data.message);
    } catch (err) {
      toast.error("Unable to check delivery availability");
    }
  };

  if (loading || !product)
    return <div className="text-center mt-5">Loading...</div>;

  const inCart = cart.some((x) => x.id === product.id);

  return (
    <div className="container my-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="row g-5">
        {/* === Left: Images === */}
        <div className="col-md-5 text-center">
          <img
            src={mainImage || "/placeholder.jpg"}
            alt={product.model}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "350px", objectFit: "contain" }}
          />

          {/* Thumbnails */}
          <div className="mt-3 d-flex gap-2 flex-wrap justify-content-center">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumbnail"
                onClick={() => setMainImage(img)}
                style={{
                  width: "70px",
                  height: "70px",
                  border:
                    mainImage === img ? "2px solid #007bff" : "1px solid #ccc",
                  cursor: "pointer",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            ))}
          </div>
        </div>

        {/* === Right: Details === */}
        <div className="col-md-7">
          <h3>
            {product.brand} {product.model}
          </h3>
          <h5 className="text-secondary">
            {product.category || "Mobile Phone"}
          </h5>
          <h4 className="text-success">₹{product.price}</h4>

          <div className="d-flex gap-3 mb-4">
            <button
              className={`btn ${
                inCart
                  ? "btn-goto-cart shadow-sm"
                  : "btn-outline-secondary shadow-sm"
              }`}
              onClick={() => (inCart ? navigate("/cart") : handleAddToCart())}
            >
              {inCart ? "Go to Cart" : "Add to Cart"}
            </button>

            <button className="btn btn-success">Buy Now</button>
          </div>

          {/* Pincode Check */}
          <div className="mt-4">
          <h5 className="fw-semibold  mb-3">Check Delivery Availability</h5>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Enter pincode"
              maxLength="6"
              style={{ width: "180px" }}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <button
              className="btn btn-outline-primary"
              onClick={handleCheckPincode}
            >
              Check
            </button>
          </div>
            </div>

          {/* Description */}
          <div className="mt-4">
          <h5 className="mt-4 fw-semibold">About this item</h5>
          <p>{product.description}</p>
            </div>

          {/* Specifications */}
          <div className="mt-4">
          <h5 className="mt-3 fw-semibold">Specifications</h5>
          <ul className="list-unstyled">
            <li>Brand: {product.brand}</li>
            <li>Model: {product.model}</li>
            <li>Storage: {product.storage || "128GB"}</li>
            <li>Color: {product.color || "Black"}</li>
            <li>
              Warranty: {product.warranty || "1 Year Manufacturer Warranty"}
            </li>
          </ul>
          </div>
            {/* Key Features */}
          <div className="mt-4">
            <h5 className="fw-semibold  mb-3">Key Features</h5>

            <ul className="list-unstyled">
              {features.map((f) => (
                <li className="mb-2 d-flex" key={f.id}>
                  <span
                    style={{
                      color: "#0d6efd",
                      fontSize: "18px",
                      marginRight: "8px",
                    }}
                  >
                    ✔
                  </span>
                  <div>
                    <strong>{f.featureTitle}</strong>
                    <p className="text-muted mb-0">{f.featureDescription}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* === Related Products === */}
      {relatedProducts.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-semibold mb-3 text-primary">Related Products</h4>
          <div className="row g-3">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="col-6 col-md-3"
                onClick={() => navigate(`/product/${rel.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card text-center shadow-sm border-0 h-100">
                  <img
                    src={rel.imageUrl}
                    alt={rel.brand}
                    className="card-img-top p-3"
                    style={{ height: "150px", objectFit: "contain" }}
                  />
                  <div className="card-body">
                    <h6>{rel.brand}</h6>
                    <p className="text-muted small">{rel.model}</p>
                    <p className="fw-bold text-success">₹{rel.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Customer Reviews === */}
      <div className="mt-5">
        <h4 className="fw-semibold mb-4 text-primary">Customer Reviews</h4>

        {reviews.length === 0 ? (
          <p className="text-muted">No reviews available for this product.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="p-3 mb-3 border rounded shadow-sm bg-light"
            >
              <div className="d-flex justify-content-between">
                <strong>{review.userName}</strong>
                <small className="text-muted">
                  {new Date(review.reviewDate).toLocaleDateString()}
                </small>
              </div>

              {/* Rating stars */}
              <div className="text-warning mt-1">
                {"⭐".repeat(review.rating)}{" "}
                <span className="text-muted small">({review.rating}/5)</span>
              </div>

              <p className="mt-2 mb-0">{review.reviewText}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
