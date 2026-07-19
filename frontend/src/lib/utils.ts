import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuidv7ToDate(uuid: string) {
  const cleanHex = uuid.replace(/-/g, "");

  // 2. Extract the first 12 hex characters (48 bits)
  const timestampHex = cleanHex.substring(0, 12);

  // 3. Convert the hex string to a base-10 integer (milliseconds)
  const timestampMs = parseInt(timestampHex, 16);

  // 4. Return a standard JavaScript Date object
  return new Date(timestampMs);
}

export function timeAgo(occurDateTime: string): string {
  const past = new Date(occurDateTime);
  const now = new Date();
  const secondsPast = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (secondsPast < 0) {
    return "just now";
  }

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(secondsPast / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function removeUndefinedFields<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined),
  ) as Partial<T>;
}

export function addMilliseconds(
  originalDateTime: Date,
  milliseconds: number,
): Date {
  const newDay = dayjs(originalDateTime);
  return newDay.add(milliseconds).toDate();
}
