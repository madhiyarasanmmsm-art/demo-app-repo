export default function Hero() {
  return (
    <section className="hero container">
      <p className="eyebrow">AI scoring added later — skills matching works now</p>
      <h1>
        The <span className="accent">0 → Shipped</span> Resume Parser
      </h1>
      <p className="sub">
        Drop in a resume PDF and a job description, and get a match score plus
        the skills you have and the ones you're missing. A real Express backend
        stores every analysis in MongoDB.
      </p>
    </section>
  );
}
