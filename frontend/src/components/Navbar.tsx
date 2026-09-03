import React from 'react';
import { 
  ShieldCheck, 
  Building2, 
  FileSearch, 
  UploadCloud, 
  ExternalLink,
  Bot
} from 'lucide-react';
import { ActiveRole, SystemHealth } from '../types';

interface NavbarProps {
  activeRole: ActiveRole;
  onSelectRole: (role: ActiveRole) => void;
  health: SystemHealth | null;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onSelectRole,
  health,
  onOpenAssistant,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tag */}
        <div 
          onClick={() => onSelectRole('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-blue-600 to-emerald-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-slate-100 to-emerald-400">
                ShramAI
              </span>
              <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                PS 05 Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Digital Shram Sankalp • Labour Compliance Intelligence
            </p>
          </div>
        </div>

        {/* Role & Screen Navigation Switcher */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onSelectRole('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeRole === 'landing'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectRole('employer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeRole === 'employer'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            Employer Portal
          </button>
          <button
            onClick={() => onSelectRole('inspector')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeRole === 'inspector' || activeRole === 'establishment-detail'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5 text-blue-400" />
            Inspector Dashboard
          </button>
          <button
            onClick={() => onSelectRole('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeRole === 'upload'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
            Document Center
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Drawer Trigger */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-900/50 to-indigo-900/50 hover:from-purple-800/60 hover:to-indigo-800/60 text-purple-200 px-3 py-1.5 rounded-lg border border-purple-500/40 shadow-sm transition"
          >
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden sm:inline font-medium">Labour AI Assistant</span>
          </button>

          {/* Backend Status Pill */}
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950/70 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${health?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="hidden sm:inline text-slate-400">API:</span>
            <span className={health?.status === 'healthy' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {health?.status === 'healthy' ? 'ONLINE' : 'FALLBACK'}
            </span>
          </div>

          <a 
            href="http://127.0.0.1:8000/docs" 
            target="_blank" 
            rel="noreferrer" 
            title="FastAPI Swagger Documentation"
            className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-800 transition"
          >
            <span>Swagger</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>

      </div>
    </header>
  );
};
