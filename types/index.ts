export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  preferences: {
    language: string;
    currency: string;
    savedDestinations: string[];
  };
}

export interface City {
  _id: string;
  name: string;
  country: string;
  region: string;
  costIndex: number;
  popularity: number;
  imageUrl?: string;
  timezone: string;
  currency: string;
  description?: string;
  attractions?: string[];
  bestTimeToVisit?: string;
}

export interface Activity {
  _id: string;
  stopId: string;
  name: string;
  type: string;
  description?: string;
  date: string; // ISO date
  startTime?: string;
  endTime?: string;
  cost: number;
  duration?: number; // minutes
  location?: string;
  notes?: string;
}

export interface Stop {
  _id: string;
  tripId: string;
  cityId: string;
  cityName: string;
  order: number;
  startDate: string;
  endDate: string;
  notes?: string;
  durationDays: number;
  activities: Activity[];
}

export interface Trip {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  isPublic: boolean;
  shareableLink?: string;
  totalBudget?: number;
  status: string;
  stops: Stop[];
  totalDays: number;
}

export interface BudgetData {
  totalCost: number;
  costBreakdown: {
    transport: number;
    stay: number;
    activities: number;
    meals: number;
  };
  dailyBreakdown: { day: string; cost: number }[];
  averageDailyCost: number;
  totalDays: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}