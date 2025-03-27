import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException, Query } from '@nestjs/common';
import { EventService } from '../service/EventService';
import { CreateEventRequestDto } from '../dto/EventDto';
import { UpdateEventRequestDto } from '../dto/EventDto';
import { EventResponseDto } from '../dto/EventDto';
import { UserService } from '../service/UserService';
import { Category } from '../model/Category';
import { Event } from '../model/Event';

@Controller('api/events')
export class EventController {
   constructor(
       private readonly eventService: EventService,
       private readonly userService: UserService
   ) {}

   @Post()
   async createEvent(@Body() createDto: CreateEventRequestDto): Promise<EventResponseDto> {
       try {
           const organizer = await this.userService.getUserById(createDto.organizerId);
           
           if (!organizer) {
               throw new HttpException('Organizer not found', HttpStatus.NOT_FOUND);
           }

           // Combine date and time properly
           const baseDate = new Date(createDto.date);
           
           // Parse start time and combine with base date
           const [startHours, startMinutes] = createDto.startTime.split(':');
           const startTime = new Date(baseDate);
           startTime.setHours(parseInt(startHours), parseInt(startMinutes));

           // Parse end time and combine with base date
           const [endHours, endMinutes] = createDto.endTime.split(':');
           const endTime = new Date(baseDate);
           endTime.setHours(parseInt(endHours), parseInt(endMinutes));
           if (parseInt(endHours) < parseInt(startHours)) {
               // If end time is earlier than start time, it's the next day
               endTime.setDate(endTime.getDate() + 1);
           }

           console.log("Creating event at location:", createDto.venueLocation);

           const event = await this.eventService.createEvent(
               createDto.name,
               createDto.description,
               createDto.venueLocation,
               baseDate,
               startTime,
               endTime,
               Category[createDto.category as keyof typeof Category],
               organizer
           );
           return this.mapToResponseDto(event);
       } catch (error: unknown) {
           console.error('Error creating event:', error);
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
        response.venueLocation = event.getVenueLocation() || '';
        response.date = event.getDate();
        response.startTime = event.getStartTime();
        response.endTime = event.getEndTime();
        response.category = event.getCategory();
        
        // Add null checks to prevent errors when organizer or userAccount is missing
        const organizer = event.getOrganizer();
        response.organizer = {
            id: organizer?.id || 0,
            fullName: organizer?.getUserAccount()?.getFullName() || 'Unknown Organizer'
        };
        
        return response;
   }

}
