import { User } from "./User";
import { Venue } from "./Venue";
import { Category } from "./Category";

export class Event {
    private name: string;
    private description: string;
    private venue: Venue;
    private date: Date;
    private category: Category;     
    private organizer: User;
    private attendees: Set<User>;

    constructor(name: string, description: string, venue: Venue, date: Date, category: Category, organizer: User) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.venue = venue;
        this.date = date;
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

    public getDate(): Date {
        return this.date;
    }

    public getOrganizer(): User {
        return this.organizer;
    }
    public getAttendees(): Set<User> {
        return this.attendees;
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

    public setDate(date: Date): void {
        this.date = date;
    }

    public setOrganizer(organizer: User): void {
        this.organizer = organizer;
    }

    public updateDate(newDate: Date): void {
        this.date = newDate;
    }   

    public updateVenue(newVenue: Venue): void {
        this.venue = newVenue;
    }

    public updateDescription(newDescription: string): void {
        this.description = newDescription;
    }

    public updateCategory(newCategory: Category): void {
        this.category = newCategory;
    }

    public updateName(newName: string): void {
        this.name = newName;
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