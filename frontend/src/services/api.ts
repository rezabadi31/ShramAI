import { SystemHealth, Establishment, EstablishmentDossier, DocumentRecord } from '../types';
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

export async function uploadDocument(
  file: File,
  category: string,
  establishmentId: string = "EST-001"
): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  formData.append('establishment_id', establishmentId);

  const response = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Upload failed');
  }

  return await response.json();
}

export async function fetchUploadedDocuments(): Promise<DocumentRecord[]> {
  try {
    const response = await fetch(`${API_BASE}/documents`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data.documents.map((d: any) => ({
      id: d.id,
      document_type: d.category,
      filename: d.filename,
      upload_date: d.upload_timestamp.split('T')[0],
      ocr_confidence: d.ocr_confidence,
      status: d.status,
      pages: d.pages,
      extracted_records: 50,
    }));
  } catch (error) {
    console.warn('Failed to fetch real documents, using fallback:', error);
    return MOCK_DOSSIER.documents;
  }
}
