import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Header.css";

function Header() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("ecommerce_user_name");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ecommerce_user_id");
    localStorage.removeItem("ecommerce_user_name");
    setUserName("");

    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-container">
        {}
        <Link to="/" className="site-logo">
          E-Commerce Recommender
        </Link>

        {}
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/checkout">Checkout</Link>
            </li>
            {}
            {userName ? (
              <>
                {}
                <li className="user-greeting">Welcome, {userName}!</li>
                {}
                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login / Register</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
