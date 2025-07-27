// e-commerce-recommender-frontend/src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header'; // Import Header
import Footer from './components/Footer'; // Import Footer
import './App.css'; // General app styles (already empty for now)

function App() {
  return (
    <div className="app-container">
      <Header /> 
      <main className="main-content">
        <Outlet /> 
      </main>
      <Footer /> 
    </div>
  );
}

export default App;