import { EventRepository } from '../repository/EventRepository';
import { Event } from '../model/Event';
import { Venue } from '../model/Venue';
import { Category } from '../model/Category';
import { User } from '../model/User';

export class EventService {
  private eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  // Create a new event
  async createEvent(
    name: string,
    description: string,
    venue: Venue,
    date: Date,
    startTime: Date,
    endTime: Date,
    category: Category,
    organizer: User
  ): Promise<Event> {
    return await this.eventRepository.createEvent(name, description, venue, date, startTime, endTime, category, organizer);
  }

  // Find an event by ID
  async findEventById(id: number): Promise<Event | null> {
    return await this.eventRepository.findEventById(id);
  }

  // Update an event by ID
  async updateEvent(id: number, updatedEventData: Partial<Event>): Promise<Event | null> {
    return await this.eventRepository.updateEvent(id, updatedEventData);
  }

  // Delete an event by ID
  async deleteEvent(id: number): Promise<boolean> {
    return await this.eventRepository.deleteEvent(id);
  }

  // Find all events
  async findAllEvents(): Promise<Event[]> {
    return await this.eventRepository.findAllEvents();
  }

  // Find events based on various filters
  async findEventsByFilters(filters: {
    date?: Date;
    venueId?: number;
    category?: Category;
    organizerId?: number;
    location?: Location;
    country?: string;
    city?: string;
    state?: string;
  }): Promise<Event[]> {
    return await this.eventRepository.findEventsByFilters(filters);
  }

  // Add an attendee to an event
  async addAttendee(eventId: number, user: User): Promise<Event | null> {
    const event = await this.eventRepository.findEventById(eventId);
    if (event) {
      event.addAttendee(user);
      await this.eventRepository.save(event);
      return event;
    }
    return null;
  }

  // Remove an attendee from an event
  async removeAttendee(eventId: number, user: User): Promise<Event | null> {
    const event = await this.eventRepository.findEventById(eventId);
    if (event) {
      event.removeAttendee(user);
      await this.eventRepository.save(event);
      return event;
    }
    return null;
  }

  // Find all attendees for a specific event
  async findAttendeesByEvent(eventId: number): Promise<User[] | null> {
    const event = await this.eventRepository.findEventById(eventId);
    return event ? Array.from(event.attendees) : null;
  }
}