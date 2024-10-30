import {
    Entity,     
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinColumn,
    JoinTable,
} from 'typeorm';
import { User } from "./User";
import { Venue } from "./Venue";
import { Category } from "./Category";
import { UserEventRole } from "./UserEventRole";
import { Review } from "./Review";

// Handling Notifications triggered by the Event
import { Notification } from "./Notification";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @ManyToOne(() => Venue, { cascade: true, eager: true })
    @JoinColumn()
    venue: Venue;
  
    @Column({ type: 'date' })
    date: Date;
  
    @Column({ type: 'time' })
    startTime: Date;
  
    @Column({ type: 'time' })
    endTime: Date;
  
    @Column()
    category: Category;
  
    @OneToMany(() => User, (user) => user.organizedEvents)
    @JoinColumn()
    organizer: User;
  
    @ManyToMany(() => User, { cascade: true })
    @JoinTable()
    attendees: Set<User>;
  
    @OneToMany(() => UserEventRole, (userEventRole) => userEventRole.event)
    userEventRoles!: UserEventRole[];
  
    @OneToMany(() => Notification, (notification) => notification.event)
    attendeeNotifications!: Notification[];
  
    @OneToMany(() => Notification, (notification) => notification.event)
    organizerNotifications!: Notification[];

    @OneToMany(() => Notification, (notification) => notification.event)
    notifications!: Notification[];

    @OneToMany(() => Review, (review) => review.event)
    reviews!: Review[];

    
    constructor(name: string, description: string, venue: Venue, date: Date, startTime: Date, endTime: Date, category: Category, organizer: User) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.venue = venue;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.organizer = organizer;
        this.attendees = new Set<User>();
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

    public getVenue(): Venue {
        return this.venue;
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
    public getAttendees(): Set<User> {
        return this.attendees;
    }

    public getAttendeeNotifications(): Notification[] {
        return this.attendeeNotifications;
    }

    public getOrganizerNotifications(): Notification[] {
        return this.organizerNotifications;
    }

    public getNotifications(): Notification[] {
        return this.notifications;
    }

    public getReviews(): Review[] {
        return this.reviews;
    }


    public setName(name: string): void {
        this.name = name;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setCategory(category: Category): void {
        this.category = category;
    }

    public setVenue(venue: Venue): void {
        this.venue = venue;
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

    public addReview(review: Review): void {
        this.reviews.push(review);
        this.addNotification(new Notification(`${review.getUser().getUserAccount().getFullName()} reviewed ${this.name}`, new Date(), this, "organizer"));
    }


    public addAttendeeNotification(notification: Notification): void {
        if (notification.getNotificationType() === "attendee") {
            this.attendeeNotifications.push(notification);
        }
    }

    public addOrganizerNotification(notification: Notification): void {
        if (notification.getNotificationType() === "organizer") {   
            this.organizerNotifications.push(notification);
        }
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
    public updateVenue(newVenue: Venue): void {
        this.venue = newVenue;
        this.addNotification(new Notification(`${this.name} Venue updated to ${newVenue.getName()}`, new Date(), this, "attendee"));
        this.addNotification(new Notification(`$You have successfully updated the Venue for ${this.name}}`, new Date(), this, "organizer"));
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
    public addAttendee(user: User): void {
        this.attendees.add(user);
    }

    public removeAttendee(user: User): void {
        this.attendees.delete(user);
    }

    public removeReview(review: Review): void {
        this.reviews = this.reviews.filter(r => r !== review);
    }

    public hasAttendee(user: User): boolean {
        return this.attendees.has(user);
    }

    public getAttendeesCount(): number {
        return this.attendees.size;
    }

}