import { DataSource } from 'typeorm';
import { UserAccount } from './main/eventmanagement/model/UserAccount';
import { User } from './main/eventmanagement/model/User';
import { Event } from './main/eventmanagement/model/Event';
import { Review } from './main/eventmanagement/model/Review'; 
import { Notification } from './main/eventmanagement/model/Notification';
import { UserEventRole } from './main/eventmanagement/model/UserEventRole';
import { Category } from './main/eventmanagement/model/Category';
// Add other entities as needed

// Log environment variables for debugging
console.log('Database connection details:');
console.log('Using DATABASE_URL:', process.env.DATABASE_URL ? 'Yes' : 'No');

// Parse the DATABASE_URL if available
let dbConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
  username: process.env.DB_USERNAME || process.env.PGUSER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'mcgill1204',
  database: process.env.DB_NAME || process.env.PGDATABASE || 'event_management',
};

// If DATABASE_URL is available, use it instead
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
      type: 'postgres' as const,
      host: url.hostname,
      port: parseInt(url.port),
      username: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading slash
    };
    console.log('Using connection string configuration');
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
  }
}

export const AppDataSource = new DataSource({
  ...dbConfig,
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
