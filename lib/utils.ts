import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/encryption.ts

const algorithm = "aes-256-cbc";
const key = Buffer.from("2e4220aa3f6c1a4d74e540506701f3ab"); // Replace with your own secret key
const iv = randomBytes(16);

export const encrypt = (text: string): string => {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (text: string): string => {
  const [ivString, encrypted] = text.split(":");
  const decipher = createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivString, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
