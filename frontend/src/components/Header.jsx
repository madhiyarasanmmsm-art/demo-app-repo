export default function Header() {
  return (
    <header className="site-header">
      <div className="container nav">
        <a className="brand" href="#">0<span className="brand-arrow">→</span>Shipped</a>
        <nav>
          <a href="#how">How it works</a>
          <a href="#upload">Upload</a>
        </nav>
      </div>
    </header>
  );
}
