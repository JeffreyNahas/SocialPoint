import { DataSource } from 'typeorm';
import { UserAccount } from './main/eventmanagement/model/UserAccount';
import { User } from './main/eventmanagement/model/User';
import { Event } from './main/eventmanagement/model/Event';
import { Review } from './main/eventmanagement/model/Review'; 
import { Notification } from './main/eventmanagement/model/Notification';
import { UserEventRole } from './main/eventmanagement/model/UserEventRole';
import { Category } from './main/eventmanagement/model/Category';
// Add other entities as needed

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'mcgill1204',
  database: process.env.DB_NAME || 'event_management',
  synchronize: true, // Set to false in production
  logging: true,
  entities: [User, UserAccount, Event, Review, Notification, UserEventRole], // Add all your models here
  migrations: [],
  subscribers: [],
  // Add these additional options
  extra: {
    max: 100
  }
});
