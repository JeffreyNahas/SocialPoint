import React, { useState, useEffect, FormEvent } from 'react';
import AuthHeader from './AuthHeader';
import './MyEvents.css';
import { createVenue, createEvent, getVenues, CreateVenueDto, CreateEventDto } from '../services/eventService';
import { VenueSelector, VenueData } from './VenueSelector';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venueLocation: string;
  category: string;
}

const MyEvents: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [organizedEvents, setOrganizedEvents] = useState<Event[]>([]);
  const [isNewVenue, setIsNewVenue] = useState(false);
  const [venues, setVenues] = useState<Array<{ id: number; name: string; location: string }>>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    category: '',
    venueName: '',
    venueLocation: '',
    venueCapacity: '',
    selectedVenueId: ''
  });
  const [selectedVenue, setSelectedVenue] = useState<VenueData | null>(null);
  const [attendedEventsLoading, setAttendedEventsLoading] = useState(true);
  const [attendedEventsError, setAttendedEventsError] = useState(null);
  const navigate = useNavigate();

  // Fetch venues when component mounts
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const venueData = await getVenues();
        setVenues(venueData);
      } catch (error) {
        console.error('Failed to fetch venues:', error);
      }
    };
    fetchVenues();
  }, []);

  // Add this new useEffect to fetch organized events
  useEffect(() => {
    const fetchOrganizedEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await axios.get(
          'http://localhost:3000/api/users/organized-events',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Sort events by date (most recent first)
        const sortedEvents = response.data.sort((a: Event, b: Event) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setOrganizedEvents(sortedEvents);
      } catch (error) {
        console.error('Failed to fetch organized events:', error);
      }
    };
    
    fetchOrganizedEvents();
  }, []);

  useEffect(() => {
    fetchAttendedEvents();
  }, []);

  const fetchAttendedEvents = async () => {
    try {
      setAttendedEventsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setAttendedEventsLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3000/api/users/attended-events', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAttendedEvents(response.data);
      setAttendedEventsLoading(false);
    } catch (err) {
      console.error('Failed to fetch attended events:', err);
      setAttendedEventsLoading(false);
    }
  };

  const handleVenueSelected = (venueData: VenueData | null) => {
    if (venueData) {
      setSelectedVenue(venueData);
    }
  }
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let venueId: number;

      if (isNewVenue) {
        // Create new venue first
        const venueData: CreateVenueDto = {
          name: formData.venueName,
          location: formData.venueLocation,
          capacity: parseInt(formData.venueCapacity)
        };
        const newVenue = await createVenue(venueData);
        venueId = newVenue.id;
      } else {
        venueId = parseInt(formData.selectedVenueId);
      }

      // Create event with the venue ID
      const eventData: CreateEventDto = {
        name: formData.name,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        category: formData.category,
        venueLocation: selectedVenue?.address || '',
        organizerId: 1 // Replace with actual logged-in user ID
      };

      await createEvent(eventData);
      setShowCreateForm(false);
      // Refresh events list
      // Add function to fetch and update events
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleUnregister = async (eventId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to unregister from an event');
        return;
      }

      await axios.delete(`http://localhost:3000/api/events/${eventId}/attendees`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the attended events list
      fetchAttendedEvents();
      alert('Successfully unregistered from event');
    } catch (err) {
      console.error('Failed to unregister from event:', err);
      alert('Failed to unregister from event. Please try again.');
    }
  };

  return (
    <div className="my-events-page">
      <AuthHeader />
      <div className="my-events-container">
        <div className="events-header">
          <h1>My Events</h1>
          <button 
            className="create-event-button"
            onClick={() => setShowCreateForm(true)}
          >
            Create New Event
          </button>
        </div>

        <div className="events-sections">
          <div className="events-section">
            <h2>Organized Events</h2>
            <div className="events-scroll-container">
              <div className="events-scroll-wrapper">
                {organizedEvents.length === 0 ? (
                  <p className="no-events-message">No organized events yet</p>
                ) : (
                  organizedEvents.map(event => (
                    <div key={event.id} className="event-mini-card">
                      <div className="event-mini-header">
                        <span className="event-mini-date">{formatDate(event.date)}</span>
                      </div>
                      <h3 className="event-mini-title">{event.name}</h3>
                      <div className="event-mini-location">
                        <i className="location-icon">📍</i>
                        <span>{event.venueLocation || 'No location'}</span>
                      </div>
                      <button 
                        className="event-mini-button"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        More Info
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <section className="attended-events-section">
            <h2 className="white-heading">Events I'm Attending</h2>
            
            {attendedEventsLoading ? (
              <div className="loading">Loading attended events...</div>
            ) : attendedEventsError ? (
              <div className="error">{attendedEventsError}</div>
            ) : attendedEvents.length === 0 ? (
              <div className="events-scroll-container">
                <div className="events-scroll-wrapper">
                  <div className="event-mini-card">
                    <div className="event-mini-header">
                      <span className="event-mini-date">{new Date().toLocaleDateString()}</span>
                      <span className="demo-badge-mini">Demo</span>
                    </div>
                    <h3 className="event-mini-title">Annual Tech Conference 2023</h3>
                    <div className="event-mini-location">
                      <i className="location-icon">📍</i>
                      <span>San Francisco Convention Center</span>
                    </div>
                    <div className="mini-card-buttons">
                      <button
                        className="review-mini-button"
                        onClick={() => navigate(`/events/999?action=review`)}
                      >
                        Write Review
                      </button>
                      <button className="unregister-mini-button">
                        Unregister
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="events-scroll-container">
                <div className="events-scroll-wrapper">
                  {attendedEvents.map(event => (
                    <div key={event.id} className="event-mini-card">
                      <div className="event-mini-header">
                        <span className="event-mini-date">{formatDate(event.date)}</span>
                      </div>
                      <h3 className="event-mini-title">{event.name}</h3>
                      <div className="event-mini-location">
                        <i className="location-icon">📍</i>
                        <span>{event.venueLocation || 'No location'}</span>
                      </div>
                      <div className="mini-card-buttons">
                        <button
                          className="review-mini-button"
                          onClick={() => navigate(`/events/${event.id}?action=review`)}
                        >
                          Write Review
                        </button>
                        <button 
                          className="unregister-mini-button"
                          onClick={() => handleUnregister(event.id)}
                        >
                          Unregister
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {showCreateForm && (
          <div className="create-event-modal">
            <div className="modal-content">
              <h2>Create New Event</h2>
              <form className="create-event-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Event Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="time"
                  name="startTime"
                  placeholder="Start Time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="time"
                  name="endTime"
                  placeholder="End Time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="MUSIC">Music</option>
                  <option value="SPORTS">Sports</option>
                  <option value="ARTS">Arts</option>
                  <option value="FOOD">Food</option>
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="OTHER">Other</option>
                </select>

                <VenueSelector
                  onVenueSelected={handleVenueSelected}
                  selectedVenue={selectedVenue}
                />

                <div className="form-buttons">
                  <button type="submit">Create Event</button>
                  <button type="button" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;