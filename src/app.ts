import 'dotenv/config'; // Load environment variables from .env file
import express, { Request, Response } from 'express';
import { AppDataSource } from './data-source'; // Import your TypeORM data source
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Database Connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Event Management API!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});