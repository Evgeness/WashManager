export type BookingStatus = 'active' | 'queued' | 'completed';

export interface Booking {
  id: number;
  machineId: number;
  machineName: string;
  date: string;      // "Сегодня" или "15.05.2025"
  time: string;      // "18:00 – 19:30"
  status: BookingStatus;
}

// Тип для Dashboard оставляем без изменений
export interface DashboardData {
  nearestBooking: {
    machineName: string;
    timeLabel: string;
    timeUntil: string;
    progress: number;
  };
  freeSlots: {
    count: number;
    total: number;
    machines: number;
    nextSlot: string;
    busy: number;
    queued: number;
  };
}