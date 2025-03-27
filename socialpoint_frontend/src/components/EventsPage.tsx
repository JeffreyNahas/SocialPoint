import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EventsPage.css';
import MapModal from './MapModal';
import AuthHeader from './AuthHeader';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venueLocation: string;
  category: string;
  organizer: {
    id: number;
    fullName: string;
  };
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events');
        setLoading(false);
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  // Filter events when search query or category filter changes
  useEffect(() => {
    if (events.length) {
      const filtered = events.filter(event => {
        const matchesSearch = searchQuery === '' || 
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.venueLocation && event.venueLocation.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = filterCategory === '' || event.category === filterCategory;
        
        return matchesSearch && matchesCategory;
      });
      
      setFilteredEvents(filtered);
    }
  }, [searchQuery, filterCategory, events]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    };
    return new Date(timeString).toLocaleTimeString('en-US', options);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'MUSIC': '#1E88E5',    // Blue
      'SPORTS': '#43A047',   // Green
      'ARTS': '#E53935',     // Red
      'FOOD': '#FB8C00',     // Orange
      'TECHNOLOGY': '#8E24AA', // Purple
      'OTHER': '#757575'     // Gray
    };
    return colors[category] || colors.OTHER;
  };

  const getGoogleMapsUrl = (location: string) => {
    if (!location) return '';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };

  if (loading) {
    return (
      <>
        <AuthHeader />
        <div className="events-loading">Loading events...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AuthHeader />
        <div className="events-error">{error}</div>
      </>
    );
  }

  return (
    <div className="events-page-wrapper">
      <AuthHeader />
      
      <div className="events-page">
        <div className="events-header">
          <h1>Discover Events</h1>
          <p>Find exciting events happening near you</p>
          
          {/* Search and filter bar */}
          <div className="search-filter-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search events by name, description or location..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button className="search-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
              </button>
            </div>
            
            <div className="filter-dropdown">
              <select 
                value={filterCategory} 
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                <option value="MUSIC">Music</option>
                <option value="SPORTS">Sports</option>
                <option value="ARTS">Arts</option>
                <option value="FOOD">Food</option>
                <option value="TECHNOLOGY">Technology</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="events-container">
          {filteredEvents.length === 0 ? (
            <div className="no-events">
              {searchQuery || filterCategory ? 
                "No events match your search criteria" : 
                "No events found"}
            </div>
          ) : (
            filteredEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-card-header">
                  <div className="event-date">
                    <span className="event-month">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="event-day">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <span 
                    className="event-category" 
                    style={{ backgroundColor: getCategoryColor(event.category) }}
                  >
                    {event.category}
                  </span>
                </div>
                
                <h2 className="event-title">{event.name}</h2>
                
                <div className="event-info">
                  <div className="event-time">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2Zm0 18C7.59 20 4 16.41 4 12S7.59 4 12 4s8 3.59 8 8-3.59 8-8 8ZM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67Z"></path>
                    </svg>
                    <span>{formatDate(event.date)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                  </div>
                  
                  <div className="event-location">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z"></path>
                    </svg>
                    {event.venueLocation ? (
                      <a 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedLocation(event.venueLocation);
                        }}
                        className="location-link"
                      >
                        {event.venueLocation}
                      </a>
                    ) : (
                      <span className="location-unavailable">Location not specified</span>
                    )}
                  </div>
                </div>
                
                <p className="event-description">{event.description}</p>
                
                <div className="event-footer">
                  <span className="event-organizer">By {event.organizer.fullName}</span>
                  <Link to={`/events/${event.id}`} className="view-details">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedLocation && (
          <MapModal
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EventsPage; 