import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api'; 
import ProductCard from '../components/ProductCard';
import '../assets/styles/HomePage.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products. Please ensure the backend is running and accessible.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading-message">Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (products.length === 0) return <div className="no-products-message">No products found.</div>;

  return (
    <div className="home-page">
      <h1>Welcome to our E-Commerce Store!</h1>
      <p>Explore our products and find personalized recommendations.</p>

      <section className="product-listing">
        <h2>All Products</h2>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;