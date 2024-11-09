import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { User } from "./User";
import { Event } from "./Event";
import { Rating } from "./ReviewRating";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Event, (event) => event.reviews)
    event: Event;

    @OneToOne(() => User)
    user: User;

    @Column()
    rating: Rating;

    @Column()
    reviewDate: Date;

    @Column()
    comment: string;

    @OneToMany(() => Review, (review) => review.replies)
    replies: Review[] = [];



    constructor(event: Event, user: User, rating: Rating, comment: string) {
        this.event = event;
        this.user = user;
        this.rating = rating;
        this.reviewDate = new Date();
        this.comment = comment;
    }

    public addReply(reply: Review): void {
        this.replies.push(reply);
    }

    public addReview(review: Review): void {
        this.event.addReview(review);
    }

    public getReplies(): Review[] {
        return this.replies;
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