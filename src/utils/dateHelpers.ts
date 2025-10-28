// Date utility functions for service time calculations

/**
 * Get the next occurrence of a specific day of week and time
 * @param dayOfWeek - Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * @param time - Time in 24-hour format "HH:MM"
 * @returns Date object of next occurrence
 */
export const getNextOccurrence = (dayOfWeek: number, time: string): Date => {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);

  // Create a date for today at the specified time
  const targetDate = new Date(now);
  targetDate.setHours(hours, minutes, 0, 0);

  // Calculate days until target day of week
  const currentDay = now.getDay();
  let daysUntilTarget = dayOfWeek - currentDay;

  // If the target day is today but time has passed, or target day is before today,
  // schedule for next week
  if (daysUntilTarget < 0 || (daysUntilTarget === 0 && now > targetDate)) {
    daysUntilTarget += 7;
  }

  // Set the target date
  targetDate.setDate(now.getDate() + daysUntilTarget);

  return targetDate;
};

/**
 * Format date as "Day, Month Date, Year"
 * Example: "Tuesday, October 29, 2025"
 */
export const formatFullDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time in 12-hour format with AM/PM
 * Example: "6:00 PM"
 */
export const format12HourTime = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Format date as short version "Mon, Oct 29"
 */
export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get day name from day number
 */
export const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
};

/**
 * Check if a date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Get relative time string (e.g., "in 2 days", "tomorrow", "today")
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `in ${diffDays} days`;
  } else {
    return formatShortDate(date);
  }
};
