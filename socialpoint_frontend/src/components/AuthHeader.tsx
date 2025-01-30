import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const AuthHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-title">
          <img src="/logo.png" className="logo" alt="Logo" />
          <h1 className="header-title">Social Point</h1>
        </div>
        <nav className="nav-buttons">
          <button className="nav-button" onClick={() => navigate('/events')}>Home</button>
          <button className="nav-button" onClick={() => navigate('/my-events')}>My Events</button>
          <button className="nav-button" onClick={() => navigate('/profile')}>Profile</button>
          <button className="nav-button logout" onClick={handleLogout}>Logout</button>
        </nav>
      </div>
    </header>
  );
};

export default AuthHeader; 