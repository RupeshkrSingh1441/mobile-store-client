import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductAdmin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newProduct, setNewProduct] = useState({
        brand: '',
        model: '',
        description: '',
        price: '',
        imageUrl: ''
    });
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/product`,{
                    headers: {Authorization: `Bearer ${token}`}
                }).then(res => {
                    setProducts(res.data.products || []);
                });
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/product`, newProduct,{
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                console.log(res.data);
            });
            setProducts([...products, newProduct]);
            setNewProduct({ brand: '',model: '', description: '', price: '', imageUrl: '' });
        } catch (err) {
            setError('Failed to add product');
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/product/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                console.log(res.data);

                setProducts(products.filter(product => product.id !== id));
            });
        } catch (err) {
            setError('Failed to delete product');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Admin - Manage Products</h2>
            <form onSubmit={handleAddProduct} className="mb-4">
                <input className="form-control mb-2" type="text" name="brand" placeholder="Product Brand" value={newProduct.brand} onChange={handleInputChange} required />
                <input className="form-control mb-2" type="text" name="model" placeholder="Product Model" value={newProduct.model} onChange={handleInputChange} required />
                <input className="form-control mb-2" type="text" name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} required />
                <input className="form-control mb-2" type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} required />
                <input className="form-control mb-2" type="text" name="imageUrl" placeholder="Image URL" value={newProduct.imageUrl} onChange={handleInputChange} />
                <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
            <ui className="list-group">
                {products.map(product => (
                    <li key={product.id} className="list-group-item d-flex justify-content-between">
                        <div>{product.name} - ${product.price}</div>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </li>
                ))}
            </ui>
        </div>
    );
};
export default ProductAdmin;