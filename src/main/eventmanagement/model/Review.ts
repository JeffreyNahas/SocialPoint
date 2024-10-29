import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";
import { Event } from "./Event";
import { Rating } from "./ReviewRating";
import { Reply } from "./Reply";
import { Notification } from "./Notification";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    private id!: number;

    @ManyToOne(() => Event, (event) => event.reviews)
    event: Event;

    @ManyToOne(() => User, (user) => user.reviews)
    user: User;

    @Column()
    rating: Rating;

    @Column({type: "timestamp"})
    reviewDate: Date;

    @Column()
    comment: string;

    @OneToMany(() => Reply, (reply) => reply.review)
    replies: Reply[];


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
        this.event.addNotification(new Notification(`${reply.getUser().getUserAccount().getFullName()} replied to your review`, new Date(), this.event, "attendee"));
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