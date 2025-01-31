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
import { UserRepository } from '../repository/UserRepository';
import { VenueRepository } from '../repository/VenueRepository';
import { UpdateEventRequestDto } from '../dto/EventDto';

@Injectable()
export class EventService {
  
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly venueRepository: VenueRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  // createEvent in repository
  async createEvent(
    name: string,
    description: string,
    venue: String,
    date: Date,
    startTime: Date,
    endTime: Date,
    category: Category,
    organizer: User,
  ): Promise<Event> {
    const event = new Event();
    event.setName(name);
    event.setDescription(description);
    event.setVenue(venue);
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
    return await this.eventRepository.findAllEvents();
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