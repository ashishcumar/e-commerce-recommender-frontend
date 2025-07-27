const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apiRequest = async (url, method = 'GET', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || errorData.error || 'Something went wrong!');
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// --- User API ---
export const createUser = (userData) => apiRequest('/users/', 'POST', userData);
export const getUser = (userId) => apiRequest(`/users/${userId}/`);

export const getAllProducts = () => apiRequest('/products/');
export const getProductById = (productId) => apiRequest(`/products/${productId}/`);
export const getProductRecommendations = (productId) => apiRequest(`/products/${productId}/recommendations/`);

// --- Cart API ---
export const getCartByUserId = (userId) => apiRequest(`/users/${userId}/cart/`);
export const addProductToCart = (userId, productId) => apiRequest(`/users/${userId}/cart/add/${productId}/`, 'POST');
export const updateCartItemQuantity = (userId, productId, quantity) => apiRequest(`/users/${userId}/cart/update/${productId}/`, 'PUT', { quantity });
export const removeProductFromCart = (userId, productId) => apiRequest(`/users/${userId}/cart/remove/${productId}/`, 'DELETE');

export const createOrder = () => apiRequest('/orders/', 'POST', {});
export const getUserOrders = (userId) => apiRequest(`/users/${userId}/orders/`); 
export const logProductView = (userId, productId) => apiRequest(`/users/${userId}/log-view/${productId}/`, 'POST');