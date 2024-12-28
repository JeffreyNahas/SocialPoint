import { AppDataSource } from "../../../data-source";
import { EntityRepository, In, Repository } from "typeorm";
import { User } from "../model/User";
import { UserAccount } from "../model/UserAccount";
import { Event } from "../model/Event";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository extends Repository<User> {


    async findUserById(id: number): Promise<User | null> {
        return await this.findOne({
          where: { userAccount: { id: id } },
          relations: ['userAccount', 'userEventRoles', 'attendedEvents', 'organizedEvents', 'friends', 'reviews']
        });
      }

    async findFriends(user: User): Promise<User[]> {
        return await this.find({
            where: { id: In(Array.from(user.friends.values()).map(friend => friend.id)) },
            relations: ['userAccount', 'userEventRoles', 'attendedEvents', 'organizedEvents', 'friends', 'reviews']
        });

    } 
 
}
        
