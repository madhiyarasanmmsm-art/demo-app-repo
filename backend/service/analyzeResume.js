import { getAnalysesCollection } from "../config/db.js";
import { extractPdfText } from "./extractPdfText.js";
import { scoreResumeWithLabd } from "./labd.js";

export async function analyzeAndStore({ buffer, jdText, resumeName }) {
  const text = await extractPdfText(buffer);
  const { jdTitle, score, matched, missing, summary } = await scoreResumeWithLabd(text, jdText);
  const record = {
    resumeName,
    jdExcerpt: jdText.slice(0, 200),
    jdTitle,
    matched,
    missing,
    matchedCount: matched.length,
    score,
    summary,
    createdAt: new Date(),
  };

  let stored = false;
  try {
    await getAnalysesCollection().insertOne(record);
    stored = true;
  } catch (err) {
    console.error("Failed to store analysis:", err.message);
  }

  return { jdTitle, score, matched, missing, matchedCount: matched.length, summary, stored };
}
