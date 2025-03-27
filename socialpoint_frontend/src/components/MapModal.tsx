import React from 'react';
import './MapModal.css';

interface MapModalProps {
  location: string;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ location, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="map-modal-backdrop" onClick={handleBackdropClick}>
      <div className="map-modal-content">
        <div className="map-modal-header">
          <h3>{location}</h3>
          <button className="map-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="map-modal-body">
          <iframe
            title="Google Maps"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(location)}`}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MapModal; 