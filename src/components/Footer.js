import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2024 Your Name. All rights reserved.</p>
        <div className="social-links">
          <a href="https://github.com" className="social-link" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;