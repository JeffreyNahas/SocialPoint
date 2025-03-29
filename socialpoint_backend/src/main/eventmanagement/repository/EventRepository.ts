import { EntityRepository, Repository } from "typeorm";
import { Event } from "../model/Event";
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
            relations: ['organizer']
        });
    }

    async findEventsByOrganizerId(organizerId: number): Promise<Event[]> {
        return await this.repository.find({
            where: { organizer: { id: organizerId } },
            relations: ['organizer', 'organizer.userAccount']
        });
    }

    async findAllEvents(): Promise<Event[]> {
        return this.repository.find({
            relations: {
                organizer: {
                    userAccount: true
                }
            }
        });
    }
    async findAllAttendeesByEvent(eventId: number): Promise<User[]> {
        const event = await this.repository.findOne({ 
            where: { id: eventId },
            relations: ['attendees']
        });
        return event?.attendees || [];
    }

    async findOrganizerByEvent(eventId: number): Promise<User | null> {
        const event = await this.repository.findOne({ 
            where: { id: eventId },
            relations: ['organizer']
        });
        return event?.organizer || null;
    }

    async findEventsByFilters(filters: {
        date?: Date;
        category?: Category;
        organizerId?: number;
        location?: string;
        country?: string;
        city?: string;
        state?: string;
    }): Promise<Event[]> {
        const queryBuilder = this.repository.createQueryBuilder('event')
            .leftJoinAndSelect('event.organizer', 'organizer');
        
        if (filters.date) {
            queryBuilder.andWhere('event.date = :date', { date: filters.date });
        }
    
        if (filters.category) {
            queryBuilder.andWhere('event.category = :category', { category: filters.category });
        }
    
        if (filters.organizerId) {
            queryBuilder.andWhere('organizer.id = :organizerId', { organizerId: filters.organizerId });
        }

        if (filters.location) {
            queryBuilder.andWhere('event.venueLocation LIKE :location', { location: `%${filters.location}%` });
        }

        if (filters.country) {
            queryBuilder.andWhere('event.venueLocation.country = :country', { country: filters.country });
        }

        if (filters.city) {
            queryBuilder.andWhere('event.venueLocation.city = :city', { city: filters.city });
        }

        if (filters.state) {
            queryBuilder.andWhere('event.venueLocation.state = :state', { state: filters.state });
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

    async findEventWithAttendees(eventId: number): Promise<Event | null> {
        return this.repository.findOne({
            where: { id: eventId },
            relations: ['attendees']
        });
    }

}
