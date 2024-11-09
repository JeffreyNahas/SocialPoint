import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from '../repository/EventRepository';
import { Event } from '../model/Event';
import { Venue } from '../model/Venue';
import { Category } from '../model/Category';
import { User } from '../model/User';
import { UserService } from './UserService';
@Injectable()
export class EventService {
  
  constructor(
    @InjectRepository(EventRepository)
    private readonly eventRepository: EventRepository,
    private readonly userService: UserService,
  ) {}

  async getEventById(id: number): Promise<Event | null> {
    return await this.eventRepository.findEventById(id);
  }

  async createEvent(
    name: string,
    description: string,
    venue: Venue,
    date: Date,
    startTime: Date,
    endTime: Date,
    category: Category,
    organizer: User,
    attendees: Set<User>
  ): Promise<Event> {
    return await this.eventRepository.createEvent(name, description, venue, date, startTime, endTime, category, organizer, attendees);
  }

  async updateEvent(id: number, updatedEventData: Partial<Event>): Promise<Event | null> {
    return await this.eventRepository.updateEvent(id, updatedEventData);
  }

  async deleteEvent(id: number): Promise<boolean> {
    return await this.eventRepository.deleteEvent(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return await this.eventRepository.findAllEvents();
  }

  async getEventsByFilters(filters: {
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
  public async addAttendeeToEvent(eventId: number, userId: number): Promise<Event> {
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    event.addAttendee(user);
    return await this.eventRepository.save(event);
  }

  public async removeAttendeeFromEvent(eventId: number, userId: number): Promise<Event> {
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found'); 
    }
    event.removeAttendee(user);
    return await this.eventRepository.save(event);
  }
}
