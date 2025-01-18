import React from 'react';
import './LoginPage.css';
import Header_login from './Header_login';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header_login />
      <div className="login-container">
        <div className="login-box">
          <h2>Log in</h2>
          <form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Enter your password" required />
            </div>
            <div className="form-group-remember-me">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember Me</label>
            </div>
            <button type="submit" className="login-button">Sign In</button>
          </form>
          <div className="signup-box">
            <p>
              New to Social Point?{' '}
              <span className="signup-link" onClick={() => navigate('/signup')}>
                Create an account
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
