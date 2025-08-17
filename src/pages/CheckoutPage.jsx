import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCartByUserId, createOrder } from "../api";
import "../assets/styles/CheckoutPage.css";

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("ecommerce_user_id");

  const loadCartFromStorage = () => {
    if (!userId) {
      setError("Please log in to proceed to checkout.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      const userCart = getCartByUserId(userId);
      setCartItems(userCart);

      if (userCart.length === 0) {
        setOrderStatus(
          "Your cart is empty. Please add items before checking out."
        );
      } else {
        setOrderStatus("");
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

  const handlePlaceOrder = () => {
    if (!userId) {
      setOrderStatus("Please log in to place an order.");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      setOrderStatus("Cannot place order: Your cart is empty.");
      return;
    }

    setOrderStatus("Placing your order...");
    try {
      createOrder(userId);

      setOrderStatus(`Order placed successfully! Redirecting...`);
      setCartItems([]);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setOrderStatus("Failed to place order: " + err.message);
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

  if (loading)
    return <div className="loading-message">Loading checkout details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="checkout-page">
      <h2>Checkout Summary</h2>
      {}
      {orderStatus && <p className="order-status-message">{orderStatus}</p>}

      {}
      {cartItems && cartItems.length > 0 ? (
        <>
          <div className="checkout-items">
            <h3>Items in your cart:</h3>
            <ul>
              {cartItems.map((item) => (
                <li key={item.productId}>
                  {" "}
                  {}
                  <span>
                    {item.productDetails.name} ({item.quantity})
                  </span>
                  <span>
                    ${parseFloat(item.productDetails.price).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {}
          <div className="checkout-summary-details">
            <h3>Total Amount: ${calculateTotal().toFixed(2)}</h3>
          </div>
          {}
          <button onClick={handlePlaceOrder} className="place-order-button">
            Place Order
          </button>
        </>
      ) : (
        <p className="empty-checkout-message">
          Your cart is empty. Please <Link to="/">add items</Link> to proceed.
        </p>
      )}
    </div>
  );
}

export default CheckoutPage;
