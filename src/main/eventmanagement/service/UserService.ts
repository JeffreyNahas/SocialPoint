import { User } from "../model/User";
import { UserRepository } from "../repository/UserRepository";
import { UserAccount } from "../model/UserAccount";
import { Event } from "../model/Event";
import { UserEventRole } from "../model/UserEventRole";


export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(userAccount: UserAccount): Promise<User> {
        return await this.userRepository.createUser(userAccount);
    }

    async findUserById(id: number): Promise<User | null> {
        return await this.userRepository.findUserById(id);
    }

    async findAllUsers(): Promise<User[]> {
        return await this.userRepository.findAllUsers();
    }

    async updateUser(id: number, updatedUserData: Partial<User>): Promise<User | null> {
        return await this.userRepository.updateUser(id, updatedUserData);
    }

    async deleteUser(id: number): Promise<boolean> {
        return await this.userRepository.deleteUser(id);
    }

    async findFriends(user: User): Promise<User[]> {
        return await this.userRepository.findFriends(user);
    }

    async addFriend(user: User, friend: User): Promise<void> {
        if(user && friend) {
            user.addFriend(friend);
            friend.addFriend(user);
            await this.userRepository.save(user);
            await this.userRepository.save(friend);
        }
    }

    async removeFriend(user: User, friend: User): Promise<void> {
        if(user && friend) {
            user.removeFriend(friend);
            friend.removeFriend(user);
            await this.userRepository.save(user);
            await this.userRepository.save(friend);
        }
    }
    // Check if a user is attending a specific event
    async isUserAttendingEvent(userId: number, eventId: number): Promise<boolean> {
        const user = await this.userRepository.findUserById(userId);
        if (!user) throw new Error("User not found");
        const attendedEvents = Array.from(user.getAttendedEvents());
        return attendedEvents.some((event: Event) => event.id === eventId);
    }

    

}