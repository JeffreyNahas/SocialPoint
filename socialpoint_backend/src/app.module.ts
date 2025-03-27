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
import { Review } from './main/eventmanagement/model/Review';
import { Notification } from './main/eventmanagement/model/Notification';
import { UserEventRole } from './main/eventmanagement/model/UserEventRole';
import { AppDataSource } from './data-source';
import { DataSource } from 'typeorm';
import { EventRepository } from './main/eventmanagement/repository/EventRepository';
import { EventController } from './main/eventmanagement/controller/EventController';
import { EventService } from './main/eventmanagement/service/EventService';
import { ReviewRepository } from './main/eventmanagement/repository/ReviewRepository';
import { ReviewService } from './main/eventmanagement/service/ReviewService';
import { UserEventRoleRepository } from './main/eventmanagement/repository/UserEventRoleRepository';
import { NotificationsRepository } from './main/eventmanagement/repository/NotificationRepository';
import { ReviewController } from './main/eventmanagement/controller/ReviewController';
@Module({
    imports: [
        TypeOrmModule.forRoot(AppDataSource.options),
        TypeOrmModule.forFeature([
            User, 
            UserAccount, 
            Event, 
            Review, 
            Notification, 
            UserEventRole,
        ])
    ],
    controllers: [
        TestController, 
        UserController, 
        UserAccountController,
        EventController,
        ReviewController
    ],
    providers: [
        UserService,
        UserAccountService,
        UserRepository,
        EventRepository,
        EventService,
        ReviewService,
        ReviewRepository,
        NotificationsRepository,
        UserEventRoleRepository,
        UserAccountRepository
    ]
})
export class AppModule {}