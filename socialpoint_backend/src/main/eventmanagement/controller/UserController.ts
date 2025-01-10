import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from '../service/UserService';
import { CreateUserRequestDto } from '../dto/UserDto';
import { UpdateUserRequestDto } from '../dto/UserDto';
import { AddFriendRequestDto } from '../dto/UserDto';
import { UserEventRoleRequestDto } from '../dto/UserDto';
import { UserResponseDto } from '../dto/UserDto';
import { UserEventRole } from '../model/UserEventRole';
import { User } from '../model/User';
import { UserAccountService } from '../service/UserAccountService';
@Controller('users')
export class UserController {
   constructor(
       private readonly userService: UserService,
       private readonly userAccountService: UserAccountService
   ) {}

   @Post()
   async createUser(@Body() createDto: CreateUserRequestDto): Promise<UserResponseDto> {
       try {
        const userAccount = await this.userAccountService.createUserAccount(
               createDto.fullName,
               createDto.email,
               createDto.phoneNumber || '',
               createDto.password
           );
           const user = await this.userService.createUser(userAccount);
           return this.mapToResponseDto(user);
       } catch (error) {
           throw new HttpException('Failed to create user', HttpStatus.BAD_REQUEST);
       }
   }

   @Get(':id')
   async getUser(@Param('id') id: number): Promise<UserResponseDto> {
       const user = await this.userService.getUserById(id);
       if (!user) {
           throw new HttpException('User not found', HttpStatus.NOT_FOUND);
       }
       return this.mapToResponseDto(user);
   }

   @Put(':id')
   async updateUser(
       @Param('id') id: number,
       @Body() updateDto: UpdateUserRequestDto
   ): Promise<UserResponseDto> {
       const user = await this.userService.getUserById(id);
       if (!user) {
           throw new HttpException('User not found', HttpStatus.NOT_FOUND);
       }
       
       const userAccount = user.getUserAccount();
       if (updateDto.email) userAccount.setEmail(updateDto.email);
       if (updateDto.fullName) userAccount.setFullName(updateDto.fullName);
       if (updateDto.phoneNumber) userAccount.setPhoneNumber(updateDto.phoneNumber);
       if (updateDto.password) userAccount.setPassword(updateDto.password);
       
       await this.userAccountService.updateUserAccount(userAccount.id, userAccount);
       return this.mapToResponseDto(user);
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

   @Post(':id/event-roles')
   async addEventRole(
       @Param('id') userId: number,
       @Body() roleDto: UserEventRoleRequestDto
   ): Promise<UserResponseDto> {
       try {
           const userEventRole = new UserEventRole();
           userEventRole.setRole(roleDto.role);
           const user = await this.userService.addUserRoleForEvent(
               userId,
               roleDto.eventId,
               userEventRole
           );
           if (!user) {
               throw new HttpException('User not found', HttpStatus.NOT_FOUND);
           }
           return this.mapToResponseDto(user);
       } catch (error) {
           throw new HttpException('Failed to add event role', HttpStatus.BAD_REQUEST);
       }
   }

   private mapToResponseDto(user: User): UserResponseDto {
       const response = new UserResponseDto();
       const userAccount = user.getUserAccount();
       response.id = user.id;
       response.email = userAccount.getEmail();
       response.fullName = userAccount.getFullName();
       response.phoneNumber = userAccount.getPhoneNumber();
       response.friends = Array.from(user.getFriends()).map(friend => ({
           id: friend.id,
           fullName: friend.getUserAccount().getFullName()
       }));
       response.eventRoles = Array.from(user.userEventRoles).map(role => ({
           userId: user.id,
           eventId: role.getEvent().id,
           role: role.getRole(),
           eventName: role.getEvent().name
       }));
       return response;
   }
}