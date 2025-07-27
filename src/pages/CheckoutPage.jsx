// e-commerce-recommender-frontend/src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCartByUserId, createOrder } from '../api';
import '../assets/styles/CheckoutPage.css';

function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('ecommerce_user_id');

  useEffect(() => {
    if (!userId) {
      setError('Please log in to proceed to checkout.');
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getCartByUserId(userId);
        setCart(data);
        if (data && data.items && data.items.length === 0) {
          setOrderStatus('Your cart is empty. Please add items before checking out.');
        }
      } catch (err) {
        setError('Failed to fetch cart for checkout: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const handlePlaceOrder = async () => {
    if (!userId) {
      setOrderStatus('Please log in to place an order.');
      return;
    }
    if (!cart || !cart.items || cart.items.length === 0) {
      setOrderStatus('Cannot place order: Your cart is empty.');
      return;
    }

    setOrderStatus('Placing your order...');
    try {
      const order = await createOrder(); // This API assumes authenticated user for request.user
      setOrderStatus(`Order placed successfully! Order ID: ${order.order_id}. Redirecting...`);
      setCart(prevCart => ({ ...prevCart, items: [] }));
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setOrderStatus('Failed to place order: ' + err.message);
      console.error(err);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    // Ensure product.price is converted to a number for calculation
    return cart.items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.product.price)), 0);
  };

  if (loading) return <div className="loading-message">Loading checkout details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="checkout-page">
      <h2>Checkout Summary</h2>
      {orderStatus && <p className="order-status-message">{orderStatus}</p>}

      {cart && cart.items && cart.items.length > 0 ? (
        <>
          <div className="checkout-items">
            <h3>Items in your cart:</h3>
            <ul>
              {cart.items.map(item => (
                <li key={item.cart_item_id}>
                  {item.product.name} ({item.quantity}) - ${parseFloat(item.product.price).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          <div className="checkout-summary-details">
            <h3>Total Amount: ${calculateTotal().toFixed(2)}</h3>
          </div>
          <button onClick={handlePlaceOrder} className="place-order-button">Place Order</button>
        </>
      ) : (
        <p className="empty-checkout-message">Your cart is empty. Please <Link to="/">add items</Link> to proceed.</p>
      )}
    </div>
  );
}

export default CheckoutPage;