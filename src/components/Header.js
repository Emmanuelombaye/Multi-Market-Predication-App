import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="nav">
      <div className="container nav-container">
        <Link to="/" className="logo">
          Portfolio
        </Link>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/projects" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Projects
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
        
        <button className="nav-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Header;