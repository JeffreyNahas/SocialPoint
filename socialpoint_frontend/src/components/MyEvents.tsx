import React, { useState } from 'react';
import Header from './Header';
import './MyEvents.css';

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
              <form className="create-event-form">
                <input type="text" placeholder="Event Name" required />
                <textarea placeholder="Description" required />
                <input type="date" required />
                <input type="time" placeholder="Start Time" required />
                <input type="time" placeholder="End Time" required />
                <select required>
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
                      <input type="text" placeholder="Venue Name" required />
                      <input type="text" placeholder="Location" required />
                      <input type="number" placeholder="Capacity" required min="1" />
                    </div>
                  ) : (
                    <div className="existing-venue-select">
                      <select required>
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
                  <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
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