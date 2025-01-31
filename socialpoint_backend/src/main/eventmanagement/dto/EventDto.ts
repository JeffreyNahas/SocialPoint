import { IsString, IsDate, IsNumber, IsEnum, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Category } from '../model/Category';

// dto/request/create-event.request.dto.ts
export class CreateEventRequestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  venueAddress!: string;

  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category!: Category;

  @IsNumber()
  @IsNotEmpty()
  organizerId!: number;
}

// dto/request/update-event.request.dto.ts
export class UpdateEventRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  venueId?: number;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsEnum(Category)
  @IsOptional()
  category?: Category;
}

// dto/response/event.response.dto.ts
export class EventResponseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNotEmpty()
  venue!: String;

  @IsDate()
  date!: Date;

  @IsDate()
  startTime!: Date;

  @IsDate()
  endTime!: Date;

  @IsEnum(Category)
  category!: Category;

  @IsNotEmpty()
  organizer!: {
    id: number;
    fullName: string;
  };

  @IsArray()
  attendees!: {
    id: number;
    fullName: string;
  }[];

  @IsArray()
  reviews!: {
    id: number;
    rating: string;
    comment: string;
    userId: number;
  }[];
}
