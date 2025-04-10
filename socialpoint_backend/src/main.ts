import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';

async function bootstrap() {
  // Initialize database connection
  console.log('Initializing database connection...');
  try {
    await AppDataSource.initialize();
    console.log('Database connection initialized successfully');
  } catch (error) {
    console.error('Error initializing database connection:', error);
    throw error;
  }

  const app = await NestFactory.create(AppModule);
  
  console.log('Setting up CORS...');
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap().catch(err => {
  console.error('Failed to start server:', err);
}); 