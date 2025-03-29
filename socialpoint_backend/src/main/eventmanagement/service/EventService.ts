import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from '../repository/EventRepository';
import { Event } from '../model/Event';
import { Category } from '../model/Category';
import { User } from '../model/User';
import { UserService } from './UserService';
import { Review } from '../model/Review';
import { Notification } from '../model/Notification';
import { ReviewService } from './ReviewService';
import { ReviewRepository } from '../repository/ReviewRepository';
import { UserRepository } from '../repository/UserRepository';
import { UpdateEventRequestDto } from '../dto/EventDto';

@Injectable()
export class EventService {
  
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  // createEvent in repository
  async createEvent(
    name: string,
    description: string,
    venueLocation: string,
    date: Date,
    startTime: Date,
    endTime: Date,
    category: Category,
    organizer: User,
  ): Promise<Event> {
    const event = new Event();
    event.setName(name);
    event.setDescription(description);
    event.setVenueLocation(venueLocation);
    event.setDate(date);
    event.setStartTime(startTime);
    event.setEndTime(endTime);
    event.setCategory(category);
    event.setOrganizer(organizer);
    return await this.eventRepository.save(event);
  }

  // updateEvent in repository
  async updateEvent(id: number, updateDto: UpdateEventRequestDto): Promise<Event | null> {
    const event = await this.eventRepository.findEventById(id);
    if (!event) {
        return null;
    }

    const updates = {
        ...updateDto,
        date: updateDto.date ? new Date(updateDto.date) : undefined,
        startTime: updateDto.startTime ? (() => {
            const [hours, minutes] = updateDto.startTime!.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date;
        })() : undefined,
        endTime: updateDto.endTime ? (() => {
            const [hours, minutes] = updateDto.endTime!.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date;
        })() : undefined
    };

    Object.assign(event, updates);
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
    const events = await this.eventRepository.findAllEvents();
    
    // Additional logging to detect issues
    console.log('Total events loaded:', events.length);
    for (const event of events) {
      console.log(`Event ${event.id} organizer:`, 
        event.getOrganizer() ? 
        `ID: ${event.getOrganizer().id}, Has UserAccount: ${!!event.getOrganizer().userAccount}` : 
        'No organizer'
      );
    }
    
    return events;
  }

  // getEventsByFilters in repository
  async getEventsByFilters(filters: {
    date?: Date;
    venueId?: number;
    category?: Category;
    organizerId?: number;
    location?: string;
    country?: string;
    city?: string;
    state?: string;
  }): Promise<Event[]> {
    return await this.eventRepository.findEventsByFilters(filters);
  }

  // Add an attendee to an event
  // public async addAttendeeToEvent(eventId: number, userId: number): Promise<Event> {
  //   const event = await this.eventRepository.findEventById(eventId);
  //   if (!event) {
  //     throw new Error('Event not found');
  //   }
  //   const user = await this.userRepository.findUserById(userId);
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   event.addAttendee(user);
  //   return await this.eventRepository.save(event);
  // }

  // removeAttendeeFromEvent in repository
  // public async removeAttendeeFromEvent(eventId: number, userId: number): Promise<Event> {
  //   const event = await this.eventRepository.findEventById(eventId);
  //   if (!event) {
  //     throw new Error('Event not found');
  //   }
  //   const user = await this.userRepository.findUserById(userId);
  //   if (!user) {
  //     throw new Error('User not found'); 
  //   }
  //   event.removeAttendee(user);
  //   return await this.eventRepository.save(event);
  // }

  async getReviewsByEvent(eventId: number): Promise<Review[]> {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return await this.reviewRepository.findReviewsByEvent(eventId);
  }

  // async getAttendeesByEvent(eventId: number): Promise<User[]> {
  //   return await this.eventRepository.findAttendeesByEvent(eventId);
  // }

  async getOrganizerByEvent(eventId: number): Promise<User | null> {
    return await this.eventRepository.findOrganizerByEvent(eventId);
  }

  async getVenueByEvent(eventId: number): Promise<String | null> {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return event.venueLocation;
  }

  async addAttendee(eventId: number, userId: number): Promise<Event> {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    event.addAttendee(user);
    return await this.eventRepository.save(event);
  }

  async removeAttendee(eventId: number, userId: number): Promise<Event> {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    event.removeAttendee(user);
    return await this.eventRepository.save(event);
  }

  async checkIfUserIsAttendee(eventId: number, userId: number): Promise<boolean> {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return event.getAttendees().some(attendee => attendee.id === userId);
  }

  async getAttendeesByEvent(eventId: number): Promise<User[]> {
    const event = await this.eventRepository.findEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    return Array.from(event.getAttendees());
  }

  async getAttendedEvents(userId: number): Promise<Event[]> {
    try {
        const user = await this.userRepository.findUserWithAttendedEvents(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        return Array.from(user.attendedEvents);
    } catch (error) {
        console.error('Failed to fetch attended events:', error);
        throw error;
    }
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
    return this.eventRepository.findEventById(id);
  }

}