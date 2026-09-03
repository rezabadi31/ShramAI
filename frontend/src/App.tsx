import { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Server, 
  FileText, 
  Layers, 
  Cpu, 
  Scale, 
  AlertTriangle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { fetchHealth } from './services/api';
import { SystemHealth } from './types';

export default function App() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth().then((res) => {
      setHealth(res);
      setLoading(false);
    });
  }, []);

  const pipelineStages = [
    { title: "Statutory Registers", desc: "Form A/B/C/D, Wage, Attendance, Muster", icon: FileText, color: "text-blue-400" },
    { title: "Document Intelligence", desc: "Digital Extraction + PaddleOCR Fallback", icon: Cpu, color: "text-cyan-400" },
    { title: "Agentic Orchestration", desc: "LangGraph Multi-Agent Coordination", icon: Layers, color: "text-indigo-400" },
    { title: "Deterministic Rules + RAG", desc: "Four Labour Codes & JSON Rules", icon: Scale, color: "text-amber-400" },
    { title: "Cross-Doc Anomalies", desc: "Headcount, Payroll & Wage Reconciliation", icon: AlertTriangle, color: "text-rose-400" },
    { title: "ML Risk & SHAP", desc: "XGBoost Calibrated Score (0-100)", icon: Activity, color: "text-emerald-400" },
    { title: "Inspector Brief", desc: "Human-in-the-Loop Decision & Feedback", icon: ShieldCheck, color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top GovTech Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-blue-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-slate-100 to-emerald-400">
                  ShramAI
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  PS 05 Prototype
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Digital Shram Sankalp • Smart Labour Compliance & Inspection Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/60">
              <span className={`w-2 h-2 rounded-full ${health?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-slate-300">Backend API:</span>
              <span className={health?.status === 'healthy' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {loading ? 'Probing...' : health?.status?.toUpperCase()}
              </span>
            </div>
            <a 
              href="http://127.0.0.1:8000/docs" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <span>Swagger Docs</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Phase 0 Badge & Alert */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                Phase 0 Foundation Initialized
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Ready for Phase 1
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Core repository scaffolding, modular FastAPI micro-architecture, Pydantic schemas, and Vite frontend active.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800">
            <span>Repo:</span>
            <span className="text-amber-400">shram-project</span>
            <span className="text-slate-600">|</span>
            <span>Version:</span>
            <span className="text-blue-400">{health?.version || '0.1.0'}</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                Four Labour Codes of India
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Proactive, Evidence-Backed Labour Compliance Intelligence
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                ShramAI is positioned as an intelligence layer that automates statutory document auditing, verifies deterministic rules against Indian Labour Codes, exposes multi-register discrepancies, and equips inspectors with explainable ML risk evaluations.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 mt-6">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-500 block font-medium">Labour Codes</span>
                <span className="text-lg font-bold text-slate-200">4 Enacted</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-500 block font-medium">Validation Mode</span>
                <span className="text-lg font-bold text-amber-400">Deterministic</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-500 block font-medium">ML Risk Model</span>
                <span className="text-lg font-bold text-emerald-400">XGBoost+SHAP</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-500 block font-medium">Decision Authority</span>
                <span className="text-lg font-bold text-indigo-400">Human-in-Loop</span>
              </div>
            </div>
          </div>

          {/* Service Readiness Matrix */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
                <Server className="w-4 h-4 text-blue-400" />
                Backend Intelligence Modules
              </h2>
              <div className="space-y-2.5">
                {[
                  { name: "Document AI (PDF + OCR)", status: health?.services?.document_ai || "ready" },
                  { name: "Deterministic Rule Engine", status: health?.services?.rule_engine || "ready" },
                  { name: "Cross-Doc Anomaly Engine", status: health?.services?.cross_document_anomaly || "ready" },
                  { name: "ML Risk Engine (XGBoost)", status: health?.services?.ml_risk_engine || "ready" },
                  { name: "Multi-Agent Orchestrator", status: health?.services?.agent_orchestrator || "ready" },
                  { name: "Statutory RAG Retrieval", status: health?.services?.rag_retrieval || "ready" },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-300 font-medium">{s.name}</span>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {s.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Environment: <strong className="text-slate-400 font-mono">{health?.environment || 'development'}</strong></span>
              <button 
                onClick={() => {
                  setLoading(true);
                  fetchHealth().then((res) => { setHealth(res); setLoading(false); });
                }} 
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Recheck
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Pipeline Architecture Visual */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                End-to-End Compliance & Inspection Pipeline
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-stage processing flow from raw document ingestion to explainable inspector decisions
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
              7 Core Pipeline Stages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div key={idx} className="relative bg-slate-900/70 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 font-bold">0{idx + 1}</span>
                      <Icon className={`w-4 h-4 ${stage.color}`} />
                    </div>
                    <h3 className="font-semibold text-xs text-slate-200 group-hover:text-white transition leading-tight">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            ShramAI • Digital Shram Sankalp PS 05 Research-Grade Prototype
          </p>
          <p className="font-mono text-[11px]">
            FastAPI + React TypeScript + PostgreSQL (pgvector) + XGBoost + LangGraph
          </p>
        </div>
      </footer>
    </div>
  );
}
