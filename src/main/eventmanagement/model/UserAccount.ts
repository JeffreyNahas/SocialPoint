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
  
    @CreateDateColumn()
    private createdAt!: Date;
  
    @UpdateDateColumn()
    private updatedAt!: Date;
  
    @OneToOne(() => User, (user) => user.userAccount)
    @JoinColumn({name: 'user_id', referencedColumnName: 'user_id'})
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
  
    public login(email: string, password: string): boolean {
      return this.email === email && this.password === password;
    }
  
    public logout(): void { 
      // Logout logic here
    }
  }