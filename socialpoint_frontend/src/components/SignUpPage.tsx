import React from 'react';
import './SignUpPage.css';
import Header_login from './Header_login';

const SignUpPage: React.FC = () => {
  return (
    <>
      <Header_login />
      <div className="login-container">
        <div className="login-box">
          <h2>Sign up</h2>
          <form>
            <div className="form-group-email">
              <label htmlFor="email">Email<span className="required">*</span></label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group-email">
              <label htmlFor="email">Confirm email<span className="required">*</span></label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>
            <div className="form-group-password">
              <label htmlFor="password">Password<span className="required">*</span></label>
              <input type="password" id="password" placeholder="Enter your password" required />
            </div>
            <div className="form-group-password">
              <label htmlFor="password">Confirm password<span className="required">*</span></label>
              <input type="password" id="password" placeholder="Enter your password" required />
            </div>
            
            <button type="submit" className="login-button">Create account</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
