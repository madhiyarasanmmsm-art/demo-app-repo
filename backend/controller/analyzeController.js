import { analyzeAndStore } from "../service/analyzeResume.js";
import { HttpError } from "../utils.js";

export async function analyzeResume(req, res) {
  const jdText = (req.body.jd || "").trim();
  if (!req.file) throw new HttpError(400, "Please upload a resume PDF.");
  if (!jdText) throw new HttpError(400, "Please provide a job description.");

  const result = await analyzeAndStore({
    buffer: req.file.buffer,
    jdText,
    resumeName: req.file.originalname,
  });
  res.json(result);
}
