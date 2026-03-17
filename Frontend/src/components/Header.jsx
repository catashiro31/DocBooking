import React from 'react';
import '../styles/Header.css'; 
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar-container">
      <div className="nav-logo">
        <span className="logo-icon">🩺</span>
        <span>MediCheck</span>
      </div>

      <ul className="nav-menu">
        <li><NavLink to = "/" end>Home</NavLink></li>
        <li><NavLink to = "/doctors">All Doctor</NavLink></li>
        <li><NavLink to = "/about">About</NavLink></li>
        <li><NavLink to = "/contact">Contact</NavLink></li>
      </ul>

      <div className="nav-buttons">
        <button className="btn-outline">Admin</button>
        <button className="btn-primary">Create Account</button>
      </div>
    </nav>
  );
};

export default Navbar;