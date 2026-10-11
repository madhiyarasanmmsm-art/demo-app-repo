import { useRef, useState } from "react";

const MAX_FILE_MB = 5;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Uploader({ onAnalyze }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  function validate(candidate) {
    if (candidate.type !== "application/pdf" && !candidate.name.toLowerCase().endsWith(".pdf")) {
      return "That doesn't look like a PDF. Please choose a .pdf file.";
    }
    if (candidate.size > MAX_FILE_MB * 1024 * 1024) {
      return `File is larger than ${MAX_FILE_MB} MB. Please choose a smaller PDF.`;
    }
    return null;
  }

  function selectFile(candidate) {
    const problem = validate(candidate);
    if (problem) {
      setFile(null);
      setError(problem);
      return;
    }
    setError("");
    setFile(candidate);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) selectFile(dropped);
  }

  async function analyze() {
    if (!file || analyzing) return;
    setAnalyzing(true);
    onAnalyze(file);
    // give the fake progress a moment so the demo feels alive
    await new Promise((r) => setTimeout(r, 1300));
    setAnalyzing(false);
  }

  function changeFile() {
    setError("");
    setAnalyzing(false);
    fileInputRef.current?.click();
  }

  const idle = !file && !analyzing;

  return (
    <section id="upload" className="container upload-section">
      <div
        className={`upload-card${dragging ? " dragging" : ""}${error ? " has-error" : ""}`}
        onClick={() => idle && changeFile()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {idle && (
          <>
            <div className="upload-icon" aria-hidden="true">📄</div>
            <p className="upload-title">Drag &amp; drop your résumé PDF</p>
            <p className="upload-hint">
              or <span className="link">browse files</span> — PDF only, up to 5 MB
            </p>
          </>
        )}

        {file && !analyzing && (
          <>
            <div className="file-chip">
              <span className="file-icon" aria-hidden="true">📑</span>
              <span className="file-meta">
                <strong>{file.name}</strong>
                <small>{formatSize(file.size)}</small>
              </span>
            </div>
            <div className="file-actions">
              <button className="btn btn-primary" onClick={analyze}>Analyze résumé</button>
              <button className="btn btn-ghost" onClick={changeFile}>Change file</button>
            </div>
          </>
        )}

        {analyzing && (
          <>
            <div className="spinner" aria-hidden="true" />
            <p>Scanning {file.name} for skills…</p>
          </>
        )}

        {error && <p className="error" role="alert">{error}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => {
          const chosen = e.target.files[0];
          if (chosen) selectFile(chosen);
          e.target.value = ""; // lets the same file be re-selected later
        }}
      />
    </section>
  );
}
