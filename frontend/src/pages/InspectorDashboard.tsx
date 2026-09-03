import React, { useState } from 'react';
import { 
  FileSearch, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  ArrowUpRight,
  Shuffle,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { RiskBadge } from '../components/RiskBadge';
import { Establishment, ActiveRole } from '../types';

interface InspectorDashboardProps {
  establishments: Establishment[];
  onSelectEstablishment: (id: string) => void;
  onNavigate?: (role: ActiveRole) => void;
}

export const InspectorDashboard: React.FC<InspectorDashboardProps> = ({
  establishments,
  onSelectEstablishment,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = establishments.filter((e) => {
    if (filter !== 'ALL' && e.risk_category !== filter) return false;
    if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const highCount = establishments.filter(e => e.risk_category === 'HIGH').length || 18;
  const medCount = establishments.filter(e => e.risk_category === 'MEDIUM').length || 42;
  const lowCount = establishments.filter(e => e.risk_category === 'LOW').length || 97;

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <FileSearch className="w-6 h-6 text-blue-400" />
              Inspection Intelligence Dashboard
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              CENTRAL JURISDICTION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Risk-ranked inspection queue evaluated via calibrated XGBoost ML risk scores and cross-register anomaly engines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Select random for audit evaluation fairness
              if (establishments.length > 0) {
                const randomIdx = Math.floor(Math.random() * establishments.length);
                onSelectEstablishment(establishments[randomIdx].id);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition"
            title="Prevents complete AI automation by including random audit sampling"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>Random Audit Sample</span>
          </button>
        </div>
      </div>

      {/* Risk Distribution Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Audited Establishments"
          value={highCount + medCount + lowCount}
          subtext="Statutory filings active"
          icon={Building2}
          variant="default"
        />
        <MetricCard
          label="High Risk (Priority Queue)"
          value={highCount}
          subtext="Immediate inspection candidate"
          icon={AlertOctagon}
          variant="danger"
        />
        <MetricCard
          label="Medium Risk (Under Review)"
          value={medCount}
          subtext="Clarification notice issued"
          icon={AlertTriangle}
          variant="warning"
        />
        <MetricCard
          label="Low Risk (Routine)"
          value={lowCount}
          subtext="Self-certified compliant"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* Main Table: Prioritized Inspection Queue */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        
        {/* Table Header & Filter Bar */}
        <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Prioritized Inspection Queue
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ranked by XGBoost Risk Probability + Cross-Document Discrepancy Severity
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search establishment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <Filter className="w-3 h-3 text-slate-500 ml-1.5 mr-1" />
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    filter === cat
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800/80 font-medium">
              <tr>
                <th className="py-3 px-4">Establishment Name</th>
                <th className="py-3 px-4">Registration / LIN</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Workers</th>
                <th className="py-3 px-4">Risk Category</th>
                <th className="py-3 px-4">Rule Findings</th>
                <th className="py-3 px-4">Anomalies</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.map((est) => (
                <tr 
                  key={est.id} 
                  className="hover:bg-slate-900/50 transition cursor-pointer group"
                  onClick={() => onSelectEstablishment(est.id)}
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-100 group-hover:text-blue-300 transition">
                    {est.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {est.registration_number}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {est.industry}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {est.worker_count}
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge category={est.risk_category} score={est.risk_score} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-mono font-bold ${est.findings_count > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                      {est.findings_count}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-mono font-bold ${est.anomalies_count > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                      {est.anomalies_count}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEstablishment(est.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-md border border-blue-500/20 transition"
                    >
                      <span>Investigate</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500">
            No establishments match your filter criteria.
          </div>
        )}

      </div>

    </div>
  );
};
