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
          <NavLink to="/login" className="btn-outline">Login</NavLink>
          <NavLink to="/register" className="btn-primary">Create Account</NavLink>
        </div>
      </div>
    </div>
  );
}