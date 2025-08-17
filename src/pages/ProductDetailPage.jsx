import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProductById,
  getProductRecommendations,
  logProductView,
  addProductToCart,
} from "../api";
import ProductCard from "../components/ProductCard";
import "../assets/styles/ProductDetailPage.css";

const FALLBACK_DEMO_USER_ID = 1;

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");

  const [parsedAttributes, setParsedAttributes] = useState({});

  useEffect(() => {
    const fetchProductAndRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        setCartMessage("");

        const productData = await getProductById(productId);
        setProduct(productData);

        let attributesObj = {};
        if (productData.attributes) {
          try {
            attributesObj = JSON.parse(productData.attributes);
          } catch (e) {
            console.error("Error parsing product attributes JSON:", e);
            attributesObj = {};
          }
        }
        setParsedAttributes(attributesObj);

        const userId =
          localStorage.getItem("ecommerce_user_id") || FALLBACK_DEMO_USER_ID;
        if (userId) {
          logProductView(userId, productId).catch((err) =>
            console.error("Failed to log view:", err)
          );
        } else {
          console.warn("No user ID found for logging product view.");
        }

        const recsData = await getProductRecommendations(productId);
        setRecommendations(recsData);
      } catch (err) {
        setError(
          "Failed to load product details or recommendations. " + err.message
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductAndRecommendations();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    const userId = localStorage.getItem("ecommerce_user_id");
    if (!userId) {
      setCartMessage("Please log in to add items to your cart.");
      return;
    }

    try {
      setCartMessage("Adding to cart...");

      addProductToCart(userId, product);
      setCartMessage(`${product.name} added to cart!`);
    } catch (err) {
      setCartMessage("Failed to add to cart: " + err.message);
      console.error(err);
    }
  };

  if (loading)
    return <div className="loading-message">Loading product details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product)
    return <div className="no-product-message">Product not found.</div>;

  const productPrice = parseFloat(product.price);

  return (
    <div className="product-detail-page">
      <div className="product-detail-card">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-detail-image"
        />
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-category">
            Category: {product.category}
          </p>
          <p className="product-detail-price">${productPrice.toFixed(2)}</p>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-stock">
            In Stock: {product.stock_quantity}
          </p>

          {parsedAttributes && Object.keys(parsedAttributes).length > 0 && (
            <div className="product-detail-attributes">
              <h3>Attributes:</h3>
              <ul>
                {Object.entries(parsedAttributes).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                    {Array.isArray(value) ? (
                      value.join(", ")
                    ) : typeof value === "object" && value !== null ? (
                      key === "dimensions" ? (
                        <>
                          <b>depth</b> : {value.depth}cm, <b>height</b> :
                          {value.height}cm, <b>width</b> : {value.width}cm
                        </>
                      ) : (
                        JSON.stringify(value)
                      )
                    ) : (
                      value
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={handleAddToCart} className="add-to-cart-button">
            Add to Cart
          </button>
          {cartMessage && <p className="cart-message">{cartMessage}</p>}
        </div>
      </div>

      <section className="recommendations-section">
        <h2>Recommended For You</h2>
        {recommendations.length > 0 ? (
          <div className="product-grid">
            {recommendations.map((recProduct) => (
              <ProductCard key={recProduct.product_id} product={recProduct} />
            ))}
          </div>
        ) : (
          <p className="no-recommendations">
            No specific recommendations found. Explore other products!
          </p>
        )}
      </section>
    </div>
  );
}

export default ProductDetailPage;
