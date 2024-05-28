import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getBaseURL = () => {
  if (typeof window !== "undefined") return "";

  if (process.env.VERCEL_URL) return `https://${process.env.DOMAIN_URL}`;

  return `http://localhost:3000`;
};
