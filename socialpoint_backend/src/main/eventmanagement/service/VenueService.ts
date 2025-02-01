import { Injectable } from "@nestjs/common";
import { VenueRepository } from "../repository/VenueRepository";
import { Venue } from "../model/Venue";
import { Event } from "../model/Event";

@Injectable()
export class VenueService {
    constructor(
        private readonly venueRepository: VenueRepository,
    ) {}

    async createVenue(venue: Venue): Promise<Venue> {
        const newVenue = new Venue(venue.name, venue.location, venue.capacity);
        return await this.venueRepository.save(newVenue);
    }

    async getVenueByAddress(address: string): Promise<Venue | null> {
        return await this.venueRepository.findVenueByAddress(address);
    }

    async updateVenue(address: string, updatedVenueData: Partial<Venue>): Promise<Venue | null> {
        const venue = await this.getVenueByAddress(address);
        if (!venue) return null;

        Object.assign(venue, updatedVenueData);
        return await this.venueRepository.save(venue);
    }

    async deleteVenue(id: number): Promise<boolean> {
        const result = await this.venueRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }

    async getEventsByVenueId(address: string): Promise<Set<Event>> {
        
        const venue = await this.getVenueByAddress(address);
        if (!venue) return new Set();
        return await this.venueRepository.findEventsByVenue(venue);
    }

    async getAllVenues(): Promise<Venue[]> {
        return await this.venueRepository.findAllVenues();
    }

    async getVenuesByFilters(filters: {
        name?: string;
        city?: string;
        country?: string;
        minCapacity?: number;
        maxCapacity?: number;
      }): Promise<Venue[]> {
        return await this.venueRepository.findVenuesByFilters(filters);
    }

}   
