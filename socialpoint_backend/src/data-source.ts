import { DataSource } from 'typeorm';
import { UserAccount } from './main/eventmanagement/model/UserAccount';
import { User } from './main/eventmanagement/model/User';
import { Event } from './main/eventmanagement/model/Event';
import { Venue } from './main/eventmanagement/model/Venue';
import { Review } from './main/eventmanagement/model/Review'; 
import { Notification } from './main/eventmanagement/model/Notification';
import { UserEventRole } from './main/eventmanagement/model/UserEventRole';
// Add other entities as needed

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mcgill1204',
  database: 'event_management',
  synchronize: true, // Set to false in production
  logging: true,
  entities: [User, UserAccount, Event, Venue, Review, Notification, UserEventRole], // Add all your models here
});
