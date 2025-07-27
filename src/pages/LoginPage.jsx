// e-commerce-recommender-frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, getUser } from '../api'; // Import API functions
import '../assets/styles/LoginPage.css'; // New CSS file

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      let userData;
      if (isRegistering) {
        // Register new user
        userData = await createUser({ name, email, password });
        setMessage(`Registration successful for ${userData.email}. You can now log in.`);
        setIsRegistering(false); // Switch to login mode after registration
        setEmail('');
        setPassword('');
        setName('');
      } else {
        // Simple login simulation: try to get user by email.
        // In a real app, you'd send username/password to backend for authentication.
        // For this demo, we assume if user exists, they are "logged in".
        // A more robust approach would be to have a dedicated /login endpoint
        // that validates credentials and returns a user ID/token.
        const allUsers = await getUser(''); // Fetch all users (simplistic)
        const foundUser = allUsers.find(u => u.email === email);

        if (foundUser) {
          // Store the user ID (Django's product_id) in local storage
          localStorage.setItem('ecommerce_user_id', foundUser.user_id);
          localStorage.setItem('ecommerce_user_name', foundUser.name);
          setMessage(`Welcome, ${foundUser.name}! Logging you in...`);
          // Redirect to home or a dashboard
          navigate('/');
          window.location.reload(); // Force reload to update context/state if necessary
        } else {
          setMessage('Login failed: User not found or incorrect credentials. Try registering.');
        }
      }
    } catch (error) {
      setMessage(`Authentication failed: ${error.message}`);
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="login-page">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      {message && <p className="auth-message">{message}</p>}
      <form onSubmit={handleAuth} className="auth-form">
        {isRegistering && (
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      <p className="toggle-auth-mode">
        {isRegistering ? (
          <>Already have an account? <span onClick={() => setIsRegistering(false)}>Login here</span>.</>
        ) : (
          <>Don't have an account? <span onClick={() => setIsRegistering(true)}>Register here</span>.</>
        )}
      </p>
    </div>
  );
}

export default LoginPage;