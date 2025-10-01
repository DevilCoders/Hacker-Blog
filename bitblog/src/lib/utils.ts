import type { User } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUsername = (user: User): string => {
  const { firstName, lastName, username } = user;

  return firstName || lastName ? [firstName, lastName].join(' ') : username;
};

export const getReadingTime = (content: string): number => {
  const AVG_READING_WPM = 150;

  return Math.ceil(content.split(' ').length / AVG_READING_WPM);
};
