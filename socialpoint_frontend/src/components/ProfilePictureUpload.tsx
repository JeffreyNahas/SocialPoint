import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './ProfilePictureUpload.css';

interface ProfilePictureUploadProps {
  currentProfilePicture: string | null;
  onPictureUpdate: (newPictureUrl: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  currentProfilePicture, 
  onPictureUpdate 
}) => {
  const [pictureUrl, setPictureUrl] = useState<string>(currentProfilePicture || '');
  const [dragging, setDragging] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentProfilePicture);
  const [uploadingStatus, setUploadingStatus] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle direct URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPictureUrl(e.target.value);
    setPreviewUrl(e.target.value);
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  // Common file handling logic
  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setUploadingStatus('Please upload an image file');
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Normally here you would upload the file to your server or a service like AWS S3
    // For simplicity, we'll just use the object URL
    setPictureUrl(objectUrl);
    
    // In a real application, you'd handle the file upload to a server here
    // For now, we'll simulate a successful upload
    setUploadingStatus('Image selected. Click Save to update your profile.');
  };

  // Save the profile picture
  const handleSave = async () => {
    try {
      setUploadingStatus('Updating profile...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setUploadingStatus('You must be logged in to update your profile');
        return;
      }
      
      await axios.put(
        `${API_URL}/users/user-account`,
        { profilePictureUrl: pictureUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onPictureUpdate(pictureUrl);
      setUploadingStatus('Profile picture updated successfully!');
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      setUploadingStatus('Failed to update profile picture. Please try again.');
    }
  };

  return (
    <div className="profile-picture-upload">
      <div className="preview-container">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile Preview"
            className="profile-preview"
          />
        ) : (
          <div className="profile-placeholder">
            <i className="fas fa-user"></i>
          </div>
        )}
      </div>

      <div 
        className={`drop-zone ${dragging ? 'active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <p>Drop an image file here or click to select</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
      </div>

      <div className="url-input">
        <p>Or enter an image URL:</p>
        <input
          type="text"
          value={pictureUrl}
          onChange={handleUrlChange}
          placeholder="https://example.com/your-image.jpg"
        />
      </div>

      <button 
        className="save-button"
        onClick={handleSave}
        disabled={!pictureUrl}
      >
        Save Profile Picture
      </button>

      {uploadingStatus && (
        <p className="status-message">{uploadingStatus}</p>
      )}
    </div>
  );
};

export default ProfilePictureUpload; 