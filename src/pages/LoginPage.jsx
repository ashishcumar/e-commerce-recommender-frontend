import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getUser } from "../api";
import "../assets/styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      let userData;
      if (isRegistering) {
        userData = await createUser({ name, email, password });
        if (userData?.user_id) {
          localStorage.setItem("user_id", JSON.stringify(userData?.user_id));
        }
        setMessage(
          `Registration successful for ${userData.email}. You can now log in.`
        );
        setIsRegistering(false);
        setEmail("");
        setPassword("");
        setName("");
      } else {
        const allUsers = await getUser("");
        const foundUser = allUsers.find((u) => u.email === email);

        if (foundUser) {
          localStorage.setItem("ecommerce_user_id", foundUser.user_id);
          localStorage.setItem("ecommerce_user_name", foundUser.name);
          setMessage(`Welcome, ${foundUser.name}! Logging you in...`);

          navigate("/");
          window.location.reload();
        } else {
          setMessage(
            "Login failed: User not found or incorrect credentials. Try registering."
          );
        }
      }
    } catch (error) {
      setMessage(`Authentication failed: ${error.message}`);
      console.error("Auth error:", error);
    }
  };

  return (
    <div className="login-page">
      <h2>{isRegistering ? "Register" : "Login"}</h2>
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
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      <p className="toggle-auth-mode">
        {isRegistering ? (
          <>
            Already have an account?{" "}
            <span onClick={() => setIsRegistering(false)}>Login here</span>.
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <span onClick={() => setIsRegistering(true)}>Register here</span>.
          </>
        )}
      </p>
    </div>
  );
}

export default LoginPage;
