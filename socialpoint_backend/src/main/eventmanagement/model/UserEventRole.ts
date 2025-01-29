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
  
    @ManyToOne(() => Event, (event) => event.userEventRoles)
    event!: Event;
  
    @Column()
    role!: Role;

    constructor() {
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

    public setRole(role: Role): void {
        this.role = role;
    }

    public toString(): string {
        return `UserEventRole(user=${this.user}, event=${this.event}, role=${this.role})`;
    }


  }
