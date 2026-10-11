// ============================================================
// Mock "parser" — no backend.
// The result is simulated in the browser, seeded from the file
// name so the same PDF always scores the same (demo-safe).
// When a real API exists, swap mockAnalyze()'s body for a call
// like: const res = await fetch("/api/parse", { method: "POST", body });
// ============================================================

export const SKILL_LIBRARY = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby",
  "React", "Vue", "Angular", "Next.js", "Node.js", "Express", "Django", "Flask", "Spring",
  "HTML", "CSS", "Sass", "Tailwind", "Bootstrap",
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "GraphQL", "Prisma",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "Git",
  "REST API", "Unit Testing", "Agile", "Communication", "Leadership", "Teamwork",
];

export function mockAnalyze(fileName) {
  const rand = seededRandom(hashString(fileName.toLowerCase()));

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

// Promise-based entry point the components call, with fake steps
export function runMockAnalysis(file) {
  const steps = [
    { label: "Extracting text from PDF…", ms: 500 },
    { label: "Detecting sections and structure…", ms: 450 },
    { label: `Scanning ${file.name} for skills…`, ms: 550 },
    { label: "Calculating score…", ms: 350 },
  ];

  return new Promise((resolve) => {
    let i = 0;
    function next() {
      if (i < steps.length) {
        setTimeout(next, steps[i].ms);
        i++;
      } else {
        resolve(mockAnalyze(file.name));
      }
    }
    next();
  });
}

// Tiny deterministic hash of the file name (FNV-1a)
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
