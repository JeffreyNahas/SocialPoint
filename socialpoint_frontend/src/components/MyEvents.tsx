import React, { useState, useEffect, FormEvent } from 'react';
import Header from './Header';
import './MyEvents.css';
import { createVenue, createEvent, getVenues } from '../api/api';
import { CreateVenueDto, CreateEventDto } from '../api/types';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: {
    name: string;
    location: string;
  };
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
        venueId: venueId,
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

  return (
    <div className="my-events-page">
      <Header />
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
            <div className="events-grid">
              {organizedEvents.length === 0 ? (
                <p>No organized events yet</p>
              ) : (
                organizedEvents.map(event => (
                  <div key={event.id} className="event-card">
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Venue: {event.venue.name}</p>
                    <p>Category: {event.category}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="events-section">
            <h2>Attended Events</h2>
            <div className="events-grid">
              {attendedEvents.length === 0 ? (
                <p>No attended events yet</p>
              ) : (
                attendedEvents.map(event => (
                  <div key={event.id} className="event-card">
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Venue: {event.venue.name}</p>
                    <p>Category: {event.category}</p>
                  </div>
                ))
              )}
            </div>
          </div>
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

                <div className="venue-selection">
                  <div className="venue-toggle">
                    <button
                      type="button"
                      className={`venue-toggle-btn ${!isNewVenue ? 'active' : ''}`}
                      onClick={() => setIsNewVenue(false)}
                    >
                      Select Existing Venue
                    </button>
                    <button
                      type="button"
                      className={`venue-toggle-btn ${isNewVenue ? 'active' : ''}`}
                      onClick={() => setIsNewVenue(true)}
                    >
                      Create New Venue
                    </button>
                  </div>

                  {isNewVenue ? (
                    <div className="new-venue-inputs">
                      <input
                        type="text"
                        name="venueName"
                        placeholder="Venue Name"
                        value={formData.venueName}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        type="text"
                        name="venueLocation"
                        placeholder="Location"
                        value={formData.venueLocation}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        type="number"
                        name="venueCapacity"
                        placeholder="Capacity"
                        value={formData.venueCapacity}
                        onChange={handleInputChange}
                        required
                        min="1"
                      />
                    </div>
                  ) : (
                    <div className="existing-venue-select">
                      <select
                        name="selectedVenueId"
                        value={formData.selectedVenueId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a Venue</option>
                        {venues.map(venue => (
                          <option key={venue.id} value={venue.id}>
                            {venue.name} - {venue.location}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

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