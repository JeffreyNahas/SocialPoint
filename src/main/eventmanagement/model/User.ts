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

    @OneToOne(() => UserAccount, { cascade: true, eager: true })
    userAccount: UserAccount;

    @OneToMany(() => UserEventRole, (userEventRole) => userEventRole.user)
    userEventRoles!: Set<UserEventRole>;
    
    @OneToMany(() => User, (user) => user.friends)
    friends!: Set<User>;

    constructor(userAccount: UserAccount) {
        this.userAccount = userAccount;
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