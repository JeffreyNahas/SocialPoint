import React, { useState } from 'react';
import AuthHeader from './AuthHeader';
import './EventsPage.css';

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

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const categories = ['MUSIC', 'SPORTS', 'ARTS', 'FOOD', 'TECHNOLOGY', 'OTHER'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    const matchesDate = dateFilter === '' || event.date === dateFilter;

    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="events-page">
      <AuthHeader />
      <div className="events-content">
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <p className="no-events">No events found</p>
          ) : (
            filteredEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h3>{event.name}</h3>
                  <span className="category-tag">{event.category}</span>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <p>
                    <i className="far fa-calendar"></i>
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p>
                    <i className="far fa-clock"></i>
                    {event.startTime} - {event.endTime}
                  </p>
                  <p>
                    <i className="fas fa-map-marker-alt"></i>
                    {event.venue.name}, {event.venue.location}
                  </p>
                </div>
                <button className="join-button">Join Event</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 