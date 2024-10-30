import { AppDataSource } from "../../../data-source"; // Replace with your data source path
import { Repository } from 'typeorm';
import { UserAccount } from '../model/UserAccount';

export class UserAccountRepository extends Repository<UserAccount> {
  
  // Create a new UserAccount
  async createUserAccount(fullName: string, email: string, phoneNumber: string, password: string): Promise<UserAccount> {
    const userAccount = new UserAccount(fullName, email, phoneNumber, password);
    return await this.save(userAccount);
  }

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

  // Update a UserAccount by ID
  async updateUserAccount(id: number, updatedData: Partial<UserAccount>): Promise<UserAccount | null> {
    const userAccount = await this.findOneBy({ id });
    if (!userAccount) return null;

    Object.assign(userAccount, updatedData);
    return await this.save(userAccount);
  }

  // Delete a UserAccount by ID
  async deleteUserAccount(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected !== 0;
  }

  // Custom method: Verify user credentials
  async verifyUserCredentials(email: string, password: string): Promise<UserAccount | null> {
    const userAccount = await this.findUserAccountByEmail(email);
    if (userAccount && userAccount.verifyPassword(password)) {
      return userAccount;
    }
    return null;
  }
}
