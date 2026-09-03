import { 
  SystemHealth, 
  Establishment, 
  EstablishmentDossier, 
  DocumentRecord,
  DocumentIntelligenceResult 
} from '../types';
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

export async function fetchExtractionResult(documentId: string): Promise<DocumentIntelligenceResult> {
  try {
    const response = await fetch(`${API_BASE}/documents/${documentId}/extraction`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return {
      document_id: documentId,
      document_type: "Wage Register (Form B)",
      filename: "ABC_Wage_Register_Oct2024.pdf",
      pages: 14,
      overall_confidence: 0.94,
      extraction_method: "DIRECT_TEXT_EXTRACTION",
      tables: [
        {
          table_name: "Form B Statutory Wage Register",
          headers: ["sl_no", "employee_id", "name", "daily_rate", "days_worked", "net_payable"],
          row_count: 4,
          rows: [
            {
              row_index: 1,
              values: { sl_no: 1, employee_id: "EMP-001", name: "Ramesh Kumar", daily_rate: 650, days_worked: 26, net_payable: 16200 },
              provenance: { document_id: documentId, page: 1, table_index: 0, confidence: 0.96 }
            },
            {
              row_index: 2,
              values: { sl_no: 2, employee_id: "EMP-002", name: "Sunita Devi", daily_rate: 550, days_worked: 25, net_payable: 12550 },
              provenance: { document_id: documentId, page: 1, table_index: 0, confidence: 0.95 }
            },
            {
              row_index: 3,
              values: { sl_no: 3, employee_id: "EMP-003", name: "Rajesh K. (Helper)", daily_rate: 310, days_worked: 26, net_payable: 7260 },
              provenance: { document_id: documentId, page: 4, table_index: 0, confidence: 0.91 }
            },
            {
              row_index: 4,
              values: { sl_no: 4, employee_id: "EMP-004", name: "Amit Verma", daily_rate: 720, days_worked: 24, net_payable: 17000 },
              provenance: { document_id: documentId, page: 2, table_index: 0, confidence: 0.94 }
            }
          ]
        }
      ],
      extracted_records_count: 4,
      raw_text_sample: "FORM B - REGISTER OF WAGES [Rule 78(1)(a)(i)]\nEstablishment: ABC Industries Ltd. | Month: October 2024\nSl | Emp ID | Employee Name | Wage Rate | Days Worked | Net Paid\n1 | EMP-001 | Ramesh Kumar | 650.00 | 26 | 16200.00"
    };
  }
}

export async function classifyDocument(documentId: string): Promise<any> {
  const response = await fetch(`${API_BASE}/documents/${documentId}/classify`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Classification failed');
  }
  return await response.json();
}

export async function classifyText(text: string, filename?: string): Promise<any> {
  const response = await fetch(`${API_BASE}/documents/classify-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, filename }),
  });
  if (!response.ok) {
    throw new Error('Text classification failed');
  }
  return await response.json();
}
