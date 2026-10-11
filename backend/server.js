import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

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
app.use("/api", analyzeRoutes);

// Multer errors (including the upload size limit) should use the same JSON
// response shape as the rest of the API so the frontend can show them.
app.use(errorHandler);

export default app;

if (process.env.NODE_ENV !== "production") {
  const port = Number(process.env.PORT) || 3001;
  await connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resume_parser");
  app.listen(port, () => {
    console.log(`✓ API listening on http://localhost:${port}`);
  });
}
