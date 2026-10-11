// Ties the pipeline together: extract -> match -> score -> store

import { extractPdfText } from "./extract.js";
import { matchSkills } from "./match.js";
import { getCollection } from "./db.js";

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

  // storing the analysis; a DB problem shouldn't block the response
  try {
    const result = await getCollection().insertOne(record);
    record.id = result.insertedId;
  } catch (err) {
    console.error("Failed to store analysis:", err.message);
  }

  return {
    score,
    matched,
    missing,
    matchedCount: matched.length,
    stored: record.id != null,
  };
}
