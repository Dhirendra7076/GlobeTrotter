import { create } from 'zustand';
import { Trip, Stop, Activity } from '@/types';

interface TripState {
  currentTrip: Trip | null;
  stops: Stop[];
  setCurrentTrip: (trip: Trip | null) => void;
  setStops: (stops: Stop[]) => void;
  addStop: (stop: Stop) => void;
  updateStop: (stopId: string, updates: Partial<Stop>) => void;
  removeStop: (stopId: string) => void;
  reorderStops: (newOrder: Stop[]) => void;
  addActivity: (stopId: string, activity: Activity) => void;
  updateActivity: (activityId: string, updates: Partial<Activity>) => void;
  removeActivity: (stopId: string, activityId: string) => void;
  resetTrip: () => void;
}

export const useTripStore = create<TripState>((set) => ({
  currentTrip: null,
  stops: [],
  setCurrentTrip: (trip) => set({ currentTrip: trip, stops: trip?.stops || [] }),
  setStops: (stops) => set({ stops }),
  addStop: (stop) => set((state) => ({ stops: [...state.stops, stop] })),
  updateStop: (stopId, updates) =>
    set((state) => ({
      stops: state.stops.map((s) => (s._id === stopId ? { ...s, ...updates } : s)),
    })),
  removeStop: (stopId) =>
    set((state) => ({ stops: state.stops.filter((s) => s._id !== stopId) })),
  reorderStops: (newOrder) => set({ stops: newOrder }),
  addActivity: (stopId, activity) =>
    set((state) => ({
      stops: state.stops.map((s) =>
        s._id === stopId ? { ...s, activities: [...s.activities, activity] } : s
      ),
    })),
  updateActivity: (activityId, updates) =>
    set((state) => ({
      stops: state.stops.map((s) => ({
        ...s,
        activities: s.activities.map((a) =>
          a._id === activityId ? { ...a, ...updates } : a
        ),
      })),
    })),
  removeActivity: (stopId, activityId) =>
    set((state) => ({
      stops: state.stops.map((s) =>
        s._id === stopId
          ? { ...s, activities: s.activities.filter((a) => a._id !== activityId) }
          : s
      ),
    })),
  resetTrip: () => set({ currentTrip: null, stops: [] }),
}));