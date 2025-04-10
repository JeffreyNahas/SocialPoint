import React, { useState, useEffect } from 'react';
import AuthHeader from './AuthHeader';
import './Profile.css';

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

interface Friend {
  id: number;
  fullName: string;
  email: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [friends, _] = useState<Friend[]>([]);

  useEffect(() => {
    // Fetch user profile and friends
    const userData = localStorage.getItem('user');
    if (userData) {
      setProfile(JSON.parse(userData));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add API call to update profile
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="profile-page">
      <AuthHeader />
      <div className="profile-container">
        <div className="profile-section">
          <h2>My Profile</h2>
          <div className="profile-content">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="profile-buttons">
                  <button type="submit" className="save-button">Save Changes</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-group">
                  <label>Full Name</label>
                  <p>{profile.fullName}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>
                <div className="info-group">
                  <label>Phone Number</label>
                  <p>{profile.phoneNumber || 'Not provided'}</p>
                </div>
                <button 
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="friends-section">
          <h2>My Friends</h2>
          <div className="friends-list">
            {friends.length === 0 ? (
              <p className="no-friends">No friends added yet</p>
            ) : (
              friends.map(friend => (
                <div key={friend.id} className="friend-card">
                  <div className="friend-info">
                    <h3>{friend.fullName}</h3>
                    <p>{friend.email}</p>
                  </div>
                  <button className="remove-friend">Remove</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 