import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException, Query } from '@nestjs/common';
import { EventService } from '../service/EventService';
import { CreateEventRequestDto } from '../dto/EventDto';
import { UpdateEventRequestDto } from '../dto/EventDto';
import { EventResponseDto } from '../dto/EventDto';
import { UserService } from '../service/UserService';
import { Category } from '../model/Category';
import { Event } from '../model/Event';
import { EventRepository } from '../repository/EventRepository';
import { CurrentUserService } from '../service/CurrentUserService';
import { UserResponseDto } from '../dto/UserDto';
import { User } from '../model/User';

@Controller('api/events')
export class EventController {
   constructor(
       private readonly eventService: EventService,
       private readonly userService: UserService,
       private readonly eventRepository: EventRepository,
       private readonly currentUserService: CurrentUserService
   ) {}

   @Post()
   async createEvent(@Body() createDto: CreateEventRequestDto): Promise<EventResponseDto> {
       try {
           // Get the current user ID (fallback to provided ID if not available)
           const organizerId = this.currentUserService.getCurrentUserId() || createDto.organizerId;
           
           if (!organizerId) {
               throw new HttpException('Organizer ID is required', HttpStatus.BAD_REQUEST);
           }

           const organizer = await this.userService.getUserById(organizerId);
           
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
   async getAllEvents() {
       const events = await this.eventRepository.findAllEvents();
       
       return events.map((event: Event) => ({
           id: event.id,
           name: event.name,
           description: event.description,
           date: event.date,
           startTime: event.startTime,
           endTime: event.endTime,
           venueLocation: event.venueLocation || '',
           category: event.category,
           organizerId: event.organizer?.id || null,
           organizerName: event.organizer?.userAccount?.getFullName() || 'Unknown Organizer'
       }));
   }

   @Post(':id/attendees')
   async addAttendee(@Param('id') id: number): Promise<EventResponseDto> {
        const currentUserId = this.currentUserService.getCurrentUserId();
        if (!currentUserId) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const event = await this.eventService.addAttendee(id, currentUserId);
        return this.mapToResponseDto(event);
   }

   @Delete(':id/attendees')
   async removeAttendee(@Param('id') id: number): Promise<EventResponseDto> {
       const currentUserId = this.currentUserService.getCurrentUserId();
       if (!currentUserId) {
           throw new HttpException('User not found', HttpStatus.NOT_FOUND);
       }
       if (await this.eventService.checkIfUserIsAttendee(id, currentUserId)) {
        const event = await this.eventService.removeAttendee(id, currentUserId);
        return this.mapToResponseDto(event);
       } else {
        throw new HttpException('User is not an attendee of this event', HttpStatus.BAD_REQUEST);
       }
   }

   @Get(':id/attendees')
   async getAttendees(@Param('id') id: number): Promise<UserResponseDto[]> {
       const attendees = await this.eventService.getAttendeesByEvent(id);
       return attendees.map(attendee => this.mapToUserResponseDto(attendee));
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

   private mapToUserResponseDto(user: User): UserResponseDto {
       const response = new UserResponseDto();
       response.id = user.id;
       
       const userAccount = user.getUserAccount();
       if (userAccount) {
           response.email = userAccount.getEmail();
           response.fullName = userAccount.getFullName();
           response.phoneNumber = userAccount.getPhoneNumber();
       } else {
           response.email = '';
           response.fullName = '';
           response.phoneNumber = '';
       }
       
       return response;
   }

}
