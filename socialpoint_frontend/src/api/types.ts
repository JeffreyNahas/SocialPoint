export interface CreateVenueDto {
  name: string;
  location: string;
  capacity: number;
}

export interface CreateEventDto {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  venueId: number;
  organizerId: number;
} 