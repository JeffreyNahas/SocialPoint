import { AppDataSource } from '../../../data-source'; // Replace with your actual data source path
import { Repository } from 'typeorm';
import { Review } from '../model/Review';
import { User } from '../model/User';
import { Event } from '../model/Event';
import { Rating } from '../model/ReviewRating';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private repository: Repository<Review>
  ) {}

  async save(review: Review): Promise<Review> {
    return await this.repository.save(review);
  }

  async remove(reviews: Review[]): Promise<Review[]>;
  async remove(review: Review): Promise<Review>;
  async remove(reviewOrReviews: Review | Review[]): Promise<Review | Review[]> {
    if (Array.isArray(reviewOrReviews)) {
      return await this.repository.remove(reviewOrReviews);
    }
    return await this.repository.remove(reviewOrReviews);
  }

  // Create a new review

  // Find a review by ID
  async findReviewById(id: number): Promise<Review | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user', 'event', 'replies'],
    });
  }

  // Find all reviews
  async findAllReviews(): Promise<Review[]> {
    return await this.repository.find({
      relations: ['user', 'event', 'replies'],
    });
  }

  // Custom method: Find reviews for a specific event
  async findReviewsByEvent(eventId: number): Promise<Review[]> {
    return await this.repository.find({
      where: { event: { id: eventId } },
      relations: ['user', 'replies'], // Load user and replies for each review
    });
  }

  // Custom method: Find reviews by a specific user
  async findReviewsByUser(userId: number): Promise<Review[]> {
    return await this.repository.find({
      where: { user: { id: userId } },
      relations: ['event', 'replies'], // Load event and replies for each review
    });
  }

  // Custom method: Find reviews with a specific rating
  async findReviewsByRating(rating: Rating): Promise<Review[]> {
    return await this.repository.find({
      where: { rating },
      relations: ['user', 'event', 'replies'],
    });
  }

  async findReviewsByDate(date: Date): Promise<Review[]> {
    return await this.repository.find({
      where: { reviewDate: date },
      relations: ['user', 'event', 'replies'],
    }); 
  }
}

// Export an instance of the ReviewRepository
//export const reviewRepository = AppDataSource.getRepository(Review).extend(ReviewRepository.prototype);