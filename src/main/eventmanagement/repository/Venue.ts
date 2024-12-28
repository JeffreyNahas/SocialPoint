import { EntityRepository, Repository } from "typeorm";
import { Venue } from "../model/Venue";
import { Location } from "../model/Location";
import { Event } from "../model/Event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class VenueRepository extends Repository<Venue> {
    async findVenueById(id: number): Promise<Venue | null> {
        return await this.findOne({ where: { id } });
    }

    async findAllVenues(): Promise<Venue[]> {
        return await this.find();
    }

    async findEventsByVenueId(id: number): Promise<Set<Event>> {
      const venue = await this.findOne({ where: { id }, relations: ['events'] });
      return new Set(venue?.eventsHosted || []);
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

}
