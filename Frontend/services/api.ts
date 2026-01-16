
import axios from 'axios';
import { PriorityLevel, TransportMode, OperatorSession } from '../types';

// Get API URL from environment variables
// Production: Uses VITE_API_URL from .env.production
// Development: Uses VITE_API_URL from .env.local or defaults to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('[API Client] Using API URL:', API_URL);

// API Client for backend communication
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor for debugging
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('[API Error]', error.message);
    return Promise.reject(error);
  }
);

export const LineLessAPI = {
  // FASTAPI MOCK: POST /auth/login
  login: async (institutionId: string, email: string): Promise<OperatorSession> => {
    // Simulate network latency
    await new Promise(r => setTimeout(r, 800));
    
    // Simple validation logic for demo
    if (!institutionId || !email) throw new Error("Credentials required");

    return {
      id: "OP-900",
      institutionName: institutionId.includes('HOSPITAL') ? "City General Hospital" : "Passport Regional Office",
      role: 'ADMIN',
      serviceType: 'GOVERNMENT_SERVICES',
      token: "dpi_token_" + Math.random().toString(36).substr(2)
    };
  },

  calculateTransit: (mode: TransportMode, distanceKm: number): number => {
    const speeds = { WALK: 4, TWO_WHEELER: 20, TRANSIT: 15, CAR: 25 };
    const time = (distanceKm / speeds[mode]) * 60;
    return Math.ceil(time);
  },

  getTotalPrediction: (
    mode: TransportMode, 
    distanceKm: number, 
    avgWaitMinutes: number
  ) => {
    const travelTime = LineLessAPI.calculateTransit(mode, distanceKm);
    const buffer = 10;
    
    return {
      travelTime,
      queueWait: avgWaitMinutes,
      buffer,
      total: travelTime + avgWaitMinutes + buffer
    };
  }
};

