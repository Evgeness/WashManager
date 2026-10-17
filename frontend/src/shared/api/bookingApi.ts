import { apiRequest } from './client';

export interface CreateBookingDto {
  user_name: string;
  user_room: string;
  machine_id: number;
  start_time: string;
  end_time: string;
}

export interface BackendBookingResponse {
  id: number;
  user_id: number;
  user_name: string;
  user_room: string;
  machine_id: number;
  machine_name: string;
  start_time: string;
  end_time: string;
  status: string;
}

export const bookingApi = {
  // Для "Моих броней"
  getAll: () => apiRequest<BackendBookingResponse[]>('/bookings/', { method: 'GET' }),
  
  // Для "Расписания" (все брони)
  getAllSchedule: () => apiRequest<BackendBookingResponse[]>('/bookings/all', { method: 'GET' }),
  
  create: (data: CreateBookingDto) => 
    apiRequest<BackendBookingResponse>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id: number) => 
    apiRequest<void>(`/bookings/${id}`, { method: 'DELETE' }),
};