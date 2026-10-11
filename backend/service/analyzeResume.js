import { getAnalysesCollection } from "../config/db.js";
import { extractPdfText } from "./extractPdfText.js";
import { matchSkills } from "./matchSkills.js";

export async function analyzeAndStore({ buffer, jdText, resumeName }) {
  const text = await extractPdfText(buffer);
  const { matched, missing } = matchSkills(text, jdText);
  const total = matched.length + missing.length;
  const score = total === 0 ? 0 : Math.round((matched.length / total) * 100);
  const record = {
    resumeName,
    jdExcerpt: jdText.slice(0, 200),
    matched,
    missing,
    matchedCount: matched.length,
    score,
    createdAt: new Date(),
  };

  let stored = false;
  try {
    await getAnalysesCollection().insertOne(record);
    stored = true;
  } catch (err) {
    console.error("Failed to store analysis:", err.message);
  }

  return { score, matched, missing, matchedCount: matched.length, stored };
}
