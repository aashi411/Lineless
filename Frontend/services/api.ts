
import { PriorityLevel, TransportMode, OperatorSession } from '../types';

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
