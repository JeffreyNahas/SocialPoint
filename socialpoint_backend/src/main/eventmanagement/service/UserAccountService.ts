import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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


    async loginUserAccount(email: string, password: string): Promise<UserAccount> {
        const userAccount = await this.userAccountRepository.findUserAccountByEmail(email);
        
        if (!userAccount || !userAccount.verifyPassword(password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const sessionToken = userAccount.login(email, password);
        if (!sessionToken) {
            throw new UnauthorizedException('Login failed');
        }

        return await this.userAccountRepository.save(userAccount);
    }

    async logoutUserAccount(id: number): Promise<void> {
        const userAccount = await this.getUserAccountById(id);
        if (!userAccount) {
            throw new NotFoundException('User account not found');
        }

        userAccount.logout();
        await this.userAccountRepository.save(userAccount);
    }

    async verifySession(id: number, token: string): Promise<boolean> {
        const userAccount = await this.getUserAccountById(id);
        return userAccount?.isLoggedIn(token) || false;
    }

    async updateUserAccount(id: number, updatedData: Partial<UserAccount>): Promise<UserAccount> {
        const userAccount = await this.getUserAccountById(id);
        if (!userAccount) {
            throw new NotFoundException('User account not found');
        }
        Object.assign(userAccount, updatedData);
        return await this.userAccountRepository.save(userAccount);
    }

}