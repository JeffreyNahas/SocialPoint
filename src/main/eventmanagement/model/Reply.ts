import { User } from "./User";

export class Reply {
    private user: User;
    private comment: string;
    private replyDate: Date;

    constructor(user: User, comment: string) {
        this.user = user;
        this.comment = comment;
        this.replyDate = new Date();
    }

    public getUser(): User {
        return this.user;
    }

    public getComment(): string {
        return this.comment;
    }

    public getReplyDate(): Date {
        return this.replyDate;
    }

    public setComment(comment: string): void {
        this.comment = comment;
    }

    public setUser(user: User): void {
        this.user = user;
    }
    

}