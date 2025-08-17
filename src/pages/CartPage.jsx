import React, { useEffect, useState } from "react";
import {
  getCartByUserId,
  updateCartItemQuantity,
  removeProductFromCart,
} from "../api";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/CartPage.css";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("ecommerce_user_id");

  const loadCartFromStorage = () => {
    if (!userId) {
      setError("Please log in to view your cart.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      const userCart = getCartByUserId(userId);
      setCartItems(userCart);

      if (userCart.length === 0) {
        setMessage("Your cart is empty. Start shopping!");
      } else {
        setMessage("");
      }
    } catch (err) {
      setError("Failed to load cart from local storage. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartFromStorage();
  }, [userId]);

  const handleUpdateQuantity = (productId, newQuantity) => {
    setMessage("");
    try {
      const updatedCart = updateCartItemQuantity(
        userId,
        productId,
        newQuantity
      );
      setCartItems(updatedCart);
      setMessage("Cart updated successfully!");
    } catch (err) {
      setMessage("Failed to update cart: " + err.message);
      console.error(err);
    }
  };

  const handleRemoveItem = (productId) => {
    setMessage("");
    try {
      const updatedCart = removeProductFromCart(userId, productId);
      setCartItems(updatedCart);
      setMessage("Item removed from cart!");
    } catch (err) {
      setMessage("Failed to remove item: " + err.message);
      console.error(err);
    }
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;

    return cartItems.reduce(
      (sum, item) =>
        sum + item.quantity * parseFloat(item.productDetails.price),
      0
    );
  };

  if (loading) return <div className="loading-message">Loading cart...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!userId)
    return (
      <div className="no-user-message">
        Please <Link to="/login">log in</Link> to view your cart.
      </div>
    );

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      {message && <p className="cart-message">{message}</p>}

      {}
      {cartItems && cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item-card">
                {" "}
                {}
                {}
                <Link
                  to={`/product/${item.productId}`}
                  className="cart-item-image-link"
                >
                  <img
                    src={item.productDetails.image_url}
                    alt={item.productDetails.name}
                    className="cart-item-image"
                  />
                </Link>
                <div className="cart-item-details">
                  {}
                  <h3 className="cart-item-title">
                    <Link to={`/product/${item.productId}`}>
                      {item.productDetails.name}
                    </Link>
                  </h3>
                  {}
                  <p className="cart-item-price">
                    ${parseFloat(item.productDetails.price).toFixed(2)}
                  </p>
                  {}
                  <div className="cart-item-quantity-controls">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  {}
                  <p className="cart-item-total">
                    Subtotal: $
                    {(
                      item.quantity * parseFloat(item.productDetails.price)
                    ).toFixed(2)}
                  </p>
                </div>
                {}
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="remove-item-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
            <button
              onClick={() => navigate("/checkout")}
              className="checkout-button"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p className="empty-cart-message">
          Your cart is empty. <Link to="/">Start shopping!</Link>
        </p>
      )}
    </div>
  );
}

export default CartPage;
