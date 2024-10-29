// Handling notifications sending to the user
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Event } from "./Event";
import { User } from "./User";


@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    message: string;

    @Column()
    timestamp: Date;

    @ManyToOne(() => Event, (event) => event.notifications, { onDelete: "CASCADE", eager: true })
    @JoinColumn()
    event: Event;

    @Column()
    notificationType: string; // Can be 'attendee' or 'organizer'


    constructor(message: string, timestamp: Date, event: Event, notificationType: string) {
        this.message = message;
        this.timestamp = timestamp;
        this.event = event;
        this.notificationType = notificationType;
    }

    public getMessage(): string {
        return this.message;
    }


    public getNotificationType(): string {
        return this.notificationType;
    }

    public getTimestamp(): Date {
        return this.timestamp;
    }

    public getEvent(): Event {
        return this.event;
    }

    public setMessage(message: string): void {
        this.message = message;
    }

    public setEvent(event: Event): void {
        this.event = event;
    }

    public setTimestamp(timestamp: Date): void {
        this.timestamp = timestamp;
    }
    public setNotificationType(notificationType: string): void {
        this.notificationType = notificationType;
    }

    public toString(): string {
        return `Notification(message: ${this.message}, timestamp: ${this.timestamp})`;
    }

    

}
