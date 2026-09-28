import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Analysis = {
  summary: string;
  items: { name: string; quantity: number | null; category: string | null }[];
  budget: { amount: number | null; currency: string | null };
  deadline: { value: string | null; confidence: "high" | "medium" | "low" };
  requirements: string[];
  missingInformation: string[];
  riskFlags: { severity: "low" | "medium" | "high"; message: string }[];
  recommendedAction: string;
};

const demo = "We need 20 business laptops for our new Karlsruhe team. Budget is around €30,000. Delivery should be within four weeks. Prefer 16GB RAM and business-class devices.";
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

function App() {
  const [request, setRequest] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/procurement/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? data.error ?? "Request failed");
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="eyebrow">AI WORKFLOW DEMO</div>
        <h1>ProcureAI <span>Copilot</span></h1>
        <p>Turn unstructured purchasing requests into structured, reviewable procurement intelligence.</p>
      </header>

      <section className="panel input-panel">
        <div className="section-heading">
          <div><span className="step">01</span><h2>Procurement request</h2></div>
          <button className="ghost" onClick={() => setRequest(demo)}>Load demo</button>
        </div>
        <textarea value={request} onChange={(e) => setRequest(e.target.value)} placeholder="Describe what your team needs to purchase..." />
        <div className="action-row">
          <span className="hint">AI analyzes the request; it never places an order.</span>
          <button className="primary" disabled={loading || request.trim().length < 20} onClick={analyze}>{loading ? "Analyzing…" : "Analyze request →"}</button>
        </div>
        {error && <div className="error">{error}</div>}
      </section>

      {analysis && <section className="results">
        <div className="result-header"><div><span className="step">02</span><h2>AI analysis</h2></div><span className="badge">Structured output</span></div>
        <div className="summary">{analysis.summary}</div>
        <div className="grid">
          <Card title="Items"><ul>{analysis.items.map((item, i) => <li key={i}><strong>{item.quantity ?? "—"}×</strong> {item.name}<small>{item.category ?? "Uncategorised"}</small></li>)}</ul></Card>
          <Card title="Budget"><div className="metric">{analysis.budget.amount == null ? "Not specified" : new Intl.NumberFormat("de-DE", { style: "currency", currency: analysis.budget.currency ?? "EUR" }).format(analysis.budget.amount)}</div></Card>
          <Card title="Deadline"><div className="metric small">{analysis.deadline.value ?? "Not specified"}</div><span className={`confidence ${analysis.deadline.confidence}`}>{analysis.deadline.confidence} confidence</span></Card>
          <Card title="Requirements"><List values={analysis.requirements} empty="No explicit requirements detected." /></Card>
          <Card title="Missing information"><List values={analysis.missingInformation} empty="Nothing obvious missing." /></Card>
          <Card title="Risk flags"><ul>{analysis.riskFlags.length ? analysis.riskFlags.map((r, i) => <li key={i}><span className={`risk ${r.severity}`}>{r.severity}</span>{r.message}</li>) : <li>No risk flags detected.</li>}</ul></Card>
        </div>
        <div className="recommendation"><span>Recommended next action</span><strong>{analysis.recommendedAction}</strong></div>
      </section>}

      <footer>Portfolio project · Node.js · TypeScript · React · OpenAI Structured Outputs</footer>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="card"><h3>{title}</h3>{children}</article>;
}
function List({ values, empty }: { values: string[]; empty: string }) {
  return <ul>{values.length ? values.map((v, i) => <li key={i}>{v}</li>) : <li>{empty}</li>}</ul>;
}

createRoot(document.getElementById("root")!).render(<App />);
