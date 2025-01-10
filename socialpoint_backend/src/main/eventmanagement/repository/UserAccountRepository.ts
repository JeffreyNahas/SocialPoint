import { AppDataSource } from "../../../data-source"; // Replace with your data source path
import { Repository } from 'typeorm';
import { UserAccount } from '../model/UserAccount';
import { Injectable } from "@nestjs/common";
import { User } from "../model/User";

@Injectable()
export class UserAccountRepository extends Repository<UserAccount> {

  // Find a UserAccount by ID
  async findUserAccountById(id: number): Promise<UserAccount | null> {
    return await this.findOne({
      where: { id },
      relations: ['user'], // Load the related user
    });
  }

  // Find a UserAccount by email
  async findUserAccountByEmail(email: string): Promise<UserAccount | null> {
    return await this.findOne({
      where: { email },
      relations: ['user'],
    });
  }

  async findAllUserAccounts(): Promise<UserAccount[]> {
    return await this.find();
  }

  async findUserAccountsByFullName(fullName: string): Promise<UserAccount[]> {
    return await this.find({ where: { fullName } });
  }

  async findUserAccountsByPhoneNumber(phoneNumber: string): Promise<UserAccount[]> {
    return await this.find({ where: { phoneNumber } });
  }

}
