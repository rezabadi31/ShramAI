import React, { useState } from 'react';
import { 
  Building2, 
  FileCheck2, 
  AlertCircle, 
  FileWarning, 
  UploadCloud, 
  ArrowRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { ActiveRole } from '../types';

interface EmployerDashboardProps {
  onNavigate: (role: ActiveRole) => void;
  onOpenAssistant: () => void;
}

export const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ onNavigate, onOpenAssistant }) => {
  const [establishment] = useState({
    name: "ABC Industries Ltd.",
    lin: "1928374650",
    regNo: "DL-2024-EM-9921",
    score: 72,
    submittedCount: 12,
    missingCount: 3,
    issuesCount: 5,
  });

  const statutoryRegisters = [
    { name: "Form B Wage Register (Oct 2024)", status: "Submitted & Audited", date: "15 Oct 2024", badge: "2 Issues Found", badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { name: "Attendance Muster Roll (Oct 2024)", status: "Submitted & Audited", date: "15 Oct 2024", badge: "1 Issue Found", badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { name: "Employee Register Form A (2024)", status: "Verified Active", date: "01 Sep 2024", badge: "Compliant", badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { name: "Bank Payout Reconciliation Scroll", status: "Submitted", date: "16 Oct 2024", badge: "Reconciled", badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  ];

  const missingChecklist = [
    { title: "Quarterly Safety Committee Audit Minutes", code: "OSH&WC Code 2020", deadline: "Overdue by 14 days", severity: "HIGH" },
    { title: "Maternity Benefit Register (Form G)", code: "Social Security Code 2020", deadline: "Due in 6 days", severity: "MEDIUM" },
    { title: "Overtime Hours Authorization Register", code: "Code on Wages 2019", deadline: "Due in 12 days", severity: "MEDIUM" },
  ];

  const correctiveActions = [
    {
      issue: "Daily wage for 3 Unskilled Helpers fell below statutory floor",
      ref: "Code on Wages 2019, Section 6",
      action: "Review Shift B wage entries and disburse statutory wage differential arrears (Rs 40/day difference).",
      priority: "CRITICAL",
    },
    {
      issue: "Headcount gap: 5 workers on muster roll not reflected on wage register",
      ref: "Code on Wages 2019, Section 50",
      action: "Upload updated wage disbursement scroll or contractor invoice matching the 5 muster roll workers.",
      priority: "HIGH",
    },
    {
      issue: "Missing statutory safety audit logbook for pressing shop",
      ref: "OSH&WC Code 2020, Section 28",
      action: "Upload the verified internal machinery inspection report signed by the safety officer.",
      priority: "MEDIUM",
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Profile Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/10">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{establishment.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                LIN: {establishment.lin}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Labour Registration ID: <span className="font-mono text-slate-300">{establishment.regNo}</span> • Jurisdiction: Central Sphere
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition shadow-md shadow-amber-500/20"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Submit Registers</span>
          </button>
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
          >
            <span>Ask Compliance AI</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Voluntary Compliance Score"
          value={`${establishment.score} / 100`}
          subtext="Moderate Risk • Requires Remediation"
          icon={ShieldAlert}
          variant="warning"
        />
        <MetricCard
          label="Statutory Registers Filed"
          value={establishment.submittedCount}
          subtext="Active for current audit quarter"
          icon={FileCheck2}
          variant="success"
        />
        <MetricCard
          label="Missing Statutory Filings"
          value={establishment.missingCount}
          subtext="1 Overdue • 2 Approaching"
          icon={FileWarning}
          variant="danger"
        />
        <MetricCard
          label="Flagged Compliance Issues"
          value={establishment.issuesCount}
          subtext="Wages (3), Attendance (1), Safety (1)"
          icon={AlertCircle}
          variant="warning"
        />
      </div>

      {/* Main Grid: Registers Status & Remediation Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Remediation Actions & Register Status */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Proactive Remediation Action Plan */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Recommended Corrective Actions (Prevent Inspection Flags)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Resolve these flagged discrepancies prior to statutory inspector queue selection
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {correctiveActions.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {correctiveActions.map((item, idx) => (
                <div key={idx} className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      {item.issue}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Action:</strong> {item.action}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-amber-400 font-mono">{item.ref}</span>
                    <button 
                      onClick={() => onNavigate('upload')}
                      className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                    >
                      <span>Upload Proof</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Registers Table */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  Statutory Register Submissions
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audit results from automated Document AI and deterministic rule check
                </p>
              </div>
              <button 
                onClick={() => onNavigate('upload')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                + New Upload
              </button>
            </div>

            <div className="space-y-2.5">
              {statutoryRegisters.map((reg, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-200">{reg.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Last processed: {reg.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded border font-mono ${reg.badgeColor}`}>
                      {reg.badge}
                    </span>
                    <span className="text-slate-400 text-[11px] hidden sm:inline">{reg.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Missing Checklist & Voluntary Compliance Banner */}
        <div className="space-y-6">
          
          {/* Missing Documents Alert Box */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileWarning className="w-4 h-4 text-rose-400" />
                Missing Statutory Documents
              </h2>
              <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Action Required
              </span>
            </div>

            <div className="space-y-3">
              {missingChecklist.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xs text-slate-200">{m.title}</p>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded">
                      {m.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-400 font-mono">{m.code}</p>
                  <p className="text-[11px] text-slate-400">{m.deadline}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('upload')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              Resolve Missing Filings
            </button>
          </div>

          {/* AI Voluntary Compliance Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-blue-950/40 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Proactive Compliance Benefit</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Establishments that maintain a score above <strong className="text-white">80/100</strong> are automatically deprioritized by the ML risk classifier for routine inspections.
            </p>
            <div className="pt-2 border-t border-indigo-500/20 flex items-center justify-between text-[11px] text-indigo-300">
              <span>Current Score: <strong className="font-mono text-white">{establishment.score}</strong></span>
              <span>Target: <strong className="font-mono text-emerald-400">85+</strong></span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
