import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-title">
          <img src="/logo.png" className="logo" />
          <h1 className="header-title">Social Point</h1>
        </div>
        <nav className="nav-buttons">
          <button className="nav-button">Home</button>
          <button className="nav-button">My Events</button>
          <button className="nav-button">Profile</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
