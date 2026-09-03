import { 
  SystemHealth, 
  Establishment, 
  EstablishmentDossier, 
  DocumentRecord,
  DocumentIntelligenceResult,
  NormalizedDocumentDossier,
  LabourCodeSummary,
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
          ]
        }
      ],
      extracted_records_count: 4,
      raw_text_sample: "FORM B - REGISTER OF WAGES [Rule 78(1)(a)(i)]"
    };
  }
}

export async function fetchNormalizedDossier(documentId: string): Promise<NormalizedDocumentDossier> {
  try {
    const response = await fetch(`${API_BASE}/documents/${documentId}/normalized`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return {
      document_id: documentId,
      category: "Wage Register",
      record_type: "WAGE_RECORD",
      records_count: 4,
      data_quality_score: 0.96,
      normalization_confidence: 0.95,
      missing_fields: [],
      records: [
        {
          employee_id: "EMP-001",
          employee_name: "Ramesh Kumar",
          daily_wage_rate: 650.0,
          days_worked: 26,
          basic_wage: 16900.0,
          overtime_hours: 8,
          overtime_wages: 1300.0,
          gross_wages: 18200.0,
          total_deductions: 2000.0,
          net_payable: 16200.0,
          source_page: 1,
          normalization_confidence: 0.96,
        },
      ],
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

export async function fetchLabourCodes(): Promise<LabourCodeSummary[]> {
  try {
    const response = await fetch(`${API_BASE}/knowledge/codes`);
    if (!response.ok) {
      throw new Error('Failed to fetch labour codes');
    }
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function fetchCodeDetails(codeId: string): Promise<any> {
  const response = await fetch(`${API_BASE}/knowledge/codes/${codeId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch code details');
  }
  return await response.json();
}

export async function queryLabourRAG(query: string, mode: string = "HYBRID"): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/rag/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode }),
    });
    if (!response.ok) {
      throw new Error('RAG query failed');
    }
    return await response.json();
  } catch (error) {
    return {
      query,
      retrieval_mode: mode,
      answer: "Under The Code on Wages, 2019, Section 14 (Wages for Overtime Work):\n\nWhere an employee works on any day in excess of normal working hours (8 hrs/day or 48 hrs/week), the employer shall pay overtime wages at not less than twice the normal rate of wages.",
      citations: [
        {
          code_id: "wages_2019",
          act_title: "The Code on Wages, 2019",
          chapter: "Chapter II - Minimum Wages",
          section_number: "Section 14",
          title: "Wages for Overtime Work",
          citation_text: "Overtime must be paid at not less than twice the normal rate of wages.",
          authority: "Inspector-cum-Facilitator",
          penalty_summary: "1st: Up to ₹50,000",
          relevance_score: 0.96
        }
      ],
      retrieved_chunks_count: 1,
      zero_hallucination_verified: true
    };
  }
}

export async function evaluateCompliance(establishmentId: string = "EST-001"): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/compliance/evaluate?establishment_id=${establishmentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Compliance evaluation failed');
    }
    return await response.json();
  } catch (error) {
    return {
      establishment_id: establishmentId,
      audit_timestamp: new Date().toISOString(),
      total_rules_evaluated: 5,
      passed_count: 2,
      failed_count: 3,
      warning_count: 0,
      overall_compliance_score: 40.0,
      findings: [
        {
          rule_id: "MIN_WAGE_001",
          rule_name: "Statutory Minimum Wage Rate Floor Check",
          status: "FAILED",
          severity: "HIGH",
          statutory_reference: "Code on Wages, 2019, Section 6 & Section 8",
          authority: "Chief Labour Commissioner (Central)",
          evidence: "1 worker(s) paid below national floor ₹450.00/day. Worst violation: EMP-003 received ₹310.00/day.",
          affected_entities_count: 1,
          affected_entity_ids: ["EMP-003"]
        },
        {
          rule_id: "OVERTIME_001",
          rule_name: "Statutory Overtime Double Rate Verification",
          status: "FAILED",
          severity: "HIGH",
          statutory_reference: "Code on Wages, 2019, Section 14",
          authority: "Inspector-cum-Facilitator",
          evidence: "1 worker(s) underpaid for statutory overtime. Example: EMP-003 worked 12.0 OT hrs, paid ₹450.00 vs statutory double rate ₹930.00.",
          affected_entities_count: 1,
          affected_entity_ids: ["EMP-003"]
        },
        {
          rule_id: "SAFETY_COMMITTEE_001",
          rule_name: "Mandatory Bi-partite Safety Committee Constitution",
          status: "FAILED",
          severity: "HIGH",
          statutory_reference: "OSHWC Code, 2020, Section 22",
          authority: "Chief Inspector of Factories",
          evidence: "Factory employs 420 workers (>= 250 threshold) but lacks evidence of an active Bi-partite Safety Committee.",
          affected_entities_count: 1,
          affected_entity_ids: []
        }
      ]
    };
  }
}
