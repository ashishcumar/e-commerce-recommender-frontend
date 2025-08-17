import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/ProductCard.css";

function ProductCard({ product }) {
  if (!product) return null;

  const price = parseFloat(product.price);

  return (
    <div className="product-card">
      <Link to={`/product/${product.product_id}`} className="product-card-link">
        <img
          src={product.image_url}
          alt={product.name}
          className="product-card-image"
        />
        <div className="product-card-content">
          <h3 className="product-card-title">{product.name}</h3>
          <p className="product-card-category">{product.category}</p>
          {}
          <p className="product-card-price">${price.toFixed(2)}</p>
        </div>
      </Link>
      {}
    </div>
  );
}

export default ProductCard;
