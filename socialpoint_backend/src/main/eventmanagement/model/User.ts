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

    @OneToMany(() => Event, event => event.organizer)
    organizedEvents!: Set<Event>;

    // @ManyToMany(() => Event, event => event.listOfAttendees)
    // @JoinTable()
    // attendedEvents!: Set<Event>;

    @OneToMany(() => Review, review => review.user)
    reviews!: Set<Review>;

    constructor() {
        this.userEventRoles = new Set<UserEventRole>();
        this.friends = new Set<User>();
        // this.attendedEvents = new Set<Event>();
        this.organizedEvents = new Set<Event>();
        this.reviews = new Set<Review>();
    }

    public getUserAccount(): UserAccount {
        return this.userAccount;
    }
    
    public getUserEventRoleForEvent(event: Event): UserEventRole | null {
        for (const userEventRole of this.userEventRoles) {
            if (userEventRole.event === event) {
                return userEventRole;
            }
        }
        return null;
    }

    public setUserEventRoleForEvent(UserRoleForEvent: UserEventRole, eventToSet: Event): void {
        UserRoleForEvent.setEvent(eventToSet);
    }

    public addUserRoleForEvent(userEventRole: UserEventRole): void {
        if (!this.userEventRoles) {
            this.userEventRoles = new Set<UserEventRole>();
        }
        this.userEventRoles.add(userEventRole);
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

    public hasUserRoleForEvent(event: Event): boolean {
        return this.getUserEventRoleForEvent(event) !== null;
    }

    public toString(): string {
        return `User(userAccount=${this.userAccount}, userEventRoles=${this.userEventRoles})`;
        
    }

    
}