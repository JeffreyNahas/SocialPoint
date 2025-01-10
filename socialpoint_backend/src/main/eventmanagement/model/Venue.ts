import { OneToMany, PrimaryGeneratedColumn, Column, Entity , OneToOne} from "typeorm";
import { Event } from "./Event";
import { Location } from "./Location";

@Entity()
export class Venue {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string;

    @OneToOne(() => Location, (location) => location.venues)
    location!: Location;

    @Column()
    capacity: number;

    @OneToMany(() => Event, (event) => event.venue)
    eventsHosted!: Set<Event>;


    constructor(name: string, location: Location, capacity: number) {
        this.name = name;
        this.location = location;
        this.capacity = capacity;
    }

    public getName(): string {
        return this.name;
    }

    public getLocation(): Location {
        return this.location;
    }

    public getCapacity(): number {
        return this.capacity;
    }

    public setCapacity(capacity: number): void {
        this.capacity = capacity;
    }

    public setLocation(location: Location): void {
        this.location = location;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public updateCapacity(newCapacity: number): void {
        this.capacity = newCapacity;
    }

    public updateLocation(newLocation: Location): void {
        this.location = newLocation;
    }

    public updateName(newName: string): void {
        this.name = newName;
    }

    public toString(): string {
        return `Venue(name=${this.name}, location=${this.location}, capacity=${this.capacity})`;
    }
}