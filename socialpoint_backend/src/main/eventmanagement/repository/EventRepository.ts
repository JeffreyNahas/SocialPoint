import { EntityRepository, Repository } from "typeorm";
import { Event } from "../model/Event";
import { Venue } from "../model/Venue";
import { Category } from "../model/Category";
import { User } from "../model/User";
import { Review } from "../model/Review";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class EventRepository {
    private repository: Repository<Event>;

    constructor(
        @InjectRepository(Event)
        repository: Repository<Event>
    ) {
        this.repository = repository;
    }

    async findEventById(id: number): Promise<Event | null> {
        return await this.repository.findOne({ 
            where: { id },
            relations: ['venue', 'organizer'] 
        });
    }

    async findAllEvents(): Promise<Event[]> {
        return await this.repository.find({ 
            relations: ['venue', 'organizer', 'reviews', 'notifications'] 
        });
    }

    // async findAttendeesByEvent(eventId: number): Promise<User[]> {
    //     const event = await this.repository.findOne({ 
    //         where: { id: eventId },
    //         relations: ['listOfAttendees']
    //     });
    //     return Array.from(event?.listOfAttendees || []);
    // }

    async findOrganizerByEvent(eventId: number): Promise<User | null> {
        const event = await this.repository.findOne({ 
            where: { id: eventId },
            relations: ['organizer']
        });
        return event?.organizer || null;
    }

    async findEventsByVenue(venueId: number): Promise<Event[]> {
        return await this.repository.find({ where: { venue: { id: venueId } } });
    }

    async findEventsByFilters(filters: {
        date?: Date;
        venueId?: number;
        category?: Category;
        organizerId?: number;
        location?: string;
        country?: string;
        city?: string;
        state?: string;


      }): Promise<Event[]> {
        const queryBuilder = this.repository.createQueryBuilder('event')
          .leftJoinAndSelect('event.venue', 'venue')
          .leftJoinAndSelect('event.organizer', 'organizer');
        
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

    async save(event: Event): Promise<Event> {
        return await this.repository.save(event);
    }

    async delete(id: number) {
        return await this.repository.delete(id);
    }

    async deleteEvent(id: number) {
        return await this.repository.delete(id);
    }

}
