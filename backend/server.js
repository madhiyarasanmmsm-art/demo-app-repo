import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { connectDB } from "./src/db.js";
import { analyzeAndStore } from "./src/analysis.js";

// keep uploads in memory only; 5 MB cap, same as the frontend
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const app = express();
app.use(cors());

// Vercel starts the app as a serverless function, while local development uses
// the listener at the bottom of this file. Connect lazily for each cold start.
app.use(async (req, res, next) => {
  try {
    await connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resume_parser");
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    res.status(503).json({ error: "Database is unavailable. Check the server configuration." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    const jdText = (req.body.jd || "").trim();
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a resume PDF." });
    }
    if (!jdText) {
      return res.status(400).json({ error: "Please provide a job description." });
    }

    const result = await analyzeAndStore({
      buffer: req.file.buffer,
      jdText,
      resumeName: req.file.originalname,
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze the resume." });
  }
});

// Multer errors (including the upload size limit) should use the same JSON
// response shape as the rest of the API so the frontend can show them.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Resume PDF must be 5 MB or smaller." });
  }
  if (err) {
    console.error(err);
    return res.status(400).json({ error: "Unable to process the uploaded resume." });
  }
  next();
});

export default app;

if (process.env.NODE_ENV !== "production") {
  const port = Number(process.env.PORT) || 3001;
  await connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resume_parser");
  app.listen(port, () => {
    console.log(`✓ API listening on http://localhost:${port}`);
  });
}
