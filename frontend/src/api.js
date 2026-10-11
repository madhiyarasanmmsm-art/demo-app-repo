// All requests to the Express backend live here.
// In dev, Vite proxies /api → http://localhost:3001 (see vite.config.js).

export async function analyzeResume(file, jd) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jd", jd);

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const problem = await res.json().catch(() => null);
    throw new Error(problem?.error || `Server error (${res.status})`);
  }

  return res.json();
}
