import { EntityRepository, Repository } from "typeorm";
import { Event } from "../model/Event";
import { Venue } from "../model/Venue";
import { Category } from "../model/Category";
import { User } from "../model/User";

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
    async findEventById(id: number): Promise<Event | null> {
        return await this.findOne({ where: { id } });
    }
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
        const event = new Event(name, description, venue, date, startTime, endTime, category, organizer);
        return await this.save(event);
      }

    async deleteEvent(id: number): Promise<boolean> {
        const result = await this.delete(id);
        return result.affected !== 0;
      }
    async updateEvent(id: number, updatedEventData: Partial<Event>): Promise<Event | null> {
        const event = await this.findOneBy({ id });
        if (!event) return null;
        Object.assign(event, updatedEventData);
        return await this.save(event);
      }

      async findAllEvents(): Promise<Event[]> {
        return await this.find({ relations: ['venue', 'organizer', 'attendees', 'reviews', 'notifications'] });
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
