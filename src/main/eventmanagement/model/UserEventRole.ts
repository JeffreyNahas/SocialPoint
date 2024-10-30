import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    JoinColumn
  } from 'typeorm';
  import { User } from './User';
  import { Event } from './Event';
  import {Role} from './UserRole';
  
  @Entity()
  export class UserEventRole {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => User, (user) => user.userEventRoles)
    @JoinColumn()
    user!: User;
  
    @ManyToOne(() => Event, (event) => event.userEventRoles)
    @JoinColumn()
    event!: Event;
  
    @Column()
    role!: Role;  // Role can be a string (e.g., 'Organizer', 'Participant')

    constructor(user: User, event: Event, role: Role) {
        this.user = user;
        this.event = event;
        this.role = role;
    }
  }
