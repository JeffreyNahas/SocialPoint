import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from '../model/UserAccount';
import { User } from "../model/User";

@Injectable()
export class UserAccountRepository {
    constructor(
        @InjectRepository(UserAccount)
        private repository: Repository<UserAccount>
    ) {}

    // Find a UserAccount by ID
    async findUserAccountById(id: number): Promise<UserAccount | null> {
        return await this.repository.findOne({ 
            where: { id },
            relations: ['user']
        });
    }

    // Find a UserAccount by email
    async findUserAccountByEmail(email: string): Promise<UserAccount | null> {
        return await this.repository.findOne({ 
            where: { email },
            relations: ['user']
        });
    }

    async findAllUserAccounts(): Promise<UserAccount[]> {
        return await this.repository.find();
    }

    async findUserAccountsByFullName(fullName: string): Promise<UserAccount[]> {
        return await this.repository.find({ 
            where: { fullName },
            relations: ['user']
        });
    }

    async findUserAccountsByPhoneNumber(phoneNumber: string): Promise<UserAccount[]> {
        return await this.repository.find({ where: { phoneNumber } });
    }

    async save(userAccount: UserAccount): Promise<UserAccount> {
        return await this.repository.save(userAccount);
    }
}
