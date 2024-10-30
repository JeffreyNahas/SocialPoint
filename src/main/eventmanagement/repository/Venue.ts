import { EntityRepository, Repository } from "typeorm";
import { Venue } from "../model/Venue";
import { Location } from "../model/Location";
import { Event } from "../model/Event";

@EntityRepository(Venue)
export class VenueRepository extends Repository<Venue> {
    async findVenueById(id: number): Promise<Venue | null> {
        return await this.findOne({ where: { id } });
    }

    async createVenue(name: string, location: Location, capacity: number): Promise<Venue> {
        const venue = new Venue(name, location, capacity);
        return await this.save(venue);
    }

    async deleteVenue(id: number): Promise<boolean> {
        const result = await this.delete(id);
        return result.affected !== 0;
    }

    async updateVenue(id: number, updatedVenueData: Partial<Venue>): Promise<Venue | null> {
        const venue = await this.findOneBy({ id });
        if (!venue) return null;
        Object.assign(venue, updatedVenueData);
        return await this.save(venue);
    }

    async findAllVenues(): Promise<Venue[]> {
        return await this.find();
    }

    async findVenuesByFilters(filters: {
        name?: string;
        city?: string;
        country?: string;
        minCapacity?: number;
        maxCapacity?: number;
      }): Promise<Venue[]> {
        const queryBuilder = this.createQueryBuilder('venue')
          .leftJoinAndSelect('venue.location', 'location')
          .leftJoinAndSelect('venue.events', 'events');
    
        // Filter by name (partial match)
        if (filters.name) {
          queryBuilder.andWhere('venue.name LIKE :name', { name: `%${filters.name}%` });
        }
    
        // Filter by city (exact match)
        if (filters.city) {
          queryBuilder.andWhere('location.city = :city', { city: filters.city });
        }
    
        // Filter by country (exact match)
        if (filters.country) {
          queryBuilder.andWhere('location.country = :country', { country: filters.country });
        }
    
        // Filter by capacity range
        if (filters.minCapacity !== undefined) {
          queryBuilder.andWhere('venue.capacity >= :minCapacity', { minCapacity: filters.minCapacity });
        }
        if (filters.maxCapacity !== undefined) {
          queryBuilder.andWhere('venue.capacity <= :maxCapacity', { maxCapacity: filters.maxCapacity });
        }
    
        return await queryBuilder.getMany();
      }

      async findEventsByVenueId(id: number): Promise<Event[]> {
        return await this.findOne({ where: { id }, relations: ['events'] }).then(venue => venue?.events || []);
      }


}
