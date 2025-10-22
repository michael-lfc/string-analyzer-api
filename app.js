// app.js
import express from "express";
import dotenv from "dotenv";
import stringRoutes from "./routes/stringRoutes.js";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json()); // parse JSON request bodies

app.get("/", (req, res) => {
  res.send("✅ String Analyzer API is running...");
});

app.use("/strings", stringRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
