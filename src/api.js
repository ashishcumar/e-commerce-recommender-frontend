const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CART_STORAGE_KEY = "ecommerce_carts";

const _getAllCarts = () => {
  try {
    const cartsJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartsJson ? JSON.parse(cartsJson) : {};
  } catch (e) {
    console.error("Error parsing carts from localStorage", e);
    return {};
  }
};

const _saveAllCarts = (carts) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carts));
  } catch (e) {
    console.error("Error saving carts to localStorage", e);
  }
};

const apiRequest = async (url, method = "GET", data = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail ||
          errorData.error ||
          "Something went wrong with the API request!"
      );
    }
    if (response.status === 204) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Backend API request failed:", error);
    throw error;
  }
};

export const createUser = (userData) => apiRequest("/users/", "POST", userData);
export const getUser = (userId) => apiRequest(`/users/${userId}/`);
export const loginUser = (credentials) =>
  apiRequest("/users/login/", "POST", credentials);

export const getAllProducts = () => apiRequest("/products/");
export const getProductById = (productId) =>
  apiRequest(`/products/${productId}/`);
export const getProductRecommendations = (productId) =>
  apiRequest(`/products/${productId}/recommendations/`);

export const logProductView = (userId, productId) =>
  apiRequest(`/users/${userId}/log-view/${productId}/`, "POST");

export const getCartByUserId = (userId) => {
  if (!userId) return [];
  const allCarts = _getAllCarts();
  return allCarts[userId] || [];
};

export const addProductToCart = (userId, productDetails) => {
  if (!userId || !productDetails) return [];

  const allCarts = _getAllCarts();
  const userCart = allCarts[userId] || [];

  const existingItemIndex = userCart.findIndex(
    (item) => item.productId === productDetails.product_id
  );

  if (existingItemIndex > -1) {
    userCart[existingItemIndex].quantity += 1;
  } else {
    userCart.push({
      productId: productDetails.product_id,
      quantity: 1,
      productDetails: productDetails,
    });
  }

  allCarts[userId] = userCart;
  _saveAllCarts(allCarts);
  return userCart;
};

export const updateCartItemQuantity = (userId, productId, newQuantity) => {
  if (!userId) return [];

  const allCarts = _getAllCarts();
  let userCart = allCarts[userId] || [];

  if (newQuantity <= 0) {
    userCart = userCart.filter((item) => item.productId !== productId);
  } else {
    const itemIndex = userCart.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex > -1) {
      userCart[itemIndex].quantity = newQuantity;
    }
  }

  allCarts[userId] = userCart;
  _saveAllCarts(allCarts);
  return userCart;
};

export const removeProductFromCart = (userId, productId) => {
  if (!userId) return [];

  const allCarts = _getAllCarts();
  let userCart = allCarts[userId] || [];

  userCart = userCart.filter((item) => item.productId !== productId);

  allCarts[userId] = userCart;
  _saveAllCarts(allCarts);
  return userCart;
};

export const createOrder = (userId) => {
  if (!userId) return;
  const allCarts = _getAllCarts();
  delete allCarts[userId];
  _saveAllCarts(allCarts);
};
