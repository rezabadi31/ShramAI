import { SystemHealth, Establishment, EstablishmentDossier } from '../types';
import { MOCK_ESTABLISHMENTS, MOCK_DOSSIER } from './mockData';

const API_BASE = '/api/v1';

export async function fetchHealth(): Promise<SystemHealth> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return {
      status: 'offline',
      project: 'ShramAI',
      version: '0.1.0',
      environment: 'development',
      services: {
        document_ai: 'offline fallback',
        rule_engine: 'offline fallback',
        cross_document_anomaly: 'offline fallback',
        ml_risk_engine: 'offline fallback',
        agent_orchestrator: 'offline fallback',
        rag_retrieval: 'offline fallback',
      },
    };
  }
}

export async function fetchEstablishments(): Promise<Establishment[]> {
  try {
    const response = await fetch(`${API_BASE}/establishments`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend API unreachable, using mock establishments:', error);
    return MOCK_ESTABLISHMENTS;
  }
}

export async function fetchEstablishmentDossier(establishmentId: string): Promise<EstablishmentDossier> {
  try {
    const response = await fetch(`${API_BASE}/establishments/${establishmentId}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend API unreachable, using mock dossier:', error);
    return MOCK_DOSSIER;
  }
}
