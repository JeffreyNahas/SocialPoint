import { Controller, HttpException, HttpStatus, Post, Body } from "@nestjs/common";
import { ReviewService } from "../service/ReviewService";
import { ReviewResponseDto } from "../dto/ReviewDto";
import { CreateReviewRequestDto } from "../dto/ReviewDto";

@Controller('user-accounts')
export class ReviewController {
   constructor(private readonly reviewService: ReviewService) {}

   @Post()
   async createReview(@Body() createDto: CreateReviewRequestDto): Promise<ReviewResponseDto> {
       try {
           const review = await this.reviewService.createReview(createDto.userId, createDto.eventId, createDto.rating, createDto.comment);
           return this.mapToResponseDto(review);
       } catch (error) {
           throw new HttpException('Failed to create review', HttpStatus.BAD_REQUEST);
       }
   }
}