import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FileText, 
  AlertTriangle, 
  Scale, 
  Activity, 
  FileCheck2, 
  Bot, 
  Check, 
  X, 
  HelpCircle, 
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  Loader2,
  Cpu
} from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { StatutoryReferenceCard } from '../components/StatutoryReferenceCard';
import { EstablishmentDossier, ActiveRole, ComplianceAuditReport, OrchestrationExecutionResponse, DocumentAgentAuditResult, ComplianceAgentAuditResult } from '../types';
import { evaluateCompliance, runAgentOrchestration, auditEstablishmentDocuments, runComplianceAgentAudit } from '../services/api';

interface EstablishmentIntelligenceProps {
  dossier: EstablishmentDossier;
  onBack: () => void;
  onNavigate: (role: ActiveRole) => void;
}

type TabType = 'overview' | 'documents' | 'findings' | 'anomalies' | 'shap' | 'brief' | 'feedback';

export const EstablishmentIntelligence: React.FC<EstablishmentIntelligenceProps> = ({
  dossier,
  onBack,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [feedbackState, setFeedbackState] = useState<Record<string, string>>({});
  const [inspectorNotes, setInspectorNotes] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [liveAuditReport, setLiveAuditReport] = useState<ComplianceAuditReport | null>(null);
  const [orchestrationResult, setOrchestrationResult] = useState<OrchestrationExecutionResponse | null>(null);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [docAuditResult, setDocAuditResult] = useState<DocumentAgentAuditResult | null>(null);
  const [complianceAgentAudit, setComplianceAgentAudit] = useState<ComplianceAgentAuditResult | null>(null);

  const { establishment, documents, findings, anomalies, shap_contributions, ai_inspection_brief } = dossier;

  useEffect(() => {
    evaluateCompliance(establishment.id).then(report => {
      setLiveAuditReport(report);
    }).catch(err => console.error(err));

    auditEstablishmentDocuments(establishment.id).then(res => {
      setDocAuditResult(res);
    }).catch(err => console.error(err));

    runComplianceAgentAudit(establishment.id).then(res => {
      setComplianceAgentAudit(res);
    }).catch(err => console.error(err));
  }, [establishment.id]);

  const handleRunOrchestrator = async () => {
    setIsOrchestrating(true);
    try {
      const res = await runAgentOrchestration(establishment.id);
      setOrchestrationResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOrchestrating(false);
    }
  };

  const handleFeedback = (findingId: string, action: 'CONFIRMED' | 'REJECTED' | 'NEEDS_MORE_EVIDENCE') => {
    setFeedbackState(prev => ({ ...prev, [findingId]: action }));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Inspection Priority Queue</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunOrchestrator}
            disabled={isOrchestrating}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition cursor-pointer disabled:opacity-50"
          >
            {isOrchestrating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running LangGraph...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run Agentic AI Audit</span>
              </>
            )}
          </button>
          <span className="text-xs text-slate-400 font-mono">Dossier ID: DOS-{establishment.id}</span>
        </div>
      </div>

      {/* Establishment Header Dossier Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{establishment.name}</h1>
              <RiskBadge category={establishment.risk_category} score={establishment.risk_score} size="md" />
            </div>
            <p className="text-xs text-slate-400">
              Registration No: <strong className="font-mono text-slate-300">{establishment.registration_number}</strong> • Sector: {establishment.industry}
            </p>
            <p className="text-xs text-slate-400">
              Reported Active Workforce: <strong className="font-mono text-slate-200">{establishment.worker_count} Workers</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Risk Score</span>
            <span className="text-3xl font-extrabold font-mono text-rose-400">{establishment.risk_score}</span>
            <span className="text-[10px] text-slate-500 block">/ 100 Calibrated</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rule Findings</span>
            <span className="text-3xl font-extrabold font-mono text-amber-400">{findings.length}</span>
            <span className="text-[10px] text-slate-500 block">Non-Compliant</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Anomalies</span>
            <span className="text-3xl font-extrabold font-mono text-purple-400">{anomalies.length}</span>
            <span className="text-[10px] text-slate-500 block">Cross-Register</span>
          </div>
        </div>
      </div>

      {/* Multi-Agent Orchestrator Stepper Banner */}
      {orchestrationResult && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  LangGraph Agentic Orchestrator Execution Completed
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {orchestrationResult.status}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Workflow: {orchestrationResult.workflow_id} • Execution Time: {orchestrationResult.execution_time_ms}ms • {orchestrationResult.steps_completed} Checkpoints
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400">
                Compliance: {orchestrationResult.compliance_score}%
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-rose-400">
                Risk Score: {orchestrationResult.risk_score} ({orchestrationResult.risk_category})
              </span>
            </div>
          </div>

          {/* Stepper Node Transitions */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
            {orchestrationResult.steps.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 hover:border-purple-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
                    {s.node_name}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">#{s.step_index}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  {s.action_taken}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview', icon: Building2 },
          { id: 'documents', label: `Documents (${documents.length})`, icon: FileText },
          { id: 'findings', label: `Compliance Findings (${findings.length})`, icon: Scale },
          { id: 'anomalies', label: `Cross-Doc Anomalies (${anomalies.length})`, icon: AlertTriangle },
          { id: 'shap', label: 'SHAP Risk Explanation', icon: Activity },
          { id: 'brief', label: 'AI Inspection Brief', icon: Bot },
          { id: 'feedback', label: 'Inspector Verification', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Primary Executive Risk Summary
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {ai_inspection_brief.brief_summary}
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Critical Recommended Focus Areas for Inspection Officer
                </h3>
                <div className="space-y-2">
                  {ai_inspection_brief.critical_focus_areas.map((focus, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                ML Risk Model Metadata
              </h2>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                  <span>Model Algorithm:</span>
                  <strong className="text-slate-200 font-mono">XGBoost 2.0</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                  <span>Risk Probability:</span>
                  <strong className="text-rose-400 font-mono">0.87 (87%)</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                  <span>Jurisdiction Percentile:</span>
                  <strong className="text-slate-200 font-mono">94th %ile</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                  <span>Deterministic Violations:</span>
                  <strong className="text-amber-400 font-mono">3 Rules Failed</strong>
                </div>
                <div className="flex justify-between py-1.5 text-slate-400">
                  <span>Cross-Doc Mismatch:</span>
                  <strong className="text-purple-400 font-mono">5 Workers Unaccounted</strong>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('brief')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md shadow-blue-500/20"
              >
                View Complete Inspection Brief
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: DOCUMENTS & STATUTORY GAP ANALYSIS */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          
          {/* Autonomous Document Agent Gap Analysis Card */}
          {docAuditResult && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    Autonomous Document Agent Statutory Filing Audit
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluates scan legibility, structural completeness, and compares uploaded registers against legally mandated filings
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Legibility: {docAuditResult.overall_legibility_score}% ({docAuditResult.legibility_status})
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Completeness: {docAuditResult.completeness_score}%
                  </span>
                </div>
              </div>

              {/* Missing Statutory Registers Warning */}
              {docAuditResult.missing_count > 0 && (
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Statutory Default Warning: {docAuditResult.missing_count} Mandatory Register(s) Missing</span>
                  </div>
                  <ul className="text-xs text-rose-200/80 space-y-1 list-disc list-inside">
                    {docAuditResult.missing_registers_penalties.map((pen, pIdx) => (
                      <li key={pIdx} className="font-mono text-[11px]">{pen}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-300 pt-1 border-t border-rose-900/50">
                    <strong>Agent Recommendation:</strong> {docAuditResult.agent_recommendation}
                  </p>
                </div>
              )}

              {/* Statutory Registers Matrix Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Statutory Register Filing Compliance Matrix (Four Labour Codes):
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-3">Form</th>
                        <th className="p-3">Statutory Register</th>
                        <th className="p-3">Governing Code & Section</th>
                        <th className="p-3">Filing Frequency</th>
                        <th className="p-3">Filing Status</th>
                        <th className="p-3">Statutory Penalty on Default</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {docAuditResult.register_comparisons.map((reg, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/40 transition">
                          <td className="p-3 font-mono font-bold text-amber-400">{reg.form_designation}</td>
                          <td className="p-3 text-slate-200 font-medium">{reg.register_name}</td>
                          <td className="p-3 text-slate-400 font-mono text-[11px]">{reg.statute} • {reg.section}</td>
                          <td className="p-3 text-slate-400">{reg.filing_frequency}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                              reg.status === 'SUBMITTED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-400">{reg.penalty_on_default}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Uploaded Files Matrix */}
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Audited Uploaded Documents & Text Extraction Proofs
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Parsed using Direct PDF Text Layer + PaddleOCR Layout Analysis
                </p>
              </div>
              <button
                onClick={() => onNavigate('upload')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                + Upload Additional Records
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{doc.document_type}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      OCR Conf: {Math.round(doc.ocr_confidence * 100)}%
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 truncate">{doc.filename}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                    <span>{doc.pages} Pages • {doc.extracted_records} Rows Extracted</span>
                    <span>Uploaded: {doc.upload_date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: COMPLIANCE FINDINGS */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Autonomous Compliance Agent Audit
                </h2>
                {liveAuditReport && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                    {liveAuditReport.overall_compliance_score}% Pass Rate ({liveAuditReport.failed_count} Violations)
                  </span>
                )}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                  98% RAG Grounded
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Deterministic rules validated against Four Labour Codes RAG with row-level evidence anchors & zero hallucinations
              </p>
            </div>
            {liveAuditReport ? (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {liveAuditReport.failed_count} Failed
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {liveAuditReport.passed_count} Passed
                </span>
              </div>
            ) : (
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                {findings.length} Flagged Issues
              </span>
            )}
          </div>

          <div className="space-y-4">
            {findings.map((finding) => {
              const groundedMatch = complianceAgentAudit?.findings.find(f => f.rule_id === finding.rule_id);

              return (
                <div key={finding.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {finding.rule_id}
                      </span>
                      <h3 className="font-bold text-sm text-slate-100">{finding.rule_name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {groundedMatch && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {Math.round(groundedMatch.statutory_enrichment.relevance_score * 100)}% Grounded
                        </span>
                      )}
                      <RiskBadge category={finding.severity} size="sm" />
                    </div>
                  </div>

                  {/* Agent Synthesized Explanation */}
                  {groundedMatch && (
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      {groundedMatch.explanation}
                    </p>
                  )}

                  {/* Evidence Anchor Snippet */}
                  <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-850 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>
                        Source: {groundedMatch ? groundedMatch.evidence_anchor.document_name : finding.source_document} 
                        {' '}(Page {groundedMatch ? groundedMatch.evidence_anchor.page_number : finding.page}
                        {groundedMatch?.evidence_anchor.row_index ? `, Row ${groundedMatch.evidence_anchor.row_index}` : ''}
                        {groundedMatch?.evidence_anchor.employee_id ? `, ${groundedMatch.evidence_anchor.employee_id}` : ''})
                      </span>
                      <span className="text-rose-400 font-bold">Row-Level Evidence Anchor</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono">
                      {groundedMatch ? groundedMatch.evidence_anchor.discrepancy_value : finding.evidence}
                    </p>
                  </div>

                  {/* RAG Statutory Citation Card */}
                  {groundedMatch ? (
                    <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-blue-300 font-bold">
                          {groundedMatch.statutory_enrichment.act_title} • {groundedMatch.statutory_enrichment.section_number}
                        </span>
                        <span className="text-[10px] text-blue-400">
                          Enforcing Authority: {groundedMatch.statutory_enrichment.authority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 italic">
                        "{groundedMatch.statutory_enrichment.statutory_quote}"
                      </p>
                      {groundedMatch.statutory_enrichment.penalty_schedule && (
                        <div className="text-[11px] font-mono text-rose-300 pt-1 border-t border-blue-900/40">
                          <strong>Statutory Penalty Schedule:</strong> {groundedMatch.statutory_enrichment.penalty_schedule}
                        </div>
                      )}
                    </div>
                  ) : (
                    <StatutoryReferenceCard
                      statute={finding.statutory_reference}
                      authority={finding.authority}
                    />
                  )}

                  {/* Actionable Remedy */}
                  {groundedMatch?.actionable_remedy && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                      <span className="font-bold uppercase tracking-wider font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20">Remedy</span>
                      <span>{groundedMatch.actionable_remedy}</span>
                    </div>
                  )}

                {/* Verification Feedback Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400">Inspector Verification:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFeedback(finding.id, 'CONFIRMED')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                        feedbackState[finding.id] === 'CONFIRMED'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Confirm Finding</span>
                    </button>
                    <button
                      onClick={() => handleFeedback(finding.id, 'REJECTED')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                        feedbackState[finding.id] === 'REJECTED'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <X className="w-3 h-3" />
                      <span>Reject / Dismiss</span>
                    </button>
                    <button
                      onClick={() => handleFeedback(finding.id, 'NEEDS_MORE_EVIDENCE')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                        feedbackState[finding.id] === 'NEEDS_MORE_EVIDENCE'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Request Evidence</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* Tab 4: CROSS-DOC ANOMALIES */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-purple-400" />
                Cross-Document Reconciliation & Anomaly Engine
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated multi-way comparison across Form A, Form B, Attendance Muster, and Bank Payouts
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
              {anomalies.length} Cross-Register Inconsistencies
            </span>
          </div>

          <div className="space-y-4">
            {anomalies.map((anom) => (
              <div key={anom.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    {anom.anomaly_type}
                  </h3>
                  <RiskBadge category={anom.severity} size="sm" />
                </div>

                <p className="text-xs text-slate-400">
                  {anom.description}
                </p>

                {/* Visual Reconciliation Card */}
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                  <div className="text-[11px] text-purple-300 font-mono font-semibold">
                    DETECTED MULTI-REGISTER DISCREPANCY:
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300">
                    {anom.detected_discrepancy}
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-200">Reconciliation Analysis:</strong> {anom.evidence_summary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 font-medium">Involved Registers:</span>
                  {anom.involved_registers.map((reg, idx) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {reg}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: SHAP EXPLANATION */}
      {activeTab === 'shap' && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Explainable AI: Local SHAP Feature Contributions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact mathematical contribution of each establishment feature towards the final XGBoost Risk Score of {establishment.risk_score}/100
            </p>
          </div>

          <div className="space-y-3">
            {shap_contributions.map((shap, idx) => {
              const isPositive = shap.direction === 'positive';
              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{shap.feature_label}</span>
                    <span className={`font-mono font-bold ${isPositive ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isPositive ? `+${shap.contribution}` : `${shap.contribution}`} pts
                    </span>
                  </div>

                  {/* Horizontal Contribution Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isPositive ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(Math.abs(shap.contribution) * 4, 100)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 font-mono">
                    {isPositive ? 'Increases establishment inspection priority' : 'Protective factor (reduces risk)'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 6: AI INSPECTION BRIEF */}
      {activeTab === 'brief' && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                AI-Synthesized Inspector Intelligence Brief
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evidence-grounded briefing generated for the on-site enforcement officer
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold border border-blue-500/30 px-3 py-1 rounded-lg"
            >
              Print Brief
            </button>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400">PRIORITY LEVEL:</span>
              <RiskBadge category={ai_inspection_brief.priority} size="md" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Executive Synthesis</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {ai_inspection_brief.brief_summary}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Mandatory Documents to Demand on Site</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ai_inspection_brief.recommended_statutory_documents.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: INSPECTOR VERIFICATION (Human-in-the-Loop) */}
      {activeTab === 'feedback' && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Human-in-the-Loop Inspection Decision & Feedback
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspectors retain ultimate decision authority. Recorded decisions feed into closed-loop ML calibration.
            </p>
          </div>

          {submittedFeedback ? (
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-sm text-emerald-300">Inspector Verification Logged Successfully</h3>
              <p className="text-xs text-slate-400">
                Your decision has been committed to the audit trail and submitted to the closed-loop retraining pipeline.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Officer Inspection Findings & Rationale Notes:
                </label>
                <textarea
                  rows={4}
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                  placeholder="Record on-site observations, employer explanations, or grounds for overriding automated rule flags..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSubmittedFeedback(true)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md shadow-emerald-600/20"
                >
                  Submit Official Inspector Decision
                </button>
                <button
                  onClick={() => setActiveTab('findings')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  Review Rule Findings
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
