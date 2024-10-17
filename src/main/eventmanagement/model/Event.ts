import { User } from "./User";
import { Venue } from "./Venue";
import { Category } from "./Category";

// Handling Notifications triggered by the Event
import { Notification } from "./Notification";

export class Event {
    private name: string;
    private description: string;
    private venue: Venue;
    private date: Date;
    private startTime: Date;
    private endTime: Date;
    private category: Category;     
    private organizer: User;
    private attendees: Set<User>;

    private AttendeeNotifications: Notification[];
    private OrganizerNotifications: Notification[];

    
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
        this.AttendeeNotifications = [];
        this.OrganizerNotifications = [];
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

    public getNotifications(): Notification[] {
        return this.AttendeeNotifications;
    }

    public getOrganizerNotifications(): Notification[] {
        return this.OrganizerNotifications;
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

    public addAttendeeNotification(notification: Notification): void {
        this.AttendeeNotifications.push(notification);
    }

    public addOrganizerNotification(notification: Notification): void {
        this.OrganizerNotifications.push(notification);
    }

    public updateDate(newDate: Date): void {
        this.date = newDate;
        this.addAttendeeNotification(new Notification(`${this.name}Date updated to ${newDate.toISOString()}`, new Date()));
        this.addOrganizerNotification(new Notification(`$You have successfully updated the Date for ${this.name}}`, new Date()));
    }

    public updateStartTime(newStartTime: Date): void {
        this.startTime = newStartTime;
        this.addAttendeeNotification(new Notification(`${this.name} Start Time updated to ${newStartTime.toISOString()}`, new Date()));
        this.addOrganizerNotification(new Notification(`$You have successfully updated the Start Time for ${this.name}}`, new Date()));
    }

    public updateEndTime(newEndTime: Date): void {
        this.endTime = newEndTime;
        this.addAttendeeNotification(new Notification(`${this.name} End Time updated to ${newEndTime.toISOString()}`, new Date()));
        this.addOrganizerNotification(new Notification(`$You have successfully updated the End Time for ${this.name}}`, new Date()));
    }

    public updateVenue(newVenue: Venue): void {
        this.venue = newVenue;
        this.addAttendeeNotification(new Notification(`${this.name} Venue updated to ${newVenue.getName()}`, new Date()));
        this.addOrganizerNotification(new Notification(`$You have successfully updated the Venue for ${this.name}}`, new Date()));
    }

    public updateDescription(newDescription: string): void {
        this.description = newDescription;
        this.addOrganizerNotification(new Notification(`$You have successfully updated the Description for ${this.name}}`, new Date()));
    }

    public updateCategory(newCategory: Category): void {
        this.category = newCategory;
        this.addOrganizerNotification(new Notification(`$You have successfully updated the Category for ${this.name}}`, new Date()));
    }

    public updateName(newName: string): void {
        this.name = newName;
        this.addOrganizerNotification(new Notification(`$You have successfully updated the Name for ${this.name}}`, new Date()));
    }
    public addAttendee(user: User): void {
        this.attendees.add(user);
    }

    public removeAttendee(user: User): void {
        this.attendees.delete(user);
    }

    public hasAttendee(user: User): boolean {
        return this.attendees.has(user);
    }

    public getAttendeesCount(): number {
        return this.attendees.size;
    }

}