import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="navbar-container">
      <div className="nav-logo" onClick={() => navigate('/')}>
        MediCheck
      </div>

      <button className={`menu-toggle ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <div className={`hamburger ${isOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <div className={`nav-right ${isOpen ? "show" : ""}`}>
        <ul className={`nav-menu ${isOpen ? "show" : ""}`}>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/doctors">All Doctor</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>

        <div className={`nav-buttons ${isOpen ? "show" : ""}`}>
          <button className="btn-outline">Admin</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}