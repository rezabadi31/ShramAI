import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { InspectorDashboard } from './pages/InspectorDashboard';
import { EstablishmentIntelligence } from './pages/EstablishmentIntelligence';
import { DocumentUploadView } from './pages/DocumentUploadView';
import { AIAssistantDrawer } from './pages/AIAssistantDrawer';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { fetchHealth, fetchEstablishments, fetchEstablishmentDossier } from './services/api';
import { ActiveRole, SystemHealth, Establishment, EstablishmentDossier } from './types';
import { MOCK_DOSSIER } from './services/mockData';
import { Lock, ShieldAlert } from 'lucide-react';

function AppContent() {
  const { user, switchPersona } = useAuth();
  const [activeRole, setActiveRole] = useState<ActiveRole>('landing');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<EstablishmentDossier>(MOCK_DOSSIER);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchHealth().then(setHealth);
    fetchEstablishments().then(setEstablishments);
  }, []);

  const handleSelectEstablishment = async (establishmentId: string) => {
    const dossier = await fetchEstablishmentDossier(establishmentId);
    setSelectedDossier(dossier);
    setActiveRole('establishment-detail');
  };

  // RBAC Guard: If user is Employer trying to access Inspector queue/intelligence
  const isInspectorRoute = activeRole === 'inspector' || activeRole === 'establishment-detail';
  const isBlockedForEmployer = isInspectorRoute && user?.role === 'employer';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top GovTech Navbar */}
      <Navbar
        activeRole={activeRole}
        onSelectRole={(role) => setActiveRole(role)}
        health={health}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      {/* Main Routed Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Role Guard Warning if Employer tries to access Inspector Queue */}
        {isBlockedForEmployer ? (
          <div className="max-w-xl mx-auto my-12 glass-panel p-8 rounded-3xl border border-rose-500/30 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Inspector Queue Restricted Area</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                You are currently signed in as an <strong className="text-amber-400">Employer</strong> ({user?.name}). Statutory enforcement queues and inspector risk algorithms require authorized enforcement officer credentials.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => switchPersona('inspector')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Switch to Inspector Persona</span>
              </button>
              <button
                onClick={() => setActiveRole('employer')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Return to Employer Portal
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeRole === 'landing' && (
              <LandingPage 
                onNavigate={(role) => setActiveRole(role)} 
                health={health} 
              />
            )}

            {activeRole === 'employer' && (
              <EmployerDashboard 
                onNavigate={(role) => setActiveRole(role)}
                onOpenAssistant={() => setIsAssistantOpen(true)}
              />
            )}

            {activeRole === 'inspector' && (
              <InspectorDashboard
                establishments={establishments}
                onSelectEstablishment={handleSelectEstablishment}
                onNavigate={(role) => setActiveRole(role)}
              />
            )}

            {activeRole === 'establishment-detail' && (
              <EstablishmentIntelligence
                dossier={selectedDossier}
                onBack={() => setActiveRole('inspector')}
                onNavigate={(role) => setActiveRole(role)}
              />
            )}

            {activeRole === 'upload' && (
              <DocumentUploadView />
            )}
          </>
        )}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>
            <LoginPage onSuccess={() => setShowLoginModal(false)} />
          </div>
        </div>
      )}

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* GovTech Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            ShramAI • Digital Shram Sankalp PS 05 Research-Grade Prototype
          </p>
          <p className="font-mono text-[11px]">
            FastAPI + React TypeScript + JWT RBAC + PostgreSQL (pgvector) + XGBoost + LangGraph
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
