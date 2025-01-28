import { Injectable, NotFoundException, UnauthorizedException, HttpException, HttpStatus } from "@nestjs/common";
import { UserAccountRepository } from "../repository/UserAccountRepository";
import { UserAccount } from "../model/UserAccount";

@Injectable()
export class UserAccountService {
    constructor(
        private readonly userAccountRepository: UserAccountRepository
    ) {}

    async createUserAccount(name: string, email: string, phoneNumber: string, password: string): Promise<UserAccount> {
        // Check if email already exists
        const existingAccount = await this.userAccountRepository.findUserAccountByEmail(email);
        if (existingAccount) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }

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