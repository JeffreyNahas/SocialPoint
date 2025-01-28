// import { IsString, IsDate, IsEnum, IsNumber, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
// import { Rating } from '../model/ReviewRating';

// export class CreateReviewRequestDto {
//  @IsNumber()
//  @IsNotEmpty()
//  eventId!: number;

//  @IsNumber()
//  @IsNotEmpty()
//  userId!: number;

//  @IsEnum(Rating)
//  @IsNotEmpty()
//  rating!: Rating;

//  @IsString()
//  @IsNotEmpty()
//  comment!: string;
// }

// export class UpdateReviewRequestDto {
//  @IsEnum(Rating)
//  @IsOptional()
//  rating?: Rating;

//  @IsString()
//  @IsOptional()
//  comment?: string;
// }

// export class ReviewResponseDto {
//  @IsNumber()
//  id!: number;

//  @IsNotEmpty()
//  event!: {
//    id: number;
//    name: string;
//  };

//  @IsNotEmpty()
//  user!: {
//    id: number;
//    fullName: string;
//  };

//  @IsEnum(Rating)
//  rating!: Rating;

//  @IsDate()
//  reviewDate!: Date;

//  @IsString()
//  comment!: string;

//  @IsArray()
//  replies!: {
//    id: number;
//    comment: string;
//    rating: Rating;
//    userId: number;
//  }[];
// }

// export class ReplyRequestDto {
//  @IsNumber()
//  @IsNotEmpty()
//  reviewId!: number;

//  @IsEnum(Rating)
//  @IsNotEmpty()
//  rating!: Rating;

//  @IsString()
//  @IsNotEmpty()
//  comment!: string;
// }