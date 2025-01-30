import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

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

export const createVenue = async (data: CreateVenueDto) => {
  const response = await axios.post(`${API_URL}/venues`, data);
  return response.data;
};

export const createEvent = async (data: CreateEventDto) => {
  const response = await axios.post(`${API_URL}/events`, data);
  return response.data;
};

export const getVenues = async () => {
  const response = await axios.get(`${API_URL}/venues`);
  return response.data;
}; 