// routes/stringRoutes.js
import express from "express";
import { 
  createString, 
  getString, 
  getAllStrings, 
  filterByNaturalLanguage, 
  deleteString 
} from "../controllers/stringController.js";

const router = express.Router();

// 1️⃣ Natural language filtering must come first to avoid conflicts with :value route
router.get("/filter-by-natural-language", filterByNaturalLanguage);

// 2️⃣ Get all strings with filtering
router.get("/", getAllStrings);

// 3️⃣ Get a specific string by value
router.get("/:value", getString);

// 4️⃣ Create/analyze a string
router.post("/", createString);

// 5️⃣ Delete a string by value
router.delete("/:value", deleteString);

export default router;
