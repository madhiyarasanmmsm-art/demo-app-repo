import { matchSkills } from "./src/match.js";
import { extractPdfText } from "./src/extract.js";
import PDFDocument from "pdfkit";

const resume = "SKILLS: JavaScript React Node.js Express MongoDB Git Docker REST API CI/CD";
const jd = "React TypeScript REST API MongoDB Docker Kubernetes AWS GraphQL CI/CD";
console.log("matched:", matchSkills(resume, jd).matched.join(", "));
console.log("missing:", matchSkills(resume, jd).missing.join(", "));

const doc = new PDFDocument();
const buffers = [];
doc.on("data", (b) => buffers.push(b));
doc.on("end", async () => {
  try {
    const text = await extractPdfText(Buffer.concat(buffers));
    console.log("extracted:", JSON.stringify(text));
    console.log("round-trip:", matchSkills(text, jd).matched.join(", "));
  } catch (err) {
    console.error("extract FAILED:", err.message);
  }
});
doc.text("SKILLS: JavaScript, React, Node.js, MongoDB");
doc.text("EXPERIENCE: Built REST APIs with Express");
doc.end();
