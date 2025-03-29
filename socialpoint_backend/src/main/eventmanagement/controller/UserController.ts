import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from '../service/UserService';
import { CreateUserRequestDto, UpdateProfileInfoDto } from '../dto/UserDto';
import { UpdateUserRequestDto } from '../dto/UserDto';
import { AddFriendRequestDto } from '../dto/UserDto';
import { UserEventRoleRequestDto } from '../dto/UserDto';
import { UserResponseDto } from '../dto/UserDto';
import { UserEventRole } from '../model/UserEventRole';
import { User } from '../model/User';
import { UserAccountService } from '../service/UserAccountService';
import { UserAccount } from '../model/UserAccount';
import { UserRepository } from '../repository/UserRepository';
import { EventResponseDto } from '../dto/EventDto';
import { Event } from '../model/Event';
import { CurrentUserService } from '../service/CurrentUserService';
import { EventService } from '../service/EventService';
import { IsString } from 'class-validator';

@Controller('api/users')
export class UserController {
   constructor(
       private readonly userService: UserService,
       private readonly userAccountService: UserAccountService,
       private readonly userRepository: UserRepository,
       private readonly currentUserService: CurrentUserService,
       private readonly eventService: EventService
   ) {}

   @Post()
   async createUser(@Body() createDto: CreateUserRequestDto): Promise<UserResponseDto> {
       try {
           // Create user account first
           const userAccount = await this.userAccountService.createUserAccount(
               createDto.fullName,
               createDto.email,
               createDto.phoneNumber || '',
               createDto.password
           );

           // Create user and link it to the user account
           const user = new User();
           user.setUserAccount(userAccount);
           const savedUser = await this.userRepository.save(user);

           // Link user back to user account
           userAccount.user = savedUser;
           await this.userAccountService.updateUserAccount(userAccount.id, userAccount);

           return this.mapToResponseDto(savedUser);
       } catch (error) {
           throw new HttpException(
               error instanceof Error ? error.message : 'Failed to create user', 
               HttpStatus.BAD_REQUEST
           );
       }
   }

   @Get('organized-events')
   async getOrganizedEvents(): Promise<EventResponseDto[]> {
       const userId = this.currentUserService.getCurrentUserId();
       if (!userId) {
           throw new HttpException('User not found', HttpStatus.NOT_FOUND);
       }
       const events = await this.userService.getOrganizedEventsByUserId(userId);
       return events.map(event => this.mapToEventResponseDto(event));
   }

   @Get('attended-events')
   async getAttendedEvents(): Promise<EventResponseDto[]> {
       const userId = this.currentUserService.getCurrentUserId();
       if (!userId) {
           throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
       }
       
       const events = await this.eventService.getAttendedEvents(userId);
       return events.map(event => this.mapToEventResponseDto(event));
   }

   @Get(':id')
   async getUser(@Param('id') id: number): Promise<UserResponseDto> {
       const user = await this.userService.getUserById(id);
       if (!user) {
           throw new HttpException('User not found', HttpStatus.NOT_FOUND);
       }
       return this.mapToResponseDto(user);
   }

   @Put('user-account')
   async updateUser(
       @Body() updateDto: UpdateUserRequestDto
   ): Promise<UserResponseDto> {
       try {
           const userId = this.currentUserService.getCurrentUserId();
           if (!userId) {
               throw new HttpException('User not found', HttpStatus.NOT_FOUND);
           }
           const user = await this.userService.getUserById(userId);
           if (!user) {
               throw new HttpException('User not found', HttpStatus.NOT_FOUND);
           }
           
           const userAccount = user.getUserAccount();
           if (!userAccount) {
               throw new HttpException('User account not found', HttpStatus.NOT_FOUND);
           }
           
           if (updateDto.email) userAccount.setEmail(updateDto.email);
           if (updateDto.fullName) userAccount.setFullName(updateDto.fullName);
           if (updateDto.phoneNumber) userAccount.setPhoneNumber(updateDto.phoneNumber);
           if (updateDto.password) userAccount.setPassword(updateDto.password);
           
           await this.userAccountService.updateUserAccount(userAccount.id, userAccount);
           return this.mapToResponseDto(user);
       } catch (error) {
           throw new HttpException(
               error instanceof Error ? error.message : 'Failed to update user', 
               HttpStatus.BAD_REQUEST
           );
       }
   }

   @Delete(':id')
   async deleteUser(@Param('id') id: number): Promise<void> {
       const deleted = await this.userService.deleteUser(id);
       if (!deleted) {
           throw new HttpException('User not found', HttpStatus.NOT_FOUND);
       }
   }

   @Post(':id/friends')
   async addFriend(
       @Param('id') userId: number,
       @Body() addFriendDto: AddFriendRequestDto
   ): Promise<UserResponseDto> {
       try {
           const user = await this.userService.addFriend(userId, addFriendDto.friendId);
           if (!user) {
               throw new HttpException('User not found', HttpStatus.NOT_FOUND);
           }
           return this.mapToResponseDto(user);
       } catch (error) {
           throw new HttpException('Failed to add friend', HttpStatus.BAD_REQUEST);
       }
   }

   @Delete(':id/friends/:friendId')
   async removeFriend(
       @Param('id') userId: number,
       @Param('friendId') friendId: number
   ): Promise<UserResponseDto> {
       try {
           const user = await this.userService.removeFriend(userId, friendId);
           if (!user) {
               throw new HttpException('User not found', HttpStatus.NOT_FOUND);
           }
           return this.mapToResponseDto(user);
       } catch (error) {
           throw new HttpException('Failed to remove friend', HttpStatus.BAD_REQUEST);
       }
   }

   @Get(':id/friends')
   async getFriends(@Param('id') userId: number): Promise<UserResponseDto[]> {
       try {
           const friends = await this.userService.getFriends(userId);
           return friends.map(friend => this.mapToResponseDto(friend));
       } catch (error) {
           throw new HttpException('Failed to get friends', HttpStatus.BAD_REQUEST);
       }
   }

   @Put('user-account')
   async updateProfileInfo(
       @Body() updateDto: UpdateProfileInfoDto
   ): Promise<UserResponseDto> {
       const userId = this.currentUserService.getCurrentUserId();
       if (!userId) {
           throw new HttpException('User not found', HttpStatus.NOT_FOUND);
       }
       const user = await this.userService.updateUser(userId, updateDto);
       return this.mapToResponseDto(user);
   }

   private mapToResponseDto(user: User): UserResponseDto {
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
       
       response.friends = Array.from(user.getFriends()).map(friend => {
           const friendAccount = friend.getUserAccount();
           return {
               id: friend.id,
               fullName: friendAccount ? friendAccount.getFullName() : 'Unknown User'
           };
       });
       
       response.eventRoles = Array.from(user.userEventRoles).map(role => ({
           userId: user.id,
           eventId: role.getEvent().id,
           role: role.getRole(),
           eventName: role.getEvent().name
       }));
       return response;
   }

   private mapToEventResponseDto(event: Event): EventResponseDto {
       const response = new EventResponseDto();
       response.id = event.id;
       response.name = event.getName();
       response.description = event.getDescription();
       response.venueLocation = event.getVenueLocation() || '';
       response.date = event.getDate();
       response.startTime = event.getStartTime();
       response.endTime = event.getEndTime();
       response.category = event.getCategory();
       
       const organizer = event.getOrganizer();
       response.organizer = {
           id: organizer?.id || 0,
           fullName: organizer?.getUserAccount()?.getFullName() || 'Unknown Organizer'
       };
       
       return response;
   }
}
