import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../model/User';
import { UserAccount } from '../model/UserAccount';
import { Event } from '../model/Event';
import { UserEventRole } from '../model/UserEventRole';
import { EventService } from './EventService';
import { EventRepository } from '../repository/EventRepository';
import { UserAccountRepository } from '../repository/UserAccountRepository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
        private readonly userAccountRepository: UserAccountRepository,
    ) {}

    // Create a new user
    async createUser(userAccount: UserAccount): Promise<User> {
        const user = new User();
        user.setUserAccount(userAccount);
        return await this.userRepository.save(user);
    }

    // Find a user by ID
    async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findUserById(id);
    }

    // Update user details
    async updateUser(id: number, updatedUserData: Partial<User>): Promise<User | null> {

        const user = await this.getUserById(id);
        if (!user) return null;

        Object.assign(user, updatedUserData);
        return await this.userRepository.save(user);
    }

    // Delete a user
    async deleteUser(id: number): Promise<boolean> {
        const user = await this.getUserById(id);
        if (!user) return false;
        const result = await this.userRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }

    // Add a friend to a user
    async addFriend(userId: number, friendId: number): Promise<User | null> {
        const user = await this.getUserById(userId);
        const friend = await this.getUserById(friendId);
        if (!user || !friend) {
            throw new Error(`User or friend not found`);
        }
        user.addFriend(friend);
        return await this.userRepository.save(user);
    }

    // Remove a friend from a user
    async removeFriend(userId: number, friendId: number): Promise<User | null> {
        const user = await this.getUserById(userId);
        const friend = await this.getUserById(friendId);
        if (!user || !friend) {
            throw new Error(`User or friend not found`);
        }
        user.removeFriend(friend);
        return await this.userRepository.save(user);
    }

    // Get all friends of a user
    async getFriends(userId: number): Promise<User[]> {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        return await this.userRepository.findFriends(user);
    }

    // Add a user role for an event
    async addUserRoleForEvent(userId: number, eventId: number, userEventRole: UserEventRole): Promise<User | null> {
        const user = await this.getUserById(userId);
        const event = await this.eventRepository.findEventById(eventId); // Assuming an EventService exists
        if (!user || !event) {
            throw new Error(`User or Event not found`);
        }
        user.setUserEventRoleForEvent(userEventRole, event);
        return await this.userRepository.save(user);
    }

    // Remove a user role for an event
    async removeUserRoleForEvent(userId: number, eventId: number): Promise<User | null> {
        const user = await this.getUserById(userId);
        const event = await this.eventRepository.findEventById(eventId); // Assuming an EventService exists
        if (!user || !event) {
            throw new Error(`User or Event not found`);
        }
        const userEventRole = user.getUserEventRoleForEvent(event);
        if (userEventRole) {
            user.removeUserRoleForEvent(userEventRole);
        }
        return await this.userRepository.save(user);
    }

    // Check if a user is friends with another user
    async isFriend(userId: number, friendId: number): Promise<boolean> {
        const user = await this.getUserById(userId);
        const friend = await this.getUserById(friendId);
        if (!user || !friend) {
            throw new Error(`User or friend not found`);
        }
        return user.hasFriend(friend);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const userAccount = await this.userAccountRepository.findUserAccountByEmail(email);
        if (!userAccount) return null;
        return await this.userRepository.findUserByUserAccountId(userAccount.id);
    }

    async getUserByFullName(fullName: string): Promise<User[] | null> {
        const userAccounts = await this.userAccountRepository.findUserAccountsByFullName(fullName);
        if (!userAccounts || userAccounts.length === 0) return null;
        const users = await Promise.all(
            userAccounts.map(account => this.userRepository.findUserByUserAccountId(account.id))
        );
        return users.filter((user): user is User => user !== null);
    }
}
