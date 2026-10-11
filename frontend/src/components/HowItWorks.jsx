const STEPS = [
  {
    num: "1",
    title: "Drop your PDF",
    text: "Drag a resume in or browse for it. Uploads are held in memory only — the 5 MB cap matches the backend.",
  },
  {
    num: "2",
    title: "We scan for signals",
    text: "The PDF text is extracted server-side and its skills are matched against your job description.",
  },
  {
    num: "3",
    title: "Get your score",
    text: "A match score, the skills present, and the gaps worth filling — every analysis is stored in MongoDB.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="container how">
      <h2>How it works</h2>
      <div className="how-grid">
        {STEPS.map((step) => (
          <div key={step.num} className="step-card">
            <span className="step-num">{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
