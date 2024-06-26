import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { FileRouter } from "~/app/api/uploadthing/core";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const getBaseURL = () => {
  if (typeof window !== "undefined") return "";

  if (process.env.VERCEL_URL) return `https://${process.env.DOMAIN_URL}`;

  return `http://localhost:3000`;
};

export const UploadButton = generateUploadButton<FileRouter>();
export const UploadDropzone = generateUploadDropzone<FileRouter>();

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export const getReviewAverage = (reviews: number[]) =>
  reviews.length === 0
    ? 0
    : reviews.reduce((acc, review) => acc + review, 0) / reviews.length;
