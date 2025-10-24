// controllers/stringController.js
import StringModel from "../models/StringModel.js";
import { analyzeString } from "../analyze.js";

// create string
export const createString = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value || typeof value !== "string") {
      return res.status(422).json({ error: 'Invalid data type for "value" (must be string)' });
    }

    // Analyze string
    const properties = analyzeString(value);

    // Check if string already exists by SHA-256 hash
    const existing = await StringModel.findOne({ "properties.sha256_hash": properties.sha256_hash });
    if (existing) {
      return res.status(409).json({ error: "String already exists in the system" });
    }

    // Save to MongoDB
    const stringDoc = await StringModel.create({ value, properties });

    res.status(201).json({
      id: stringDoc.properties.sha256_hash,
      value: stringDoc.value,
      properties: stringDoc.properties,
      created_at: stringDoc.created_at,
    });
  } catch (error) {
    console.error("Error creating string:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /strings/:value - Retrieve a string by its value
 */
export const getString = async (req, res) => {
  try {
    const { value } = req.params;
    const stringDoc = await StringModel.findOne({ value });

    if (!stringDoc) {
      return res.status(404).json({ error: "String does not exist in the system" });
    }

    res.status(200).json({
      id: stringDoc.properties.sha256_hash,
      value: stringDoc.value,
      properties: stringDoc.properties,
      created_at: stringDoc.created_at,
    });
  } catch (error) {
    console.error("Error fetching string:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /strings - Get all strings with query filtering
 */
export const getAllStrings = async (req, res) => {
  try {
    const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;
    const filters = {};

    if (is_palindrome !== undefined) {
      if (is_palindrome !== "true" && is_palindrome !== "false") {
        return res.status(400).json({ error: "is_palindrome must be 'true' or 'false'" });
      }
      filters["properties.is_palindrome"] = is_palindrome === "true";
    }

    if (min_length !== undefined || max_length !== undefined) {
      filters["properties.length"] = {};
      if (min_length !== undefined) {
        const min = parseInt(min_length);
        if (isNaN(min) || min < 0) return res.status(400).json({ error: "min_length must be a positive integer" });
        filters["properties.length"].$gte = min;
      }
      if (max_length !== undefined) {
        const max = parseInt(max_length);
        if (isNaN(max) || max < 0) return res.status(400).json({ error: "max_length must be a positive integer" });
        filters["properties.length"].$lte = max;
      }
    }

    if (word_count !== undefined) {
      const wc = parseInt(word_count);
      if (isNaN(wc) || wc < 0) return res.status(400).json({ error: "word_count must be a positive integer" });
      filters["properties.word_count"] = wc;
    }


    if (contains_character !== undefined) {
      if (contains_character.length !== 1) return res.status(400).json({ error: "contains_character must be a single character" });
      filters["value"] = { $regex: contains_character, $options: "i" };
    }

    const strings = await StringModel.find(filters);

    res.status(200).json({
      data: strings.map(doc => ({
        id: doc.properties.sha256_hash,
        value: doc.value,
        properties: doc.properties,
        created_at: doc.created_at,
      })),
      count: strings.length,
      filters_applied: req.query,
    });
  } catch (error) {
    console.error("Error fetching all strings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


/**
 * GET /strings/filter-by-natural-language?query=...
 */
export const filterByNaturalLanguage = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const queryLower = query.toLowerCase();
    const parsedFilters = {};

    // 1️⃣ Palindrome filter
    if (queryLower.includes("palindromic") || queryLower.includes("palindrome")) {
      parsedFilters["properties.is_palindrome"] = true;
    }

    // 2️⃣ Word count filter
    if (queryLower.includes("single word") || queryLower.includes("one word")) {
      parsedFilters["properties.word_count"] = 1;
    } else if (queryLower.includes("word")) {
      // Look for a number right before the word "word"
      const words = queryLower.split(" ");
      const wordIndex = words.findIndex(w => w.includes("word"));
      if (wordIndex > 0) {
        const possibleNumber = parseInt(words[wordIndex - 1]);
        if (!isNaN(possibleNumber)) {
          parsedFilters["properties.word_count"] = possibleNumber;
        }
      }
    }

    // 3️⃣ Length filters
    if (queryLower.includes("longer than") || queryLower.includes("more than")) {
      const words = queryLower.split(" ");
      const index = words.findIndex(w => w.includes("character"));
      if (index > 0) {
        const number = parseInt(words[index - 1]);
        if (!isNaN(number)) {
          parsedFilters["properties.length"] = { ...(parsedFilters["properties.length"] || {}), $gte: number + 1 };
        }
      }
    }

    if (queryLower.includes("shorter than") || queryLower.includes("less than")) {
      const words = queryLower.split(" ");
      const index = words.findIndex(w => w.includes("character"));
      if (index > 0) {
        const number = parseInt(words[index - 1]);
        if (!isNaN(number)) {
          parsedFilters["properties.length"] = { ...(parsedFilters["properties.length"] || {}), $lte: number - 1 };
        }
      }
    }

    // 4️⃣ Character filter
    if (queryLower.includes("contain") || queryLower.includes("containing")) {
      const words = queryLower.split(" ");
      const containIndex = words.findIndex(w => w.includes("contain"));
      if (containIndex >= 0 && containIndex + 1 < words.length) {
        const char = words[containIndex + 1];
        if (char.length === 1 && /[a-z]/.test(char)) {
          parsedFilters["value"] = { $regex: char, $options: "i" };
        }
      }
    }

    // 5️⃣ Check if any filters were parsed
    if (Object.keys(parsedFilters).length === 0) {
      return res.status(400).json({
        error: "Unable to parse natural language query",
        interpreted_query: { original: query, parsed_filters: {} },
      });
    }

    // 6️⃣ Query MongoDB
    const strings = await StringModel.find(parsedFilters);

    // 7️⃣ Respond
    res.status(200).json({
      data: strings.map(doc => ({
        id: doc.properties.sha256_hash,
        value: doc.value,
        properties: doc.properties,
        created_at: doc.created_at,
      })),
      count: strings.length,
      interpreted_query: { original: query, parsed_filters: parsedFilters },
    });

  } catch (error) {
    console.error("Error parsing natural language query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /strings/:value - Delete a string by value
 */
export const deleteString = async (req, res) => {
  try {
    const { value } = req.params;
    const stringDoc = await StringModel.findOne({ value });
    if (!stringDoc) {
      return res.status(404).json({ error: "String does not exist in the system" });
    }

    await stringDoc.deleteOne();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting string:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
