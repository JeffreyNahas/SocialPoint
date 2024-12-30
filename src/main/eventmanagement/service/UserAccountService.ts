import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserAccountRepository } from "../repository/UserAccountRepository";
import { UserAccount } from "../model/UserAccount";

@Injectable()
export class UserAccountService {
    constructor(
        @InjectRepository(UserAccountRepository)
        private readonly userAccountRepository: UserAccountRepository,
    ) {}

    async createUserAccount(name: string, email: string, phoneNumber: string, password: string): Promise<UserAccount> {
        const userAccount = new UserAccount(name, email, phoneNumber, password);
        return await this.userAccountRepository.save(userAccount);
    }

    async getUserAccountById(id: number): Promise<UserAccount | null> {
        return await this.userAccountRepository.findUserAccountById(id);
    }

}