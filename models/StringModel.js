// models/StringModel.js
import mongoose from "mongoose";

const StringSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate strings
    },
    properties: {
      length: { type: Number, required: true },
      is_palindrome: { type: Boolean, required: true },
      unique_characters: { type: Number, required: true },
      word_count: { type: Number, required: true },
      sha256_hash: { type: String, required: true, unique: true },
      character_frequency_map: { type: Map, of: Number, required: true },
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false } // Removes __v field
);

// Export Mongoose model
const StringModel = mongoose.model("String", StringSchema);

export default StringModel;
