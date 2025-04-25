import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseISO, format, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Combines an ISO date and a time string (e.g., "10:00 AM") into a single Date object
 * @param isoDate string like '2025-04-08T22:00:00.000Z'
 * @param timeString string like '10:00 AM'
 */
export function combineDateAndTime(isoDate: string, timeString: string): Date {
  const parsedDate = parseISO(isoDate); // => Date object from ISO

  // Format the parsed date to a string without time, e.g., "2025-04-08"
  const datePart = format(parsedDate, "yyyy-MM-dd");

  // Combine the date and time strings into one
  const dateTimeString = `${datePart} ${timeString}`;

  // Parse to a Date object using date-fns with expected format
  return parse(dateTimeString, "yyyy-MM-dd h:mm a", new Date());
}

export const calculateSavings = (
  regularPrice: number,
  sessions: number,
  packagePrice: number,
) => {
  const regularTotal = regularPrice * sessions;
  const savings = regularTotal - packagePrice;
  const percentage = (savings / regularTotal) * 100;

  return {
    amount: savings,
    percentage: Math.round(percentage),
  };
};
