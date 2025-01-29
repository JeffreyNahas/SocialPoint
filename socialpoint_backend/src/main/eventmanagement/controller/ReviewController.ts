// import { Controller, HttpException, HttpStatus, Post, Body } from "@nestjs/common";
// import { ReviewService } from "../service/ReviewService";
// import { ReviewResponseDto } from "../dto/ReviewDto";
// import { CreateReviewRequestDto } from "../dto/ReviewDto";
// import { Review } from '../model/Review';

// @Controller('api/reviews')
// export class ReviewController {
//    constructor(private readonly reviewService: ReviewService) {}

//    @Post()
//    async createReview(@Body() createDto: CreateReviewRequestDto): Promise<ReviewResponseDto> {
//        try {
//            const review = await this.reviewService.createReview(
//                createDto.userId,
//                createDto.eventId,
//                createDto.rating,
//                createDto.comment,
//                new Date()
//            );
//            return this.mapToResponseDto(review);
//        } catch (error) {
//            throw new HttpException('Failed to create review', HttpStatus.BAD_REQUEST);
//        }
//    }

//    private mapToResponseDto(review: Review): ReviewResponseDto {
//        const response = new ReviewResponseDto();
//        response.id = review.id;
//        response.user = review.getUser();
//        response.event = review.getEvent();
//        response.rating = review.getRating();
//        response.comment = review.getComment();
//        response.reviewDate = review.getReviewDate();
//        return response;
//    }
// }