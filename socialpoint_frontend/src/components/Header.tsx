import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  hideButtons?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hideButtons = false }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-title">
          <img src="/logo.png" className="logo" alt="Logo" />
          <h1 className="header-title">Social Point</h1>
        </div>
        {!hideButtons && (
          <nav className="nav-buttons">
            <button className="nav-button" onClick={() => navigate('/')}>Home</button>
            <button className="nav-button" onClick={() => navigate('/my-events')}>My Events</button>
            <button className="nav-button" onClick={() => navigate('/login')}>Log in</button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
