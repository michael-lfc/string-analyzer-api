// analyze.js
import { generateHash } from "./utils/hash.js";

export function analyzeString(value) {
  if (typeof value !== "string") {
    throw new Error("Input must be a string");
  }

  const normalized = value.toLowerCase().replace(/\s+/g, "");
  const is_palindrome = normalized === normalized.split("").reverse().join("");
  

  const character_frequency_map = new Map();

for (const char of value) {
  if (character_frequency_map.has(char)) {
    // if character already exists, increase count by 1
    const currentCount = character_frequency_map.get(char);
    character_frequency_map.set(char, currentCount + 1);
  } else {
    // if character not in map yet, start counting from 1
    character_frequency_map.set(char, 1);
  }
}


  const sha256_hash = generateHash(value);

  return {
    length: value.length,
    is_palindrome,
    unique_characters: character_frequency_map.size,
    word_count: value.trim() === "" ? 0 : value.trim().split(/\s+/).length,
    sha256_hash,
    character_frequency_map: Object.fromEntries(character_frequency_map),
  };
}
