import { User } from "./User";
import { Event } from "./Event";
import { Rating } from "./ReviewRating";
import { Reply } from "./Reply";

export class Review {
    private event: Event;
    private user: User;
    private rating: Rating;
    private reviewDate: Date;
    private comment: string;
    private replies: Reply[];

    constructor(event: Event, user: User, rating: Rating, comment: string) {
        this.event = event;
        this.user = user;
        this.rating = rating;
        this.reviewDate = new Date();
        this.comment = comment;
        this.replies = [];
    }

    public getReplies(): Reply[] {
        return this.replies;
    }

    public addReply(reply: Reply): void {
        this.replies.push(reply);
    }

    public removeReply(reply: Reply): void {
        this.replies = this.replies.filter(r => r !== reply);
    }

    
    public getEvent(): Event {
        return this.event;
    }

    public getUser(): User {
        return this.user;
    }

    public getRating(): Rating {
        return this.rating;
    }

    public getReviewDate(): Date {
        return this.reviewDate;
    }

    public getComment(): string {
        return this.comment;
    }

    public setRating(rating: Rating): void {
        this.rating = rating;
    }

    public setComment(comment: string): void {
        this.comment = comment;
    }

    public setEvent(event: Event): void {
        this.event = event;
    }

    public setUser(user: User): void {
        this.user = user;
    }


    
}