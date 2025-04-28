import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseISO, format, parse } from "date-fns";
import { VideoClient } from "@zoom/videosdk";

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

// For safari desktop browsers, you need to start audio after the media-sdk-change event is triggered
export const WorkAroundForSafari = async (client: typeof VideoClient) => {
  let audioDecode: boolean;
  let audioEncode: boolean;
  client.on("media-sdk-change", (payload) => {
    console.log("media-sdk-change", payload);
    if (payload.type === "audio" && payload.result === "success") {
      if (payload.action === "encode") {
        audioEncode = true;
      } else if (payload.action === "decode") {
        audioDecode = true;
      }
      if (audioEncode && audioDecode) {
        console.log("start audio");
        void client.getMediaStream().startAudio();
      }
    }
  });
};
