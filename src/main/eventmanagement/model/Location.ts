import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Venue } from './Venue';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column({ nullable: true })
  country?: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @OneToMany(() => Venue, (venue) => venue.location)
  venues!: Venue[];

  constructor(address: string, city: string, state: string, postalCode: string, country?: string, latitude?: number, longitude?: number) {
    this.address = address;
    this.city = city;
    this.state = state;
    this.postalCode = postalCode;
    this.country = country;
    this.latitude = latitude;
    this.longitude = longitude;
  }
  public getCountry(): string | undefined {
    return this.country;
  }

  public getLatitude(): number | undefined {
    return this.latitude;
  }

  public getLongitude(): number | undefined {
    return this.longitude;
  }

  public getAddress(): string {
    return this.address;
  }

  public getCity(): string {
    return this.city;
  }

  public getState(): string {
    return this.state;
  }

  public getPostalCode(): string {
    return this.postalCode;
  }

  public setAddress(address: string): void {
    this.address = address;
  }

  public setCity(city: string): void {
    this.city = city;
  }

  public setState(state: string): void {
    this.state = state;
  }

  public setPostalCode(postalCode: string): void {
    this.postalCode = postalCode;
  }

  public setCountry(country: string): void {
    this.country = country;
  }

  public setLatitude(latitude: number): void {
    this.latitude = latitude;
  }

  public setLongitude(longitude: number): void {
    this.longitude = longitude;
  } 

  public getFullAddress(): string {
    return `${this.address}, ${this.city}, ${this.state}, ${this.postalCode}, ${this.country}`;
  }
}