import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { Review } from "./Review";
import { User } from "./User";

@Entity()
export class Reply {
    @PrimaryGeneratedColumn()
    private id!: number;

    @ManyToOne(() => User, (user) => user.getReviews())
    private user: User;

    @Column()
    private comment: string;

    @Column({type: "timestamp"})
    private replyDate: Date;

    @ManyToOne(() => Review, (review) => review.getReplies())
    private review: Review;

    constructor(user: User, comment: string, review: Review) {
        this.user = user;
        this.comment = comment;
        this.replyDate = new Date();
        this.review = review;
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

    public getReview(): Review {
        return this.review;
    }
    

}