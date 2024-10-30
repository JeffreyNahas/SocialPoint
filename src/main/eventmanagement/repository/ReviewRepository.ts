import { AppDataSource } from '../../../data-source'; // Replace with your actual data source path
import { Repository } from 'typeorm';
import { Review } from '../model/Review';
import { User } from '../model/User';
import { Event } from '../model/Event';
import { Rating } from '../model/ReviewRating';

export class ReviewRepository extends Repository<Review> {
  
  // Create a new review
  async createReview(event: Event, user: User, rating: Rating, comment: string): Promise<Review> {
    const review = new Review(event, user, rating, comment);
    return await this.save(review);
  }

  // Find a review by ID
  async findReviewById(id: number): Promise<Review | null> {
    return await this.findOne({
      where: { id },
      relations: ['user', 'event', 'replies'], // Load related user, event, and replies
    });
  }

  // Find all reviews
  async findAllReviews(): Promise<Review[]> {
    return await this.find({
      relations: ['user', 'event', 'replies'], // Load related entities
    });
  }

  // Update a review by ID
  async updateReview(id: number, updatedData: Partial<Review>): Promise<Review | null> {
    const review = await this.findOneBy({ id : id });
    if (!review) return null;

    Object.assign(review, updatedData);
    return await this.save(review);
  }

  // Delete a review by ID
  async deleteReview(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected !== 0;
  }

  // Custom method: Find reviews for a specific event
  async findReviewsByEvent(eventId: number): Promise<Review[]> {
    return await this.find({
      where: { event: { id: eventId } },
      relations: ['user', 'replies'], // Load user and replies for each review
    });
  }

  // Custom method: Find reviews by a specific user
  async findReviewsByUser(userId: number): Promise<Review[]> {
    return await this.find({
      where: { user: { id: userId } },
      relations: ['event', 'replies'], // Load event and replies for each review
    });
  }

  // Custom method: Find reviews with a specific rating
  async findReviewsByRating(rating: Rating): Promise<Review[]> {
    return await this.find({
      where: { rating },
      relations: ['user', 'event', 'replies'],
    });
  }

  async findReviewsByDate(date: Date): Promise<Review[]> {
    return await this.find({
      where: { reviewDate: date },
      relations: ['user', 'event', 'replies'],
    }); 
  }
}

// Export an instance of the ReviewRepository
//export const reviewRepository = AppDataSource.getRepository(Review).extend(ReviewRepository.prototype);