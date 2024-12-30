import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Venue } from "../model/Venue";
import { Event } from "../model/Event";
import { VenueRepository } from "../repository/VenueRepository";

@Injectable()
export class VenueService {
    constructor(
        @InjectRepository(VenueRepository)
        private readonly venueRepository: VenueRepository,
    ) {}

    async createVenue(venue: Venue): Promise<Venue> {
        const newVenue = new Venue(venue.name, venue.location, venue.capacity);
        return await this.venueRepository.save(newVenue);
    }

    async getVenueById(id: number): Promise<Venue | null> {
        return await this.venueRepository.findVenueById(id);
    }

    async updateVenue(id: number, updatedVenueData: Partial<Venue>): Promise<Venue | null> {
        const venue = await this.getVenueById(id);
        if (!venue) return null;

        Object.assign(venue, updatedVenueData);
        return await this.venueRepository.save(venue);
    }

    async deleteVenue(id: number): Promise<boolean> {
        const result = await this.venueRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }

    async getEventsByVenueId(id: number): Promise<Set<Event>> {
        return await this.venueRepository.findEventsByVenueId(id);
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
