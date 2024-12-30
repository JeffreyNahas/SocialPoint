import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from '../repository/EventRepository';
import { Event } from '../model/Event';
import { Venue } from '../model/Venue';
import { Category } from '../model/Category';
import { User } from '../model/User';
import { UserService } from './UserService';
import { Review } from '../model/Review';
import { Notification } from '../model/Notification';
import { ReviewService } from './ReviewService';
import { ReviewRepository } from '../repository/ReviewRepository';
@Injectable()
export class EventService {
  
  constructor(
    @InjectRepository(EventRepository)
    private readonly eventRepository: EventRepository,
    private readonly userService: UserService,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  // createEvent in repository
  async createEvent(
    name: string,
    description: string,
    venue: Venue,
    date: Date,
    startTime: Date,
    endTime: Date,
    category: Category,
    organizer: User,
  ): Promise<Event> {
    const event = new Event(name, description, venue, date, startTime, endTime, category, organizer);
    return await this.eventRepository.save(event);
    
  }

  // updateEvent in repository
  async updateEvent(id: number, updatedEventData: Partial<Event>): Promise<Event | null> {
    const event = await this.eventRepository.findEventById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    Object.assign(event, updatedEventData);
    return await this.eventRepository.save(event);
  }

  // deleteEvent in repository
  async deleteEvent(id: number): Promise<boolean> {
    const event = await this.eventRepository.findEventById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    const result = await this.eventRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // findAllevents in repository
  async getAllEvents(): Promise<Event[]> {
    return await this.eventRepository.findAllEvents();
  }

  // getEventsByFilters in repository
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
    const event = await this.eventRepository.findEventById(eventId);
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

  // removeAttendeeFromEvent in repository
  public async removeAttendeeFromEvent(eventId: number, userId: number): Promise<Event> {
    const event = await this.eventRepository.findEventById(eventId);
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

  async getReviewsByEvent(eventId: number): Promise<Review[]> {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return await this.reviewRepository.findReviewsByEvent(eventId);
  }

  async getAttendeesByEvent(eventId: number): Promise<User[]> {
    return await this.eventRepository.findAttendeesByEvent(eventId);
  }

  async getOrganizerByEvent(eventId: number): Promise<User | null> {
    return await this.eventRepository.findOrganizerByEvent(eventId);
  }

  async getVenueByEvent(eventId: number): Promise<Venue | null> {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return event.venue;
  }

  async addNotificationToEvent(eventId: number, notification: Notification): Promise<Event> {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    event.addNotification(notification);
    return await this.eventRepository.save(event);
  }

  async getEventById(id: number): Promise<Event | null> {
    return await this.eventRepository.findEventById(id);
  }

}