import { DataSource } from 'typeorm';
import { User } from './main/eventmanagement/model/User';
import { Event } from './main/eventmanagement/model/Event';
import { Venue } from './main/eventmanagement/model/Venue';
// Add other entities as needed

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Set to false in production
  logging: true,
  entities: [User, Event, Venue], // Add all your models here
});