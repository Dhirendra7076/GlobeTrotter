import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, differenceInDays, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM d, yyyy');
}

export function calculateDays(startDate: string, endDate: string) {
  return differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text: string, length = 50) {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}