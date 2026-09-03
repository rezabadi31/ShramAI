import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  FileSearch, 
  UploadCloud, 
  Bot,
  UserCheck,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { ActiveRole, SystemHealth, Role } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeRole: ActiveRole;
  onSelectRole: (role: ActiveRole) => void;
  health: SystemHealth | null;
  onOpenAssistant: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onSelectRole,
  health,
  onOpenAssistant,
  onOpenLogin,
}) => {
  const { user, switchPersona, logout } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

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
            Inspector Queue
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

        {/* User Persona & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Drawer Trigger */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-900/50 to-indigo-900/50 hover:from-purple-800/60 hover:to-indigo-800/60 text-purple-200 px-3 py-1.5 rounded-lg border border-purple-500/40 shadow-sm transition"
          >
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden sm:inline font-medium">Labour AI</span>
          </button>

          {/* User Persona Switcher Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs transition"
              >
                <div className={`w-2 h-2 rounded-full ${
                  user.role === 'inspector' ? 'bg-blue-400' : user.role === 'employer' ? 'bg-amber-400' : 'bg-purple-400'
                }`} />
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-bold text-slate-200 leading-tight">{user.name}</div>
                  <div className="text-[9px] uppercase font-mono text-slate-400">{user.role}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 space-y-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                    <span className="text-slate-500 font-mono block text-[9px] uppercase">Designation:</span>
                    <span className="text-slate-300 font-medium">{user.designation}</span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 px-3 py-1 block uppercase">
                    Switch Active Role:
                  </span>

                  {(['inspector', 'employer', 'admin'] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchPersona(r);
                        setShowPersonaMenu(false);
                        if (r === 'employer') onSelectRole('employer');
                        if (r === 'inspector') onSelectRole('inspector');
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold capitalize flex items-center justify-between ${
                        user.role === r
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{r}</span>
                      {user.role === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    </button>
                  ))}

                  <div className="pt-1 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        logout();
                        setShowPersonaMenu(false);
                        onOpenLogin();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg transition shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Backend Status Dot */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono bg-slate-950/70 px-2 py-1 rounded-lg border border-slate-800">
            <span className={`w-1.5 h-1.5 rounded-full ${health?.status === 'healthy' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className={health?.status === 'healthy' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {health?.status === 'healthy' ? 'ONLINE' : 'FALLBACK'}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};
