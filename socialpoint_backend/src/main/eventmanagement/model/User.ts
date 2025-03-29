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
    id!: number;

    @OneToOne(() => UserAccount, userAccount => userAccount.user)
    userAccount!: UserAccount;

    @OneToMany(() => UserEventRole, userEventRole => userEventRole.user)
    userEventRoles!: Set<UserEventRole>;
    
    @ManyToMany(() => User, user => user.friends)
    @JoinTable({
        name: 'user_friends',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'friend_id',
            referencedColumnName: 'id'
        }
    })
    friends!: Set<User>;

    // DO NOT NEED THIS ANYMORE SHOULD BE REMOVED BUT KEPT FOR DATABASE COMPATIBILITY
    @OneToMany(() => Event, (event) => event.organizer)
    eventsOrganizing!: Event[];

    @ManyToMany(() => Event, event => event.attendees)
    attendedEvents!: Set<Event>;

    @OneToMany(() => Review, review => review.user)
    reviews!: Set<Review>;

    constructor() {
        this.userEventRoles = new Set<UserEventRole>();
        this.friends = new Set<User>();
        this.attendedEvents = new Set<Event>();
        this.reviews = new Set<Review>();
    }

    public getAttendedEvents(): Set<Event> {
        return this.attendedEvents;
    }

    public getUserAccount(): UserAccount | null {
        return this.userAccount || null;
    }
    

    public removeUserRoleForEvent(userEventRole: UserEventRole): void {
        this.userEventRoles.delete(userEventRole);
    }


    public setUserAccount(userAccount: UserAccount): void {
        this.userAccount = userAccount;
    }

    public hasFriend(user: User): boolean {
        return this.friends.has(user);
    }

    public addFriend(user: User): void {
        if (!this.friends) {
            this.friends = new Set<User>();
        }
        this.friends.add(user);
    }

    public removeFriend(user: User): void {
        this.friends.delete(user);
    }

    public getFriends(): Set<User> {
        return this.friends;
    }

    public toString(): string {
        return `User(userAccount=${this.userAccount}, userEventRoles=${this.userEventRoles})`;
        
    }

    
}