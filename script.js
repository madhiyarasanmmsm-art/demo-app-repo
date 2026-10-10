/* ============================================================
   0 → Shipped Resume Parser — mock logic
   No backend: "analysis" is simulated in the browser, seeded
   from the file name so the same PDF always scores the same.
   ============================================================ */

// The skill library the (mock) parser checks against
const SKILL_LIBRARY = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby",
  "React", "Vue", "Angular", "Next.js", "Node.js", "Express", "Django", "Flask", "Spring",
  "HTML", "CSS", "Sass", "Tailwind", "Bootstrap",
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "GraphQL", "Prisma",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "Git",
  "REST API", "Unit Testing", "Agile", "Communication", "Leadership", "Teamwork",
];

const MAX_FILE_MB = 5;

// ---------- element handles ----------
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const uploadIdle = document.getElementById("uploadIdle");
const uploadFile = document.getElementById("uploadFile");
const progressBox = document.getElementById("progressBox");
const progressLabel = document.getElementById("progressLabel");
const uploadError = document.getElementById("uploadError");
const fileChipName = document.getElementById("fileChipName");
const fileChipMeta = document.getElementById("fileChipMeta");
const analyzeBtn = document.getElementById("analyzeBtn");
const changeFileBtn = document.getElementById("changeFileBtn");
const results = document.getElementById("results");
const scoreValue = document.getElementById("scoreValue");
const scoreRing = document.getElementById("scoreRing");
const scoreSummary = document.getElementById("scoreSummary");
const presentList = document.getElementById("presentSkills");
const missingList = document.getElementById("missingSkills");
const presentCount = document.getElementById("presentCount");
const missingCount = document.getElementById("missingCount");
const resetBtn = document.getElementById("resetBtn");
const yearEl = document.getElementById("year");

let selectedFile = null;
let analysisDone = false; // debounce: Analyze does one round per chosen file

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- upload interactions ----------

dropZone.addEventListener("click", () => fileInput.click());

// clicking the "Change file" button must not also trigger the card's click → double file dialog
changeFileBtn.addEventListener("click", (e) => e.stopPropagation());
changeFileBtn.addEventListener("click", () => {
  analysisDone = false; // a fresh file gets a fresh analysis
  fileInput.click();
});

dropZone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) selectFile(fileInput.files[0]);
});

// drag & drop
["dragenter", "dragover"].forEach((evt) =>
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.add("dragging");
  })
);

["dragleave", "drop"].forEach((evt) =>
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragging");
  })
);

dropZone.addEventListener("drop", (e) => {
  const dropped = e.dataTransfer.files[0];
  if (dropped) selectFile(dropped);
});

function selectFile(file) {
  // reset error state
  uploadError.classList.add("hidden");
  uploadError.textContent = "";
  dropZone.classList.remove("has-error");
  analysisDone = false;

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    showUploadError("That doesn't look like a PDF. Please choose a .pdf file.");
    return;
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    showUploadError(`File is larger than ${MAX_FILE_MB} MB. Please choose a smaller PDF.`);
    return;
  }

  selectedFile = file;
  fileChipName.textContent = file.name;
  fileChipMeta.textContent = formatSize(file.size);
  uploadIdle.classList.add("hidden");
  uploadFile.classList.remove("hidden");
  hideResults();
}

analyzeBtn.addEventListener("click", async () => {
  if (!selectedFile || analysisDone) return;
  analysisDone = true;
  await runMockAnalysis();
});

resetBtn.addEventListener("click", () => {
  selectedFile = null;
  analysisDone = false;
  fileInput.value = ""; // lets the user re-select the same file again
  uploadFile.classList.add("hidden");
  progressBox.classList.add("hidden");
  uploadIdle.classList.remove("hidden");
  hideResults();
});

function showUploadError(msg) {
  dropZone.classList.add("has-error");
  uploadError.textContent = msg;
  uploadError.classList.remove("hidden");
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------- the mock "analysis" ----------

// Tiny deterministic hash of the file name → same file ⇒ same result
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Small seeded PRNG (mulberry32) — reproducible without Math.random()
function seededRandom(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mockAnalyze(file) {
  const rand = seededRandom(hashString(file.name.toLowerCase()));

  // score: 28–95, so the demo never shows a useless 0 or a perfect 100
  const score = 28 + Math.floor(rand() * 68);

  // shuffle the library, then deal out the found skills
  const pool = [...SKILL_LIBRARY];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const foundCount = Math.round((score / 100) * SKILL_LIBRARY.length * (0.65 + rand() * 0.25));
  const found = pool.slice(0, Math.min(foundCount, 14));
  const missing = pool.filter((s) => !found.includes(s)).slice(0, 8);

  return { score, found, missing };
}

function fakeProgressSteps(fileName) {
  return [
    { label: "Extracting text from PDF…", ms: 500 },
    { label: "Detecting sections and structure…", ms: 450 },
    { label: `Scanning ${fileName} for skills…`, ms: 550 },
    { label: "Calculating score…", ms: 350 },
  ];
}

function runMockAnalysis() {
  uploadFile.classList.add("hidden");
  progressBox.classList.remove("hidden");
  hideResults();

  const steps = fakeProgressSteps(selectedFile.name);
  let i = 0;

  return new Promise((resolve) => {
    function next() {
      if (i < steps.length) {
        progressLabel.textContent = steps[i].label;
        setTimeout(next, steps[i].ms);
        i++;
      } else {
        const { score, found, missing } = mockAnalyze(selectedFile);
        progressBox.classList.add("hidden");
        showResults(score, found, missing);
        resolve();
      }
    }
    next();
  });
}

// ---------- rendering ----------

function showResults(score, found, missing) {
  presentList.innerHTML = "";
  missingList.innerHTML = "";

  found.forEach((skill) => {
    const li = document.createElement("li");
    li.className = "chip";
    li.textContent = skill;
    presentList.appendChild(li);
  });

  missing.forEach((skill) => {
    const li = document.createElement("li");
    li.className = "chip";
    li.textContent = skill;
    missingList.appendChild(li);
  });

  presentCount.textContent = found.length;
  missingCount.textContent = missing.length;

  scoreSummary.textContent =
    score >= 80
      ? "Strong résumé — close to ready to ship. 🚀"
      : score >= 60
        ? "Good base — a few gaps are worth filling."
        : "Early draft — plenty of room to grow. 0 → shipped!";

  scoreValue.textContent = "0";
  scoreRing.style.strokeDashoffset = 352; // reset so the animation replays
  results.classList.remove("hidden");

  // animate the number + ring after a frame so the transition kicks in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scoreValue.textContent = score;
      scoreRing.style.strokeDashoffset = 352 * (1 - score / 100);
    });
  });

  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideResults() {
  results.classList.add("hidden");
}
