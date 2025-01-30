import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewRepository } from "../repository/ReviewRepository";
import { Review } from "../model/Review";
import { Rating } from "../model/ReviewRating";
import { User } from "../model/User";
import { Event } from "../model/Event";
import { UserRepository } from "../repository/UserRepository";
import { EventRepository } from "../repository/EventRepository";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(ReviewRepository)
        private readonly reviewRepository: ReviewRepository,
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository
    ) {}

    // createReview in repository
    async createReview(userId: number, eventId: number, rating: Rating, comment: string, reviewDate: Date): Promise<Review> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const event = await this.eventRepository.findOne({ where: { id: eventId } });
        
        if (!user || !event) {
            throw new Error('User or Event not found');
        }

        const review = new Review(user, event, rating, comment, reviewDate);
        return await this.reviewRepository.save(review);
    }

    async addReplyToReview(reviewId: number, reply: Review): Promise<Review> {
        const review = await this.reviewRepository.findReviewById(reviewId);
        if (!review) {
            throw new Error(`Review with ID ${reviewId} not found`);
        }
        review.addReply(reply);
        return await this.reviewRepository.save(review);
    }

    async deleteReplyFromReview(reviewId: number, replyId: number): Promise<Review> {
        const review = await this.reviewRepository.findReviewById(reviewId);
        if (!review) {
            throw new Error(`Review with ID ${reviewId} not found`);
        }
        review.deleteReply(replyId);
        return await this.reviewRepository.save(review);
    }

    // updateReview in repository
    async updateReview(id: number, updatedReviewData: Partial<Review>): Promise<Review | null> {
        const review = await this.reviewRepository.findReviewById(id);
        if (!review) {
            throw new Error(`Review with ID ${id} not found`);
        }
        Object.assign(review, updatedReviewData);
        return await this.reviewRepository.save(review);
    }


    async deleteReview(id: number): Promise<boolean> {
        const review = await this.reviewRepository.findReviewById(id);
        
        if (!review) {
            throw new Error(`Review with ID ${id} not found`);
        }
    
        try {
            const event = review.getEvent();
            if (event) {
                event.removeReview(review.id);
            }
            
            if (review.getReplies()?.length > 0) {
                await this.reviewRepository.remove(review.getReplies());
            }
    
            await this.reviewRepository.remove(review);
            return true;
        } catch (error) {
            throw new Error(`Failed to delete review: ${error}`);
        }
    }

    async getReviewsByUser(userId: number): Promise<Review[]> {
        return await this.reviewRepository.findReviewsByUser(userId);
    }

    async getReviewsByRating(rating: Rating): Promise<Review[]> {
        return await this.reviewRepository.findReviewsByRating(rating);
    }

    async getReviewsByDate(date: Date): Promise<Review[]> {
        return await this.reviewRepository.findReviewsByDate(date);
    }


}