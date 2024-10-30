import { AppDataSource } from "../../../data-source";
import { EntityRepository, In, Repository } from "typeorm";
import { User } from "../model/User";
import { UserAccount } from "../model/UserAccount";
import { Event } from "../model/Event";
@EntityRepository(User)

export class UserRepository extends Repository<User> {

    async createUser(userAccount: UserAccount): Promise<User> {
        const user = new User(userAccount);
        user.userAccount = userAccount;
        return await this.save(user);
    }

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

    async findAllUsers(): Promise<User[]> {
        return await this.find({ relations: ['userAccount', 'userEventRoles', 'attendedEvents', 'organizedEvents', 'friends', 'reviews'] });
    }

    async updateUser(id: number, updatedUserData: Partial<User>): Promise<User | null> {
        const user = await this.findOneBy({ id });
        if (!user) return null;
    
        Object.assign(user, updatedUserData);
        return await this.save(user);
    }

    async deleteUser(id: number): Promise<boolean> {
        const result = await this.delete(id);
        return result.affected !== 0;
      }

    
}
        
