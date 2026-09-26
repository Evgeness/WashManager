// Типизация сущности Machine
export type MachineType = 'washer' | 'dryer';
export type MachineStatus = 'free' | 'busy' | 'queued' | 'broken';

export interface Machine {
  id: number;
  name: string;
  type: MachineType;
  status: MachineStatus;
}