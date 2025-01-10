import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Location } from '../model/Location';

// dto/request/create-venue.request.dto.ts
export class CreateVenueRequestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  location!: Location;

  @IsNumber()
  @IsNotEmpty()
  capacity!: number;
}

// dto/request/update-venue.request.dto.ts
export class UpdateVenueRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  location?: Location;

  @IsNumber()
  @IsOptional()
  capacity?: number;
}

// dto/response/venue.response.dto.ts
export class VenueResponseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsNotEmpty()
  location!: {
    city: string;
    country: string;
    state: string;
    street: string;
    zipCode: string;
  };

  @IsNumber()
  capacity!: number;

  @IsOptional()
  eventsHosted?: {
    id: number;
    name: string;
    date: Date;
  }[];
}