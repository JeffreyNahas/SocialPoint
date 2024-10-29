import { OneToMany, PrimaryGeneratedColumn, Column } from "typeorm";
import { Event } from "./Event";

export class Venue {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    private name: string;

    @Column()
    private location: string;

    @Column()
    private capacity: number;

    @OneToMany(() => Event, (event) => event.getVenue())
    events!: Event[];

    constructor(name: string, location: string, capacity: number) {
        this.name = name;
        this.location = location;
        this.capacity = capacity;
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