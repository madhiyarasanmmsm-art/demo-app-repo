import fs from "fs";

try {
  const { extractText } = await import("unpdf");
  const buf = fs.readFileSync("probe.pdf");
  const result = await extractText(new Uint8Array(buf));
  console.log("pages:", result.totalPages);
  console.log("extracted:", JSON.stringify(result.text).slice(0, 200));
} catch (err) {
  console.log("FAILED:", err && err.message ? err.message : String(err));
}
