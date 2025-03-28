import { Injectable } from '@nestjs/common';
import { UserAccountRepository } from '../repository/UserAccountRepository';

@Injectable()
export class CurrentUserService {
  private currentUserId: number | null = null;

  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  // Set the current user ID based on email after login
  async setCurrentUserByEmail(email: string): Promise<void> {
    try {
      const userAccount = await this.userAccountRepository.findUserAccountByEmail(email);
      
      if (userAccount && userAccount.user) {
        this.currentUserId = userAccount.user.id;
        console.log(`Set current user ID to: ${this.currentUserId}`);
      }
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  // Get the current user ID
  getCurrentUserId(): number | null {
    return this.currentUserId;
  }

  // Clear the current user ID (for logout)
  clearCurrentUser(): void {
    this.currentUserId = null;
  }
} 