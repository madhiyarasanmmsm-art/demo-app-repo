const STEPS = [
  {
    num: "1",
    title: "Drop your PDF",
    text: "Drag a résumé in or browse for it. In this mock, the file never leaves your machine.",
  },
  {
    num: "2",
    title: "We scan for signals",
    text: "Contact info, structure, and skills — matched against a library of 45+ keywords.",
  },
  {
    num: "3",
    title: "Get your score",
    text: "A 0–100 score, the skills present, and the gaps worth filling before you apply.",
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
