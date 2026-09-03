import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Cpu, 
  Layers, 
  Scale, 
  AlertTriangle, 
  Activity, 
  ArrowRight,
  Building2,
  FileSearch,
  Lock,
  BookOpen,
  X
} from 'lucide-react';
import { ActiveRole, SystemHealth } from '../types';
import { fetchCodeDetails } from '../services/api';

interface LandingPageProps {
  onNavigate: (role: ActiveRole) => void;
  health?: SystemHealth | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, health: _health }) => {
  const [selectedCodeDetails, setSelectedCodeDetails] = useState<any | null>(null);

  const handleOpenCode = async (codeId: string) => {
    try {
      const details = await fetchCodeDetails(codeId);
      setSelectedCodeDetails(details);
    } catch (e) {
      console.error(e);
    }
  };

  const pipelineStages = [
    { title: "Statutory Registers", desc: "Form A/B/C/D, Wage, Attendance, Muster Rolls", icon: FileText, color: "text-blue-400" },
    { title: "Document Intelligence", desc: "Digital Extraction with PaddleOCR Fallback", icon: Cpu, color: "text-cyan-400" },
    { title: "Agentic Orchestration", desc: "LangGraph Multi-Agent Workflows", icon: Layers, color: "text-indigo-400" },
    { title: "Deterministic Rules + RAG", desc: "Four Labour Codes & JSON Statutory Rules", icon: Scale, color: "text-amber-400" },
    { title: "Cross-Doc Anomalies", desc: "Multi-register Headcount & Wage Reconciliation", icon: AlertTriangle, color: "text-rose-400" },
    { title: "ML Risk Scoring & SHAP", desc: "Calibrated XGBoost Model & Local Contributions", icon: Activity, color: "text-emerald-400" },
    { title: "Inspector Verification", desc: "Human-in-the-Loop Decisions & Retraining Loop", icon: ShieldCheck, color: "text-purple-400" },
  ];

  const labourCodes = [
    { code_id: "wages_2019", name: "Code on Wages, 2019", act: "Act No. 29 of 2019", key_areas: "Floor Wage, Universal Minimum Wage, Double Overtime, 50% Deduction Ceiling, Form A/B Registers", authority: "Chief Labour Commissioner (Central)" },
    { code_id: "ir_2020", name: "Industrial Relations Code, 2020", act: "Act No. 35 of 2020", key_areas: "Trade Union Recognition, Standing Orders (300+ Threshold), Works Committee, Retrenchment", authority: "Industrial Tribunals / Conciliation Officers" },
    { code_id: "ss_2020", name: "Code on Social Security, 2020", act: "Act No. 36 of 2020", key_areas: "EPFO (20+), ESIC (10+), Gratuity (Fixed-Term Pro-Rata), 26-Wk Maternity, Gig Worker Welfare", authority: "EPFO / ESIC Regional Commissioners" },
    { code_id: "oshwc_2020", name: "OSH & Working Conditions Code, 2020", act: "Act No. 37 of 2020", key_areas: "Factory Threshold (20/40), Safety Committee (250+), 8 Hr Daily Limit, Health Checkups", authority: "Directorate General Factory Advice (DGFASLI)" }
  ];

  return (
    <div className="space-y-10">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Digital Shram Sankalp • PS 05 Research-Grade Prototype
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Agentic AI-Powered Smart Labour Compliance & Inspection Intelligence
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            ShramAI combines <strong className="text-white">Document AI</strong>, <strong className="text-white">Deterministic Statutory Rule Validation</strong>, <strong className="text-white">Four Labour Codes RAG</strong>, and <strong className="text-white">Explainable XGBoost Risk Scoring</strong> to empower both employers with voluntary compliance self-audits and labour inspectors with evidence-backed inspection intelligence.
          </p>

          {/* Direct Portals CTA */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('inspector')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition"
            >
              <FileSearch className="w-4 h-4" />
              <span>Open Inspector Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('employer')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold text-sm transition"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Open Employer Portal</span>
            </button>

            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800 text-xs font-medium transition"
            >
              <span>Test Document Center</span>
            </button>
          </div>
        </div>
      </div>

      {/* Positioning & Ethics Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">
            Official Ecosystem Positioning & Integrity Policy:
          </p>
          <p>
            ShramAI is designed as an intelligence prototype that could integrate alongside unified ecosystems (such as Shram Suvidha). It does not claim to modify official government portals directly. The LLM does not determine statutory guilt; deterministic rule engines validate rules, ML models predict risk, and certified human inspectors make final enforcement determinations.
          </p>
        </div>
      </div>

      {/* The 4 Labour Codes Foundation Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              Ground Truth: The Four Labour Codes of India
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic rule engines and RAG retrieval strictly grounded in enacted Indian labour statutes
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            Statutory Catalog
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {labourCodes.map((code, idx) => (
            <div 
              key={idx} 
              onClick={() => handleOpenCode(code.code_id)}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition flex flex-col justify-between cursor-pointer group shadow-lg"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {code.act}
                  </span>
                  <BookOpen className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
                </div>
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition">{code.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{code.key_areas}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium group-hover:text-amber-300">
                <span>Explore Statutory Sections</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Intelligence Pipeline */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Seven-Stage Intelligence Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              From raw statutory document ingestion to calibrated ML risk scores and explainable inspector briefs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group">
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

      {/* Statutory Code Explorer Modal */}
      {selectedCodeDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedCodeDetails.summary?.title}</h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedCodeDetails.summary?.act_number}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {selectedCodeDetails.summary?.total_sections} Sections across {selectedCodeDetails.summary?.total_chapters} Chapters
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCodeDetails(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Primary Objective & Repealed Acts */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedCodeDetails.summary?.primary_objective}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900">
                  <span className="text-[10px] font-mono text-slate-500 uppercase py-0.5">Amalgamated Acts:</span>
                  {selectedCodeDetails.summary?.repealed_acts?.map((act: string, aIdx: number) => (
                    <span key={aIdx} className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sections Breakdown */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Ground-Truth Statutory Provisions & Penalty Schedules:
                </h3>
                
                <div className="space-y-3">
                  {selectedCodeDetails.sections?.map((sec: any, sIdx: number) => (
                    <div key={sIdx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 hover:border-slate-700 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                            {sec.section_number}
                          </span>
                          <span className="text-sm font-bold text-white">{sec.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{sec.chapter_title}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {sec.statutory_text}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono">
                        {sec.thresholds && (
                          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                            <span className="text-slate-500 block text-[9px] uppercase">Applicability Threshold</span>
                            <span className="text-blue-300 font-medium">{sec.thresholds.applicability_limit}</span>
                          </div>
                        )}
                        {sec.penalties && (
                          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                            <span className="text-slate-500 block text-[9px] uppercase">Statutory Penalty Schedule</span>
                            <span className="text-rose-400 font-medium">1st: {sec.penalties.first_offense_fine} | Sub: {sec.penalties.subsequent_offense}</span>
                          </div>
                        )}
                      </div>

                      {sec.mandatory_registers && sec.mandatory_registers.length > 0 && (
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                          <span className="text-slate-500">Prescribed Register:</span>
                          <span className="text-emerald-400 font-semibold">{sec.mandatory_registers.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
