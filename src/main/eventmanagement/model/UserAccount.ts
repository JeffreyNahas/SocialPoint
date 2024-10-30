import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { v4 as uuidv4 } from 'uuid';  // Import uuid for generating session tokens

@Entity()
export class UserAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  private password: string;

  @Column({ nullable: true })
  private sessionToken?: string;  // Column to store session token

  @CreateDateColumn()
  private createdAt!: Date;

  @UpdateDateColumn()
  private updatedAt!: Date;

  @OneToOne(() => User, (user) => user.userAccount)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user!: User;

  constructor(name: string, email: string, phoneNumber: string, password: string) {
    this.fullName = name;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
  }

  public getFullName(): string {
    return this.fullName;
  }
  
  public getEmail(): string {
    return this.email;
  }   

  public getPhoneNumber(): string {
    return this.phoneNumber;
  }

  public getPassword(): string {
    return this.password;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }   

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public setFullName(fullName: string): void {
    this.fullName = fullName;
    this.updatedAt = new Date();
  }

  public setEmail(email: string): void {
    this.email = email;
    this.updatedAt = new Date();
  }                                                       

  public setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
    this.updatedAt = new Date();
  }

  public setPassword(password: string): void {
    this.password = password;
    this.updatedAt = new Date();
  }
  
  public verifyPassword(password: string): boolean {
    return this.password === password;
  }

  // Login method with session token generation
  public login(email: string, password: string): string | null {
    if (this.email === email && this.verifyPassword(password)) {
      this.sessionToken = uuidv4(); // Generate a unique session token
      this.updatedAt = new Date(); // Update timestamp for login action
      return this.sessionToken; // Return session token for user to use in future requests
    }
    return null; // Return null if login fails
  }

  // Logout method to clear session token
  public logout(): void {
    this.sessionToken = undefined; // Clear the session token
    this.updatedAt = new Date(); // Update timestamp for logout action
  }

  // Method to check if a user is logged in by verifying session token
  public isLoggedIn(token: string): boolean {
    return this.sessionToken === token;
  }
}