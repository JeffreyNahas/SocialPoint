import { Controller, HttpException, HttpStatus, Post, Body, Get, Param } from "@nestjs/common";
import { ReviewService } from "../service/ReviewService";
import { ReplyRequestDto, ReviewResponseDto } from "../dto/ReviewDto";
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
               new Date(),
               createDto.parentReviewId
           );
           return this.mapToResponseDto(review);
       } catch (error: unknown) {
           if (error instanceof Error) {
               throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
           }
           throw new HttpException('Failed to create review', HttpStatus.BAD_REQUEST);
       }
   }

   @Get(':id')
   async getReview(@Param('id') id: number): Promise<ReviewResponseDto> {
       const review = await this.reviewService.getReviewById(id);
       if (!review) {
           throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
       }
       return this.mapToResponseDto(review);
   }

   @Post(':id/replies')
   async addReply(@Param('id') id: number, @Body() replyDto: ReplyRequestDto): Promise<ReviewResponseDto> {
       const review = await this.reviewService.addReplyToReview(id, replyDto);
       return this.mapToResponseDto(review);
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
       
       response.replies = review.getReplies().map(reply => ({
           id: reply.id,
           comment: reply.getComment(),
           rating: reply.getRating(),
           userId: reply.getUser()?.id || 0
       }));
       
       return response;
   }
}