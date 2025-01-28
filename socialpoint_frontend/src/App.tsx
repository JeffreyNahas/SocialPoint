import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage'; 
import SignUpPage from './components/SignUpPage';
import WelcomePage from './components/WelcomePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home page route */}
        <Route path="/login" element={<LoginPage />} /> {/* Login page route */}
        <Route path="/signup" element={<SignUpPage />} /> {/* Sign up page route */}
        <Route path="/welcome" element={<WelcomePage />} /> {/* Welcome page route */}
      </Routes>
    </Router>
  );
};

export default App;
