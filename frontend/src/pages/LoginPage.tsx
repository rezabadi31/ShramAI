import React, { useState } from 'react';
import { ShieldCheck, Lock, UserCheck, Building2, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, switchPersona } = useAuth();
  const [email, setEmail] = useState('inspector@shram.gov.in');
  const [password, setPassword] = useState('Inspector@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/auth/login/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      login(data.email, data.role as Role, data.name, data.access_token);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = (role: Role) => {
    switchPersona(role);
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto my-12 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
      
      {/* GovTech Seal */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-blue-600 to-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-extrabold text-white">ShramAI Secure Authentication</h1>
        <p className="text-xs text-slate-400">
          Role-Based Access Control • Central Labour Sphere Portal
        </p>
      </div>

      {/* Quick Demo Switcher Buttons */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold block">
          One-Click Demo Personas:
        </span>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => handleQuickPersona('inspector')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs font-semibold transition"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Inspector (S. K. Sharma)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickPersona('employer')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold transition"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Employer (ABC Industries Ltd.)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickPersona('admin')}
            className="flex items-center justify-between p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-semibold transition"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Admin (Chief Enforcement Officer)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Manual Credentials Form */}
      <form onSubmit={handleCustomLogin} className="space-y-4 pt-2 border-t border-slate-800">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Authorized Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{loading ? 'Authenticating...' : 'Sign In with Credentials'}</span>
        </button>
      </form>

    </div>
  );
};
