// e-commerce-recommender-frontend/src/pages/HomePage.jsx

import React, { useEffect, useState } from "react";
import { getAllProducts } from "../api";
import ProductCard from "../components/ProductCard";
import "../assets/styles/HomePage.css"; // Updated CSS for new sections

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0); // For slideshow
  const [slideshowProducts, setSlideshowProducts] = useState([]); // Products for the slideshow

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);

        // Select a few products for the slideshow (e.g., first 5 or random)
        // Ensure they have images.
        const productsWithImages = data.filter((p) => p.image_url);
        const selectedSlides = productsWithImages.slice(0, 5); // Take the first 5 with images
        setSlideshowProducts(selectedSlides);
      } catch (err) {
        setError(
          "Failed to fetch products. Please ensure the backend is running and accessible."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Slideshow logic
  useEffect(() => {
    localStorage.setItem("ecommerce_user_id", 1);
    if (slideshowProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide(
          (prevSlide) => (prevSlide + 1) % slideshowProducts.length
        );
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [slideshowProducts]);

  if (loading)
    return <div className="loading-message">Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-page">
      {/* Hero Section with Slideshow */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Favorite Product</h1>
          <p className="hero-subtitle">
            Explore our curated collection and find personalized recommendations
            tailored just for you.
          </p>
          <button className="hero-button primary-button">
            Explore Collection
          </button>
        </div>

        {slideshowProducts.length > 0 && (
          <div className="slideshow-container">
            {slideshowProducts.map((product, index) => (
              <img
                key={product.product_id}
                src={product.image_url}
                alt={product.name}
                className={`slideshow-image ${
                  index === currentSlide ? "active" : ""
                }`}
              />
            ))}
            <div className="slideshow-dots">
              {slideshowProducts.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Main Product Listing Section */}
      <section className="product-listing-section">
        <h2 className="section-title">Featured Products</h2>
        {products.length === 0 ? (
          <div className="no-products-message">No products found.</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
