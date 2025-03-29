import {
    Entity,     
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
    JoinTable,
    OneToOne,
    ManyToMany,
} from 'typeorm';
import { User } from "./User";
import { Category } from "./Category";
import { UserEventRole } from "./UserEventRole";
import { Review } from "./Review";
import { Notification } from "./Notification";

// Handling Notifications triggered by the Event
import { Role } from './UserRole';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    name!: string;
  
    @Column({ type: 'text' })
    description!: string;
    
    // Replace venue relationship with direct location string
    @Column({ type: 'text', nullable: true })
    venueLocation!: string | null;
    
    @Column({ type: 'date' })
    date!: Date;
  
    @Column({ type: 'timestamp' })
    startTime!: Date;
  
    @Column({ type: 'timestamp' })
    endTime!: Date;
  
    @Column({
        type: "enum",
        enum: Category,
        default: Category.OTHER
    })
    category!: Category;
  
    @ManyToOne(() => User, (user) => user.eventsOrganizing)
    @JoinColumn({ name: 'organizer_id' })
    organizer!: User;

    @ManyToMany(() => User, user => user.attendedEvents)
    @JoinTable({
        name: 'event_attendees',
        joinColumn: {
            name: 'event_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        }
    })
    attendees!: User[];
  
    // @ManyToMany(() => User, user => user.attendedEvents)
    // @JoinTable({
    //     name: 'event_attendees',
    //     joinColumn: {
    //         name: 'event_id',
    //         referencedColumnName: 'id'
    //     },
    //     inverseJoinColumn: {
    //         name: 'user_id',
    //         referencedColumnName: 'id'
    //     }
    // })
    // listOfAttendees!: Set<User>;

    @OneToMany(() => UserEventRole, (userEventRole) => userEventRole.event)
    userEventRoles!: UserEventRole[];

    @OneToMany(() => Review, (review) => review.event)
    reviews!: Review[];

    @OneToMany(() => Notification, (notification) => notification.event)
    notifications!: Notification[];

    constructor() {
        // this.listOfAttendees = new Set<User>();
        // this.reviews = [];
        // this.notifications = [];
    }

    public getName(): string {
        return this.name;   
    }

    public getDescription(): string {
        return this.description;
    }

    public getCategory(): Category {
        return this.category;
    }

    public getVenueLocation(): string | null {
        return this.venueLocation;
    }

    public getStartTime(): Date {
        return this.startTime;
    }

    public getEndTime(): Date {
        return this.endTime;
    }

    public getDate(): Date {
        return this.date;
    }

    public getOrganizer(): User {
        return this.organizer;
    }
    // public getListOfAttendees(): Set<User> {
    //     return this.listOfAttendees;
    // }


    public setName(name: string): void {
        this.name = name;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setCategory(category: Category): void {
        this.category = category;
    }

    public setVenueLocation(location: string | null): void {
        this.venueLocation = location;
    }

    public setStartTime(startTime: Date): void {
        this.startTime = startTime;
    }

    public setEndTime(endTime: Date): void {
        this.endTime = endTime;
    }

    public setDate(date: Date): void {
        this.date = date;
    }

    public setOrganizer(organizer: User): void {
        this.organizer = organizer;
    }

    public addReview(review: Review, user: User): void {
        this.reviews.push(review);
        
        // Add null check for userAccount
        const userAccount = user.getUserAccount();
        const userName = userAccount ? userAccount.getFullName() : 'A user';
        
        this.addNotification(new Notification(`${userName} reviewed ${this.name}`, new Date(), this, "organizer"));
    }

    public addNotification(notification: Notification): void {
        this.notifications.push(notification);
    }

    public updateDate(newDate: Date): void {
        this.date = newDate;
        this.addNotification(new Notification(`${this.name} Date updated to ${newDate.toISOString()}`, new Date(), this, "attendee"));
        this.addNotification(new Notification(`$You have successfully updated the Date for ${this.name}}`, new Date(), this, "organizer"))
    }
    public updateStartTime(newStartTime: Date): void {
        this.startTime = newStartTime;
        this.addNotification(new Notification(`${this.name} Start Time updated to ${newStartTime.toISOString()}`, new Date(), this, "attendee"));
        this.addNotification(new Notification(`$You have successfully updated the Start Time for ${this.name}}`, new Date(), this, "organizer"));
    }
    public updateEndTime(newEndTime: Date): void {
        this.endTime = newEndTime;
        this.addNotification(new Notification(`${this.name} End Time updated to ${newEndTime.toISOString()}`, new Date(), this, "attendee"));
        this.addNotification(new Notification(`$You have successfully updated the End Time for ${this.name}}`, new Date(), this, "organizer"));
    }
    public updateVenueLocation(newLocation: string | null): void {
        this.venueLocation = newLocation;
        this.addNotification(new Notification(`${this.name} location updated to ${newLocation}`, new Date(), this, "attendee"));
        this.addNotification(new Notification(`You have successfully updated the location for ${this.name}`, new Date(), this, "organizer"));
    }

    public updateDescription(newDescription: string): void {
        this.description = newDescription;
        this.addNotification(new Notification(`$You have successfully updated the Description for ${this.name}}`, new Date(), this, "organizer"));
    }
    public updateCategory(newCategory: Category): void {
        this.category = newCategory;
        this.addNotification(new Notification(`$You have successfully updated the Category for ${this.name}}`, new Date(), this, "organizer"));
    }

    public updateName(newName: string): void {
        this.name = newName;
        this.addNotification(new Notification(`${this.name} Name updated to ${newName}`, new Date(), this, "organizer"));
    }
    // public addAttendee(user: User): void {
    //     if (!this.listOfAttendees) {
    //         this.listOfAttendees = new Set<User>();
    //     }
    //     if (user.getUserEventRoleForEvent(this)?.getRole() == Role.Attendee) {
    //         this.listOfAttendees.add(user);
    //     }
    // }

    // public removeAttendee(user: User): void {
    //     this.listOfAttendees.delete(user);
    // }

    public removeReview(reviewId: number): void {
        this.reviews = this.reviews.filter(review => review.id !== reviewId);
    }

    // public hasAttendee(user: User): boolean {
    //     return this.listOfAttendees.has(user);
    // }

    // public getAttendeesCount(): number {
    //     return this.listOfAttendees.size;
    // }

    public getAttendees(): User[] {
        return this.attendees;
    }

    public addAttendee(user: User): void {
        if (!this.attendees) {
            this.attendees = [];
        }
        if (!this.attendees.some(attendee => attendee.id === user.id)) {
            this.attendees.push(user);
        }
    }

    public removeAttendee(user: User): void {
        this.attendees = this.attendees.filter(attendee => attendee.id !== user.id);
    }

    public hasAttendee(userId: number): boolean {
        return this.attendees.some(attendee => attendee.id === userId);
    }

}