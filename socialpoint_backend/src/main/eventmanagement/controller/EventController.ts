import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException, Query } from '@nestjs/common';
import { EventService } from '../service/EventService';
import { CreateEventRequestDto } from '../dto/EventDto';
import { UpdateEventRequestDto } from '../dto/EventDto';
import { EventResponseDto } from '../dto/EventDto';
import { VenueService } from '../service/VenueService';
import { UserService } from '../service/UserService';
import { Category } from '../model/Category';
import { Event } from '../model/Event';

@Controller('api/events')
export class EventController {
   constructor(
       private readonly eventService: EventService,
       private readonly venueService: VenueService,
       private readonly userService: UserService
   ) {}

   @Post()
   async createEvent(@Body() createDto: CreateEventRequestDto): Promise<EventResponseDto> {
       try {
           const venue = await this.venueService.getVenueById(createDto.venueId);
           const organizer = await this.userService.getUserById(createDto.organizerId);
           
           if (!venue || !organizer) {
               throw new HttpException('Venue or organizer not found', HttpStatus.NOT_FOUND);
           }
           const date = new Date(createDto.date);
           const startTime = new Date(createDto.startTime);
           const endTime = new Date(createDto.endTime);

           const event = await this.eventService.createEvent(
               createDto.name,
               createDto.description,
               venue,
               date,
               startTime,
               endTime,
               createDto.category,
               organizer
           );
           return this.mapToResponseDto(event);
       } catch (error: unknown) {
           const message = error instanceof Error ? error.message : 'Failed to create event';
           throw new HttpException(message, HttpStatus.BAD_REQUEST);
       }
   }

   @Get(':id')
   async getEvent(@Param('id') id: number): Promise<EventResponseDto> {
       const event = await this.eventService.getEventById(id);
       if (!event) {
           throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
       }
       return this.mapToResponseDto(event);
   }

   @Get()
   async getEvents(@Query() filters: {
       date?: Date,
       venueId?: number,
       category?: Category,
       organizerId?: number,
       location?: string,
       country?: string,
       city?: string,
       state?: string,
   }): Promise<EventResponseDto[]> {
       const events = await this.eventService.getEventsByFilters(filters);
       return events.map(event => this.mapToResponseDto(event));
   }

   @Put(':id')
   async updateEvent(
       @Param('id') id: number,
       @Body() updateDto: UpdateEventRequestDto
   ): Promise<EventResponseDto> {
       const event = await this.eventService.updateEvent(id, updateDto);
       if (!event) {
           throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
       }
       return this.mapToResponseDto(event);
   }

   @Delete(':id')
   async deleteEvent(@Param('id') id: number): Promise<void> {
       const deleted = await this.eventService.deleteEvent(id);
       if (!deleted) {
           throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
       }
   }

//    @Post(':id/attendees/:userId')
//    async addAttendee(
//        @Param('id') eventId: number,
//        @Param('userId') userId: number
//    ): Promise<EventResponseDto> {
//        try {
//            const event = await this.eventService.addAttendeeToEvent(eventId, userId);
//            return this.mapToResponseDto(event);
//        } catch (error: unknown) {
//            const message = error instanceof Error ? error.message : 'Failed to add attendee';
//            throw new HttpException(message, HttpStatus.BAD_REQUEST);
//        }
//    }

//    @Delete(':id/attendees/:userId')
//    async removeAttendee(
//        @Param('id') eventId: number,
//        @Param('userId') userId: number
//    ): Promise<EventResponseDto> {
//        try {
//            const event = await this.eventService.removeAttendeeFromEvent(eventId, userId);
//            return this.mapToResponseDto(event);
//        } catch (error: unknown) {
//            const message = error instanceof Error ? error.message : 'Failed to remove attendee';
//            throw new HttpException(message, HttpStatus.BAD_REQUEST);
//        }
//    }

   private mapToResponseDto(event: Event): EventResponseDto {
        const response = new EventResponseDto();
        response.id = event.id;
        response.name = event.getName();
        response.description = event.getDescription();
        response.venue = event.getVenue();
        response.date = event.getDate();
        response.startTime = event.getStartTime();
        response.endTime = event.getEndTime();
        response.category = event.getCategory();
        const organizer = event.getOrganizer();
        response.organizer = {
            id: organizer.id,
            fullName: organizer.getUserAccount().getFullName()
        };
        return response;
   }

}
