import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Event } from './Event';

@Entity()
export class Venue {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    capacity!: number;

    @Column()
    location!: string;

    @OneToMany(() => Event, event => event.venue)
    events!: Set<Event>;

    constructor(name: string, location: string, capacity: number) {
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.events = new Set<Event>();
    }
    
    public getName(): string {
        return this.name;
    }

    public getLocation(): string {
        return this.location;
    }

    public getCapacity(): number {
        return this.capacity;
    }

    public setCapacity(capacity: number): void {
        this.capacity = capacity;
    }

    public setLocation(location: string): void {
        this.location = location;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public updateCapacity(newCapacity: number): void {
        this.capacity = newCapacity;
    }

    public updateLocation(newLocation: string): void {
        this.location = newLocation;
    }

    public updateName(newName: string): void {
        this.name = newName;
    }

    public toString(): string {
        return `Venue(name=${this.name}, location=${this.location}, capacity=${this.capacity})`;
    }
}