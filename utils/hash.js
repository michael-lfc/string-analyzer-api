// utils/hash.js
import crypto from "crypto";

/**
 * Generate SHA-256 hash for a given string
 * @param {string} value - The string to hash
 * @returns {string} SHA-256 hash
 */
export function generateHash(value) {
  if (typeof value !== "string") {
    throw new Error("Input must be a string");
  }

  return crypto.createHash("sha256").update(value).digest("hex");
}
