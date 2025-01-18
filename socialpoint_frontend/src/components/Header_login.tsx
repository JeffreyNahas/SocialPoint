import React from 'react';
import './Header_login.css';
import { useNavigate } from 'react-router-dom';

const Header_login: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-title">
          <img src="/logo.png" className="logo" alt="Logo" />
          <h1 className="header-title">Social Point</h1>
        </div>
        <nav className="nav-buttons">
            <button className="nav-button" onClick={() => navigate('/home')}>Home</button>
          </nav>
      </div>
    </header>
  );
};

export default Header_login;
