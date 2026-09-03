import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { InspectorDashboard } from './pages/InspectorDashboard';
import { EstablishmentIntelligence } from './pages/EstablishmentIntelligence';
import { DocumentUploadView } from './pages/DocumentUploadView';
import { AIAssistantDrawer } from './pages/AIAssistantDrawer';
import { fetchHealth, fetchEstablishments, fetchEstablishmentDossier } from './services/api';
import { ActiveRole, SystemHealth, Establishment, EstablishmentDossier } from './types';
import { MOCK_DOSSIER } from './services/mockData';

export default function App() {
  const [activeRole, setActiveRole] = useState<ActiveRole>('landing');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<EstablishmentDossier>(MOCK_DOSSIER);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    // Probe backend health and fetch initial establishments
    fetchHealth().then(setHealth);
    fetchEstablishments().then(setEstablishments);
  }, []);

  const handleSelectEstablishment = async (establishmentId: string) => {
    const dossier = await fetchEstablishmentDossier(establishmentId);
    setSelectedDossier(dossier);
    setActiveRole('establishment-detail');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top GovTech Navbar */}
      <Navbar
        activeRole={activeRole}
        onSelectRole={(role) => setActiveRole(role)}
        health={health}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Routed Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>

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
            FastAPI + React TypeScript + PostgreSQL (pgvector) + XGBoost + LangGraph
          </p>
        </div>
      </footer>
    </div>
  );
}
