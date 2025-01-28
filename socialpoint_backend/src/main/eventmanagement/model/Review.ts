import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { User } from "./User";
import { Event } from "./Event";
import { Rating } from "./ReviewRating";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Event, (event) => event.reviews)
    event!: Event;

    @OneToOne(() => User)
    user!: User;

    @Column()
    rating!: Rating;

    @Column()
    reviewDate!: Date;

    @Column()
    comment!: string;

    @OneToMany(() => Review, review => review.parentReview)
    replies!: Review[];

    @ManyToOne(() => Review, review => review.replies)
    parentReview?: Review;

    constructor(user: User, event: Event, rating: Rating, comment: string, reviewDate: Date) {
        this.user = user;
        this.event = event;
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
    }

    public addReply(reply: Review): void {
        if (!this.replies) {
            this.replies = [];
        }
        this.replies.push(reply);
    }

    public deleteReply(replyId: number): void {
        this.replies = this.replies.filter(reply => reply.id !== replyId);
    }

    public getReplies(): Review[] {
        return this.replies;
    }

    
    public getEvent(): Event | null {
        return this.event;
    }

    public getUser(): User | null {
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

    public setReviewDate(reviewDate: Date): void {
        this.reviewDate = reviewDate;
    }

    public setReplies(replies: Review[]): void {
        this.replies = replies;
    }

    public setUser(user: User): void {
        this.user = user;
    }


    
}