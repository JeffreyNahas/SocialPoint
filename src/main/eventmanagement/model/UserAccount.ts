export class UserAccount {
    private fullName: string;
    private email: string;
    private phoneNumber: string;
    private password: string;
    private createdAt: Date;
    private updatedAt: Date;

    constructor(id: number, name: string, email: string, phoneNumber: string, password: string) {
        this.fullName = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.createdAt = new Date();
        this.updatedAt = new Date();
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
    

    public updateFullName(newFullName: string): void {
        this.fullName = newFullName;
        this.updatedAt = new Date();
    }

    public updateEmail(newEmail: string): void {
        this.email = newEmail;
        this.updatedAt = new Date();
    }
    public updatePhoneNumber(newPhoneNumber: string): void {
        this.phoneNumber = newPhoneNumber;
        this.updatedAt = new Date();
    }

    public updatePassword(newPassword: string): void {
        this.password = newPassword;
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
