import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from './main/eventmanagement/controller/TestController';
import { UserController } from './main/eventmanagement/controller/UserController';
import { UserAccountController } from './main/eventmanagement/controller/UserAccountController';
import { UserService } from './main/eventmanagement/service/UserService';
import { UserAccountService } from './main/eventmanagement/service/UserAccountService';
import { UserRepository } from './main/eventmanagement/repository/UserRepository';
import { UserAccountRepository } from './main/eventmanagement/repository/UserAccountRepository';
import { User } from './main/eventmanagement/model/User';
import { UserAccount } from './main/eventmanagement/model/UserAccount';
import { Event } from './main/eventmanagement/model/Event';
import { Venue } from './main/eventmanagement/model/Venue';
import { Review } from './main/eventmanagement/model/Review';
import { Notification } from './main/eventmanagement/model/Notification';
import { UserEventRole } from './main/eventmanagement/model/UserEventRole';
import { AppDataSource } from './data-source';
import { DataSource } from 'typeorm';
import { EventRepository } from './main/eventmanagement/repository/EventRepository';

@Module({
    imports: [
        TypeOrmModule.forRoot(AppDataSource.options),
        TypeOrmModule.forFeature([
            User, 
            UserAccount, 
            Event, 
            Venue, 
            Review, 
            Notification, 
            UserEventRole,
            UserRepository,     // Add repositories here
            EventRepository,    // Add EventRepository
            UserAccountRepository
        ])
    ],
    controllers: [
        TestController, 
        UserController, 
        UserAccountController
    ],
    providers: [
        UserService,
        UserAccountService,
        UserRepository,
        EventRepository,       // Add EventRepository here too
        UserAccountRepository
    ]
})
export class AppModule {}