import axios from 'axios';
import { CreateVenueDto, CreateEventDto } from './types';

const API_URL = 'http://localhost:3000/api'; // Update port if different

export const createVenue = async (venueData: CreateVenueDto) => {
  const response = await axios.post(`${API_URL}/venues`, venueData);
  return response.data;
};

export const createEvent = async (eventData: CreateEventDto) => {
  const response = await axios.post(`${API_URL}/events`, eventData);
  return response.data;
};

export const getVenues = async () => {
  const response = await axios.get(`${API_URL}/venues`);
  return response.data;
}; 