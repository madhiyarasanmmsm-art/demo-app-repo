export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <span className="brand">0<span className="brand-arrow">→</span>Shipped</span>
        <p>Front-end mock for the 0 → Shipped build log. Real parsing API coming next.</p>
        <p><small>© {new Date().getFullYear()} — built with React, Vite &amp; plain CSS.</small></p>
      </div>
    </footer>
  );
}
