import { AppDataSource } from "../../../data-source";
import { EntityRepository, In, Repository } from "typeorm";
import { User } from "../model/User";
import { UserAccount } from "../model/UserAccount";
import { Event } from "../model/Event";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ) {}

    async save(user: User): Promise<User> {
        return await this.repository.save(user);
    }

    async findById(id: number): Promise<User | null> {
        return await this.repository.findOne({ 
            where: { id },
            relations: ['userAccount']
        });
    }

    async findUserByUserAccountId(userAccountId: number): Promise<User | null> {
        return await this.repository.findOne({
            where: { userAccount: { id: userAccountId } },
            relations: ['userAccount', 'userEventRoles', 'friends', 'organizedEvents', 'reviews']
        });
    }

    async findUserById(id: number): Promise<User | null> {
        return await this.repository.findOne({
          where: { id },
          relations: [
            'userAccount', 
            'userEventRoles', 
            'friends', 
            'organizedEvents',
            'reviews'
          ]
        });
      }

    async findFriends(user: User): Promise<User[]> {
        return await this.repository.find({
            where: { id: In(Array.from(user.friends.values()).map(friend => friend.id)) },
            relations: ['userAccount', 'userEventRoles', 'friends', 'organizedEvents', 'reviews']
        });
    }

    async delete(id: number) {
        return await this.repository.delete(id);
    }
}
        
