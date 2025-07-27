// e-commerce-recommender-frontend/src/pages/CartPage.jsx

import React, { useEffect, useState } from 'react';
import { getCartByUserId, updateCartItemQuantity, removeProductFromCart } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/styles/CartPage.css';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('ecommerce_user_id');

  useEffect(() => {
    if (!userId) {
      setError('Please log in to view your cart.');
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getCartByUserId(userId);
        setCart(data);
      } catch (err) {
        setError('Failed to fetch cart. ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    setMessage('');
    try {
      await updateCartItemQuantity(userId, productId, newQuantity);
      setMessage('Cart updated successfully!');
      const updatedCart = await getCartByUserId(userId);
      setCart(updatedCart);
    } catch (err) {
      setMessage('Failed to update cart: ' + err.message);
      console.error(err);
    }
  };

  const handleRemoveItem = async (productId) => {
    setMessage('');
    try {
      await removeProductFromCart(userId, productId);
      setMessage('Item removed from cart!');
      const updatedCart = await getCartByUserId(userId);
      setCart(updatedCart);
    } catch (err) {
      setMessage('Failed to remove item: ' + err.message);
      console.error(err);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    // Ensure product.price is converted to a number for calculation
    return cart.items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.product.price)), 0);
  };

  if (loading) return <div className="loading-message">Loading cart...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!userId) return <div className="no-user-message">Please <Link to="/login">log in</Link> to view your cart.</div>;


  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      {message && <p className="cart-message">{message}</p>}

      {cart && cart.items && cart.items.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.cart_item_id} className="cart-item-card">
                <Link to={`/product/${item.product.product_id}`} className="cart-item-image-link">
                  <img src={item.product.image_url} alt={item.product.name} className="cart-item-image" />
                </Link>
                <div className="cart-item-details">
                  <h3 className="cart-item-title"><Link to={`/product/${item.product.product_id}`}>{item.product.name}</Link></h3>
                  {/* Convert item.product.price to a number */}
                  <p className="cart-item-price">${parseFloat(item.product.price).toFixed(2)}</p>
                  <div className="cart-item-quantity-controls">
                    <button onClick={() => handleUpdateQuantity(item.product.product_id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.product.product_id, item.quantity + 1)}>+</button>
                  </div>
                  {/* Convert item.product.price to a number */}
                  <p className="cart-item-total">Subtotal: ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}</p>
                </div>
                <button onClick={() => handleRemoveItem(item.product.product_id)} className="remove-item-button">Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
            <button onClick={() => navigate('/checkout')} className="checkout-button">Proceed to Checkout</button>
          </div>
        </>
      ) : (
        <p className="empty-cart-message">Your cart is empty. <Link to="/">Start shopping!</Link></p>
      )}
    </div>
  );
}

export default CartPage;