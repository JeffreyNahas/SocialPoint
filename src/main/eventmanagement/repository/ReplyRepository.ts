import { Repository } from "typeorm";
import {Reply} from "../model/Reply";
import {Review} from "../model/Review";
import {User} from "../model/User";

export class ReplyRepository extends Repository<Reply>{
    async createReply(review: Review, user: User, comment: string): Promise<Reply> {
        const reply = new Reply(user, comment, review);
        return await this.save(reply);
    }

    async findReplyById(id: number): Promise<Reply | null> {
        return await this.findOne({where: {id}, relations: ['review', 'user']});
    }

    async findAllReplies(): Promise<Reply[]> {
        return await this.find({relations: ['review', 'user']});
    }

    async updateReply(id: number, updatedData: Partial<Reply>): Promise<Reply | null> {
        const reply = await this.findOneBy({id:id});
        if (!reply) return null;
        Object.assign(reply, updatedData);
        return await this.save(reply);
    }

    async deleteReply(id: number): Promise<boolean> {
        const result = await this.delete(id);
        return result.affected !== 0;
    }

    async findRepliesByReview(reviewId: number): Promise<Reply[]> {
        return await this.find({where: {review: {id: reviewId}}});
    }
}