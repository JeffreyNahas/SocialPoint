import { Controller, HttpException, HttpStatus, Post, Body } from "@nestjs/common";
import { ReviewService } from "../service/ReviewService";
import { ReviewResponseDto } from "../dto/ReviewDto";
import { CreateReviewRequestDto } from "../dto/ReviewDto";
import { Review } from '../model/Review';

@Controller('api/reviews')
export class ReviewController {
   constructor(private readonly reviewService: ReviewService) {}

   @Post()
   async createReview(@Body() createDto: CreateReviewRequestDto): Promise<ReviewResponseDto> {
       try {
           const review = await this.reviewService.createReview(
               createDto.userId,
               createDto.eventId,
               createDto.rating,
               createDto.comment,
               new Date()
           );
           return this.mapToResponseDto(review);
       } catch (error) {
           throw new HttpException('Failed to create review', HttpStatus.BAD_REQUEST);
       }
   }

   private mapToResponseDto(review: Review): ReviewResponseDto {
       const response = new ReviewResponseDto();
       response.id = review.id;
       
       const user = review.getUser();
       response.user = {
           id: user?.id || 0,
           fullName: user?.userAccount?.fullName || ''
       };
       
       const event = review.getEvent();
       response.event = {
           id: event?.id || 0,
           name: event?.name || ''
       };
       
       response.rating = review.getRating();
       response.comment = review.getComment();
       response.reviewDate = review.getReviewDate();
       return response;
   }
}