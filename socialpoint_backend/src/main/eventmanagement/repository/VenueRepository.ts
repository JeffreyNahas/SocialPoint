import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from '../model/Venue';
import { Event } from "../model/Event";

@Injectable()
export class VenueRepository {
    constructor(
        @InjectRepository(Venue)
        private repository: Repository<Venue>
    ) {}

    async findVenueByAddress(location: string): Promise<Venue | null> {
        return await this.repository.findOne({ where: { location } });
    }

    async save(venue: Venue): Promise<Venue> {
        return await this.repository.save(venue);
    }

    async findAllVenues(): Promise<Venue[]> {
        return await this.repository.find();
    }

    async findEventsByVenue(venue: Venue): Promise<Set<Event>> {
        return new Set(venue?.events || []);
    }

    async findVenuesByFilters(filters: {
        name?: string;
        city?: string;
        country?: string;
        minCapacity?: number;
        maxCapacity?: number;
      }): Promise<Venue[]> {
        const queryBuilder = this.repository.createQueryBuilder('venue')
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

    async delete(id: number) {
        return await this.repository.delete(id);
    }
}
