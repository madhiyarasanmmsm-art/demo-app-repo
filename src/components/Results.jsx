import { useEffect, useState } from "react";

export default function Results({ result }) {
  const [displayedScore, setDisplayedScore] = useState(0);

  // animate the score from 0 up on mount
  useEffect(() => {
    setDisplayedScore(0);
    const raf = requestAnimationFrame(() => setDisplayedScore(result.score));
    return () => cancelAnimationFrame(raf);
  }, [result]);

  const { score, found, missing } = result;

  const summary =
    score >= 80
      ? "Strong résumé — close to ready to ship. 🚀"
      : score >= 60
        ? "Good base — a few gaps are worth filling."
        : "Early draft — plenty of room to grow. 0 → shipped!";

  return (
    <section id="results" className="container results">
      <div className="results-grid">
        <div className="score-card">
          <div className="ring-wrap">
            <svg className="ring" viewBox="0 0 140 140" aria-hidden="true">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6d5efc" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <circle className="ring-track" cx="70" cy="70" r="56" />
              <circle className="ring-fill" cx="70" cy="70" r="56" style={{ strokeDashoffset: 352 * (1 - displayedScore / 100) }} />
            </svg>
            <div className="score-number">
              <span>{displayedScore}</span>
              <small>/100</small>
            </div>
          </div>
          <p className="score-summary">{summary}</p>
        </div>

        <div className="skills-card present">
          <div className="card-head">
            <h2>Skills found</h2>
            <span className="count-badge good">{found.length}</span>
          </div>
          <ul className="chips">
            {found.map((skill) => (
              <li key={skill} className="chip">{skill}</li>
            ))}
          </ul>
        </div>

        <div className="skills-card missing">
          <div className="card-head">
            <h2>Skills missing</h2>
            <span className="count-badge warn">{missing.length}</span>
          </div>
          <ul className="chips">
            {missing.map((skill) => (
              <li key={skill} className="chip">{skill}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="results-note">
        Mock analysis — this result is generated in your browser (seeded from the
        file name, so the same file always scores the same). Swap
        <code>mockAnalyze()</code> in <code>src/lib/mockAnalysis.js</code> for a
        real API when the backend ships.
      </p>
    </section>
  );
}
