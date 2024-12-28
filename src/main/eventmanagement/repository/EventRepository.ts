import { EntityRepository, Repository } from "typeorm";
import { Event } from "../model/Event";
import { Venue } from "../model/Venue";
import { Category } from "../model/Category";
import { User } from "../model/User";
import { Review } from "../model/Review";
import { Injectable } from "@nestjs/common";


@Injectable()

export class EventRepository extends Repository<Event> {
    async findEventById(id: number): Promise<Event | null> {
        return await this.findOne({ where: { id } });
    }

    async findAllEvents(): Promise<Event[]> {
        return await this.find({ relations: ['venue', 'organizer', 'attendees', 'reviews', 'notifications'] });
    }

    async findAttendeesByEvent(eventId: number): Promise<User[]> {
        const event = await this.findOne({ 
            where: { id: eventId },
            relations: ['listOfAttendees']
        });
        return Array.from(event?.listOfAttendees || []);
    }

    async findOrganizerByEvent(eventId: number): Promise<User | null> {
        const event = await this.findOne({ 
            where: { id: eventId },
            relations: ['organizer']
        });
        return event?.organizer || null;
    }

    async findEventsByVenue(venueId: number): Promise<Event[]> {
        return await this.find({ where: { venue: { id: venueId } } });
    }

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
        const queryBuilder = this.createQueryBuilder('event')
          .leftJoinAndSelect('event.venue', 'venue')
          .leftJoinAndSelect('event.organizer', 'organizer')
          .leftJoinAndSelect('event.attendees', 'attendees');
        
        if (filters.date) {
          queryBuilder.andWhere('event.date = :date', { date: filters.date });
        }
    
        if (filters.venueId) {
          queryBuilder.andWhere('venue.id = :venueId', { venueId: filters.venueId });
        }
    
        if (filters.category) {
          queryBuilder.andWhere('event.category = :category', { category: filters.category });
        }
    
        if (filters.organizerId) {
          queryBuilder.andWhere('organizer.id = :organizerId', { organizerId: filters.organizerId });
        }

        if (filters.location) {
          queryBuilder.andWhere('venue.location = :location', { location: filters.location });
        }

        if (filters.country) {
          queryBuilder.andWhere('venue.location.country = :country', { country: filters.country });
        }

        if (filters.city) {
          queryBuilder.andWhere('venue.location.city = :city', { city: filters.city });
        }

        if (filters.state) {
          queryBuilder.andWhere('venue.location.state = :state', { state: filters.state });
        }
    
        return await queryBuilder.getMany();
      }

}
