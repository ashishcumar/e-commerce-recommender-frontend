import React from 'react';
import '../assets/styles/Footer.css'; 

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {currentYear} E-Commerce Recommender. All rights reserved.</p>
        <nav className="footer-nav">
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;