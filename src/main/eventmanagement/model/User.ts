import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    OneToMany,
    ManyToOne,
    JoinTable,
    OneToOne,
    JoinColumn,
  } from 'typeorm';

import { UserEventRole } from './UserEventRole';
import { Event } from "./Event";
import { UserAccount } from "./UserAccount";
import { Review } from "./Review";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    private id!: number;

    @OneToOne(() => UserAccount, { cascade: true, eager: true })
    @JoinColumn()
    userAccount: UserAccount;

    @OneToMany(() => UserEventRole, (userEventRole) => userEventRole.user)
    userEventRoles!: UserEventRole[];
    
    @ManyToMany(() => Event, { cascade: true })
    @JoinTable()
    attendedEvents: Set<Event>;

    @OneToMany(() => Event, (event) => event.organizer, { cascade: true })
    organizedEvents: Set<Event>;

    @ManyToMany(() => User, { cascade: true })
    @JoinTable()
    friends: Set<User>;

    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    constructor(userAccount: UserAccount) {
        this.userAccount = userAccount;
        this.userEventRoles = [];
        this.attendedEvents = new Set<Event>();
        this.organizedEvents = new Set<Event>();
        this.friends = new Set<User>();
        this.reviews = [];
    }

    public getReviews(): Review[] {
        return this.reviews;
    }

    public getUserAccount(): UserAccount {
        return this.userAccount;
    }
    
    public getUserEventRole(event: Event): UserEventRole | undefined {
        return this.userEventRoles.find((userEventRole) => userEventRole.event === event);
    }

    public setUserEventRole(userEventRole: UserEventRole): void {
        this.userEventRoles.push(userEventRole);
    }

    public removeUserEventRole(userEventRole: UserEventRole): void {
        this.userEventRoles = this.userEventRoles.filter((role) => role !== userEventRole);
    }


    public setUserAccount(userAccount: UserAccount): void {
        this.userAccount = userAccount;
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
        return this.userEventRoles.some((userEventRole) => userEventRole.event === event);
    }


    
}