import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const tripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  coverPhoto: z.string().optional(),
});

export const stopSchema = z.object({
  cityId: z.string().min(1, 'City is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  notes: z.string().optional(),
});

export const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  cost: z.number().min(0, 'Cost must be non-negative'),
  duration: z.number().min(0).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  profilePhoto: z.string().optional(),
  language: z.string(),
  currency: z.string(),
});