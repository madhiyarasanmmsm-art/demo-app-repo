import { extractText } from "unpdf";

export async function extractPdfText(buffer) {
  const result = await extractText(new Uint8Array(buffer));
  return result.text.join("\n");
}
