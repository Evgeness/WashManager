// ===== Имитация API =====
// Здесь хранятся все мок-данные и функции «запросов».
// При подключении реального backend эти функции заменятся на fetch.

import type { Machine } from '../../entities/machine/types';
import type { Booking, DashboardData } from '../../entities/booking/types';


// Имитация задержки сети
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


// ===== СПРАВОЧНИКИ (общие данные) =====

// Список машин — используется на Schedule
export const machines = [
  { id: 1, name: 'Стиральная машина №1', type: 'washer' as const },
  { id: 2, name: 'Стиральная машина №2', type: 'washer' as const },
  { id: 3, name: 'Сушильная машина №1',   type: 'dryer'  as const },
];

// Временные слоты — используется на Schedule
export const timeSlots = [
  '08:00-10:00', '10:00-12:00', '12:00-14:00',
  '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'
];

// Названия дней для вкладок
export const dayLabels = ['Сегодня', 'Завтра', '15 июня'];


// ===== МОК-ДАННЫЕ ДЛЯ СУЩНОСТЕЙ =====

const mockMachines: Machine[] = [
  { id: 1, name: 'Стиральная машина №1', type: 'washer', status: 'free' },
  { id: 2, name: 'Стиральная машина №2', type: 'washer', status: 'busy' },
  { id: 3, name: 'Сушильная машина №1',   type: 'dryer',  status: 'queued' },
];

const mockBookings: Booking[] = [
  { id: 1, machineId: 1, machineName: 'Стиральная машина №1', date: 'Сегодня', time: '18:00 – 19:30', status: 'active' },
  { id: 2, machineId: 2, machineName: 'Стиральная машина №2', date: 'Завтра',  time: '10:00 – 11:30', status: 'queued' },
  { id: 3, machineId: 3, machineName: 'Сушильная машина №1',   date: 'Вчера',   time: '14:00 – 15:30', status: 'completed' },
];


// ===== ФУНКЦИИ «ЗАПРОСОВ» =====

export const fetchMachines = async (): Promise<Machine[]> => {
  await delay(1000);
  return mockMachines;
};

export const fetchBookings = async (): Promise<Booking[]> => {
  await delay(1200);
  return mockBookings;
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  await delay(800);
  return {
    nearestBooking: {
      machineName: 'Стиральная машина №3',
      timeLabel: 'Сегодня, 18:00 – 19:30',
      timeUntil: '2 ч 15 мин',
      progress: 35,
    },
    freeSlots: {
      count: 12,
      total: 28,
      machines: 4,
      nextSlot: '14:00',
      busy: 10,
      queued: 6,
    },
  };
};