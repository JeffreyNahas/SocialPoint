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

  @IsNumber()
  @IsNotEmpty()
  venueId!: number;

  @IsDate()
  @IsNotEmpty()
  date!: Date;

  @IsDate()
  @IsNotEmpty()
  startTime!: Date;

  @IsDate()
  @IsNotEmpty()
  endTime!: Date;

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

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsDate()
  @IsOptional()
  startTime?: Date;

  @IsDate()
  @IsOptional()
  endTime?: Date;

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
  venue!: {
    id: number;
    name: string;
  };

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
