import React from 'react';
import './WelcomePage.css';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="welcome-page">
        <div className="welcome-overlay"></div>
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>Welcome to Social Point</h1>
            <p>
              Social Point is the ultimate platform to connect with people, create events, and share
              unforgettable moments. Sign up today and be part of our growing community!
            </p>
            <button className="signup-button" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
          <div className="welcome-image">
            <img src="/welcome-image.jpg" alt="Welcome" />
          </div>
        </div>
      </div>
      <div className="spacer"></div> 
        
      <div className="stacked-section">
        <div className="stacked-content">
          <div className="stacked-text">
            <h2>Create Events</h2>
            <p>Organize and share events with your friends and network effortlessly.</p>
          </div>
          <div className="stacked-image">
            <img src="/event-creation.webp" alt="Create Events" />
          </div>
        </div>
      </div>

      <div className="stacked-section">
        <div className="stacked-content">
          <div className="stacked-text">
            <h2>Discover Communities</h2>
            <p>Find like-minded people and join communities that share your interests.</p>
          </div>
          <div className="stacked-image">
            <img src="/discover-communities.png" alt="Discover Communities" />
          </div>
        </div>
      </div>

      <div className="stacked-section">
        <div className="stacked-content">
          <div className="stacked-text">
            <h2>Share Memories</h2>
            <p>Capture and share unforgettable moments with everyone on the platform.</p>
          </div>
          <div className="stacked-image">
            <img src="/sharing-memories.jpg" alt="Share Memories" />
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
