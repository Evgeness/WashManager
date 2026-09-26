export type BookingStatus = 'active' | 'queued' | 'completed';

export interface Booking {
  id: number;
  machineId: number;
  machineName: string;
  date: string;
  time: string;
  status: BookingStatus;
}

// ===== Тип для главной страницы =====
export interface DashboardData {
  nearestBooking: {
    machineName: string;
    timeLabel: string;      // "Сегодня, 18:00 – 19:30"
    timeUntil: string;      // "2 ч 15 мин"
    progress: number;       // 0–100
  };
  freeSlots: {
    count: number;          // всего свободно
    total: number;          // всего слотов
    machines: number;       // на скольких машинах
    nextSlot: string;       // "14:00"
    busy: number;           // занято
    queued: number;         // в очереди
  };
}