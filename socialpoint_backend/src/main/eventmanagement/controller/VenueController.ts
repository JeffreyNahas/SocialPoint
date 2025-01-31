import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { VenueService } from '../service/VenueService';
import { Venue } from '../model/Venue';
import { Event } from '../model/Event';
import { EventService } from '../service/EventService';

@Controller('api/venues')
export class VenueController {
    constructor(private readonly venueService: VenueService,
        private readonly eventService: EventService
    ) {}

    @Get(':address')
    async getVenueByAddress(@Param('address') address: string): Promise<Venue> {
        const venue = await this.venueService.getVenueByAddress(address);
        if (!venue) {
            throw new HttpException('Venue not found', HttpStatus.NOT_FOUND);
        }
        return venue;
    }

    @Post()
    async createVenue(@Body() venue: Venue): Promise<Venue> {
        return this.venueService.createVenue(venue);
    }

    @Put(':address')
    async updateVenue(@Param('address') address: string, @Body() venue: Venue): Promise<Venue> {
        const updatedVenue = await this.venueService.updateVenue(address, venue);
        if (!updatedVenue) {
            throw new HttpException('Venue not found', HttpStatus.NOT_FOUND);
        }
        return updatedVenue;
    }

    @Delete(':id')
    async deleteVenue(@Param('id') id: string): Promise<void> {
        const deleted = await this.venueService.deleteVenue(parseInt(id));
        if (!deleted) {
            throw new HttpException('Venue not found', HttpStatus.NOT_FOUND);
        }
    }

    @Get(':address/events')
    async getEventsByVenueId(@Param('address') address: string): Promise<Event[]> {
        const events = await this.venueService.getEventsByVenueId(address);
        return Array.from(events);
    }
}
