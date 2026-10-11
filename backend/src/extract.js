import { extractText } from "unpdf";

// unpdf wants binary data as Uint8Array (not Buffer) and returns text as an
// array (one entry per PDF), so it's joined into a single string
export async function extractPdfText(buffer) {
  const result = await extractText(new Uint8Array(buffer));
  return result.text.join("\n");
}
