import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Uploader from "./components/Uploader.jsx";
import Results from "./components/Results.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Footer from "./components/Footer.jsx";
import { analyzeResume } from "./api.js";

export default function App() {
  const [result, setResult] = useState(null);
  const [serverError, setServerError] = useState("");

  async function handleAnalyze(file, jd) {
    setServerError("");
    setResult(null); // clears old chips while the next analysis runs
    try {
      const data = await analyzeResume(file, jd);
      setResult(data);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Is the backend running?");
    }
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Uploader onAnalyze={handleAnalyze} />
        {result && <Results result={result} />}
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
