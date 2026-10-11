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

async function main() {
  await connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resume_parser");

  const app = express();
  app.use(cors());

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

  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => {
    console.log(`✓ API listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
