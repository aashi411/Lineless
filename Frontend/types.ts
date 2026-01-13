
export type UserRole = 'NONE' | 'CITIZEN' | 'OPERATOR';

export type PriorityLevel = 'STANDARD' | 'SENIOR_CITIZEN' | 'EMERGENCY' | 'DISABLED';

export type TransportMode = 'WALK' | 'TWO_WHEELER' | 'TRANSIT' | 'CAR';

export type TicketStatus = 'WAITING' | 'SERVING' | 'SERVED' | 'NOSHOW';

export interface OperatorSession {
  id: string;
  institutionName: string;
  role: 'ADMIN' | 'OPERATOR';
  serviceType: string;
  token: string;
}

export interface ServiceLocation {
  id: string;
  name: string;
  category: 'government' | 'medical' | 'entertainment';
  currentQueue: number;
  avgWaitMinutes: number;
  status: 'OPEN' | 'FULL' | 'CLOSED' | 'EMERGENCY_ONLY' | 'SYSTEM_DELAY';
  bottleneckAlert?: boolean;
}

export interface QueueTicket {
  id: string;
  locationName: string;
  position: number;
  estimatedArrival: string;
  timestamp: string;
  priority: PriorityLevel;
  citizenName: string;
  phone: string;
  distanceKm: number;
  travelTimeMinutes?: number;
  suggestedDeparture?: string;
  transportMode?: TransportMode;
  status: TicketStatus;
}

export interface CounterState {
  id: string;
  operatorName: string;
  status: 'SERVING' | 'IDLE' | 'BREAK' | 'EMERGENCY' | 'LOCKED';
  avgServiceTime: number;
  healthScore: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  language: 'en' | 'hi';
}
