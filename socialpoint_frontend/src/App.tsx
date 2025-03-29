import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import WelcomePage from './components/WelcomePage';
import MyEvents from './components/MyEvents';
import EventsPage from './components/EventsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/Profile';
import EventDetailsPage from './components/EventDetailsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home page route */}
        <Route path="/login" element={<LoginPage />} /> {/* Login page route */}
        <Route path="/signup" element={<SignUpPage />} /> {/* Sign up page route */}
        <Route path="/welcome" element={<WelcomePage />} /> {/* Welcome page route */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/my-events" element={
          <ProtectedRoute>
            <MyEvents />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/events/:id" element={<EventDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
