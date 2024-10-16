import { Role } from "./UserRole";  
import { Event } from "./Event";
import { UserAccount } from "./UserAccount";

export class User {

    private userAccount: UserAccount;
    private roles: Map<Event, Role>;
    
    private attendedEvents: Set<Event>;
    private organizedEvents: Set<Event>;
    private friends: Set<User>;

    constructor(userAccount: UserAccount) {
        this.userAccount = userAccount;
        this.roles = new Map<Event, Role>();
        this.attendedEvents = new Set<Event>();
        this.organizedEvents = new Set<Event>();
        this.friends = new Set<User>();
    }

    public getUserAccount(): UserAccount {
        return this.userAccount;
    }

    public getRoleForEvent(event: Event): Role | undefined {
        return this.roles.get(event);
    }

    public setUserAccount(userAccount: UserAccount): void {
        this.userAccount = userAccount;
    }

    public setRoleForEvent(event: Event, role: Role): void {
        this.roles.set(event, role);
    }

    public removeRoleForEvent(event: Event): void {
        this.roles.delete(event);
    }

    public attendEvent(event: Event): void {
        this.attendedEvents.add(event);
    }

    public leaveEvent(event: Event): void {
        this.attendedEvents.delete(event);
    }

    public organizeEvent(event: Event): void {
        this.organizedEvents.add(event);
    }

    public getAttendedEvents(): Set<Event> {
        return this.attendedEvents;
    }

    public getOrganizedEvents(): Set<Event> {
        return this.organizedEvents;
    }

    public hasAttendedEvent(event: Event): boolean {
        return this.attendedEvents.has(event);
    }   

    public hasOrganizedEvent(event: Event): boolean {
        return this.organizedEvents.has(event);
    }

    public hasFriend(user: User): boolean {
        return this.friends.has(user);
    }

    public addFriend(user: User): void {
        this.friends.add(user);
    }

    public removeFriend(user: User): void {
        this.friends.delete(user);
    }

    public getFriends(): Set<User> {
        return this.friends;
    }

    public hasRoleForEvent(event: Event): boolean {
        return this.roles.has(event);
    }


    
}