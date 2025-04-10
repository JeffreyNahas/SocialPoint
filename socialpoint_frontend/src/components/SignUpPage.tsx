import React, { useState } from 'react';
import { API_URL } from '../config';
import './SignUpPage.css';
import Header_login from './Header_login';

interface SignUpForm {
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<SignUpForm>({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Partial<SignUpForm>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpForm> = {};
    
    if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Emails do not match';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber || ''
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create account');
      }

      // Redirect to login page on success
      window.location.href = '/login';
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ 
        email: error instanceof Error ? error.message : 'Failed to create account. Please try again.' 
      });
    }
  };

  return (
    <>
      <Header_login />
      <div className="login-container">
        <div className="login-box">
          <h2>Sign up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group-email">
              <label htmlFor="email">Email<span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group-email">
              <label htmlFor="confirmEmail">Confirm email<span className="required">*</span></label>
              <input
                type="email"
                id="confirmEmail"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleChange}
                placeholder="Confirm your email"
                required
              />
              {errors.confirmEmail && <span className="error">{errors.confirmEmail}</span>}
            </div>
            <div className="form-group-password">
              <label htmlFor="password">Password<span className="required">*</span></label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="form-group-password">
              <label htmlFor="confirmPassword">Confirm password<span className="required">*</span></label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="fullName">Full Name<span className="required">*</span></label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>
            <button type="submit" className="login-button">Create account</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
