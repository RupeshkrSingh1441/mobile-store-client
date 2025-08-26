import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import CheckoutButton from '../components/CheckoutButton';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {addToCart} = useContext(CartContext);
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/store/products`)
                .then(res =>setProducts(res.data));
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
            <div className="product-list" >
                {products.map(product => (
                        <div className="product-card" key={product.id}>
                            <img src={product.imageUrl || "/placeholder.jpg"} alt={product.brand} className="product-image mb-3 w-100" 
                            style={{ height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div className="product-info">
                                <h5 className="product-name">{product.brand}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{product.model}</h6>
                                <p className="product-description">{product.description}</p>
                                <strong className="product-price">
                                    {/* ₹{product.price.toLocaleString()} */}
                                    <CheckoutButton amount={product.price} />
                                    </strong>
                                <button className={`btn w-100 ${addedId === product.id ? 'btn-success' : 'btn-primary'}`}
                                onClick={() => handleAddToCart(product)}disabled={addedId === product.id}
                                    >
                                        {addedId === product.id ? 'Added!' : 'Add to Cart'}
                                    </button>
                            </div>
                        </div>
                ))}
               </div> 
               </div>
        </div>
    );
}

export default ProductList;