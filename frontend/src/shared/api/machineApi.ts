import { apiRequest } from './client';
import type { Machine } from '../../entities/machine/types';

export const machineApi = {
  // GET /machines/ — получить список всех машин
  getAll: () => apiRequest<Machine[]>('/machines/', { method: 'GET' }),
};