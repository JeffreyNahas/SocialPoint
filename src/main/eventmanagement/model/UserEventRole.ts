import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    JoinColumn,
    OneToOne
  } from 'typeorm';
  import { User } from './User';
  import { Event } from './Event';
  import {Role} from './UserRole';
  
  @Entity()
  export class UserEventRole {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => User, (user) => user.userEventRoles)
    user!: User;
  
    @OneToOne(() => Event)
    event!: Event;
  
    @Column()
    role!: Role;  // Role can be a string (e.g., 'Organizer', 'Participant')

    constructor(user: User, event: Event, role: Role) {
        this.user = user;
        this.event = event;
        this.role = role;
    }

    public getEvent(): Event {
        return this.event;
    }

    public getUser(): User {
        return this.user;
    }

    public getRole(): Role {
        return this.role;
    }

    public setEvent(event: Event): void {
        this.event = event;
    }

    public setUser(user: User): void {
        this.user = user;
    }

    public setRoleForEvent(role: Role, event: Event): void {
        this.role = role;
        this.event = event;
    }

    public toString(): string {
        return `UserEventRole(user=${this.user}, event=${this.event}, role=${this.role})`;
    }


  }
