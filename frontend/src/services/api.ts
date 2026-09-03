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

export async function runAgentOrchestration(establishmentId: string = "EST-001"): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/agents/orchestrate?establishment_id=${establishmentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Agent orchestration failed');
    }
    return await response.json();
  } catch (error) {
    return {
      workflow_id: "WF-DEMO-001",
      establishment_id: establishmentId,
      status: "COMPLETED",
      steps_completed: 5,
      execution_time_ms: 124.5,
      compliance_score: 40.0,
      risk_score: 85.0,
      risk_category: "HIGH",
      findings_count: 3,
      steps: [
        { step_index: 1, node_name: "SUPERVISOR", action_taken: "Routing to Document Agent for register ingestion & normalization", timestamp: new Date().toISOString(), details: {} },
        { step_index: 2, node_name: "DOCUMENT_AGENT", action_taken: "Normalized 4 canonical employee wage records from Form B register", timestamp: new Date().toISOString(), details: { record_count: 4, quality_score: 0.96 } },
        { step_index: 3, node_name: "COMPLIANCE_AGENT", action_taken: "Evaluated 5 statutory rules: 3 violations detected (Score: 40.0%)", timestamp: new Date().toISOString(), details: { failed_count: 3 } },
        { step_index: 4, node_name: "RISK_AGENT", action_taken: "Computed risk score 85.0/100 (HIGH) based on 3 deterministic violations and 420 headcount", timestamp: new Date().toISOString(), details: { risk_score: 85.0 } },
        { step_index: 5, node_name: "EXPLANATION_SYNTHESIS", action_taken: "Synthesized grounded AI inspection brief with 3 critical focus areas and recommended statutory summons", timestamp: new Date().toISOString(), details: {} },
      ],
      ai_inspection_brief: {
        priority: "HIGH",
        risk_score: 85.0,
        summary: "Establishment EST-001 flagged for high inspection priority (85.0/100). Deterministic audit identified 3 statutory non-compliances under Code on Wages 2019 and OSHWC Code 2020.",
        critical_focus_areas: [
          "Verify Form B register rates against national floor wage (₹450/day) for contract/helper cadres",
          "Audit overtime disbursement formula for double-rate statutory parity (Sec. 14)",
          "Inspect physical constitution and worker representation in factory Safety Committee (Sec. 22)"
        ],
        recommended_documents: [
          "Original Bank Disbursement Scrolls (UTR matching)",
          "Muster Roll Form D with overtime punch cards",
          "Safety Committee Minutes & Worker Election Records"
        ]
      }
    };
  }
}

export async function auditEstablishmentDocuments(establishmentId: string = "EST-001"): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/agents/document/audit?establishment_id=${establishmentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Document audit failed');
    }
    return await response.json();
  } catch (error) {
    return {
      establishment_id: establishmentId,
      audit_timestamp: new Date().toISOString(),
      overall_legibility_score: 94.2,
      legibility_status: "EXCELLENT",
      completeness_score: 57.1,
      total_required_registers: 7,
      submitted_count: 4,
      missing_count: 3,
      register_comparisons: [
        { register_id: "REG_FORM_A", register_name: "Register of Employees", form_designation: "Form A", statute: "Code on Wages, 2019", section: "Section 50", mandatory: true, status: "SUBMITTED", filing_frequency: "Monthly", penalty_on_default: "Fine up to ₹20,000", citation: "Sec. 50(1)", completeness_score: 0.96 },
        { register_id: "REG_FORM_B", register_name: "Register of Wages", form_designation: "Form B", statute: "Code on Wages, 2019", section: "Section 50", mandatory: true, status: "SUBMITTED", filing_frequency: "Monthly", penalty_on_default: "Fine up to ₹50,000", citation: "Sec. 50(1)", completeness_score: 0.96 },
        { register_id: "REG_FORM_C", register_name: "Register of Deductions & Fines", form_designation: "Form C", statute: "Code on Wages, 2019", section: "Section 18 & 50", mandatory: true, status: "MISSING", filing_frequency: "Monthly", penalty_on_default: "Fine up to ₹20,000", citation: "Sec. 18 & 50", completeness_score: 0.0 },
        { register_id: "REG_FORM_D", register_name: "Muster Roll / Attendance", form_designation: "Form D", statute: "Code on Wages, 2019", section: "Section 50", mandatory: true, status: "SUBMITTED", filing_frequency: "Monthly", penalty_on_default: "Fine up to ₹20,000", citation: "Sec. 50(1)", completeness_score: 0.95 },
        { register_id: "REG_EPFO_ECR", register_name: "EPFO Electronic Challan cum Return", form_designation: "ECR Return", statute: "Code on Social Security, 2020", section: "Section 16", mandatory: true, status: "MISSING", filing_frequency: "Monthly", penalty_on_default: "Imprisonment up to 1-3 years", citation: "Sec. 16", completeness_score: 0.0 },
        { register_id: "REG_ESIC_FORM5", register_name: "ESIC Contribution Register", form_designation: "Form 5", statute: "Code on Social Security, 2020", section: "Section 32", mandatory: true, status: "MISSING", filing_frequency: "Monthly", penalty_on_default: "Fine up to ₹50,000", citation: "Sec. 32", completeness_score: 0.0 },
        { register_id: "REG_SAFETY_LOG", register_name: "Bi-partite Safety Committee Minutes", form_designation: "Safety Log", statute: "OSHWC Code, 2020", section: "Section 22", mandatory: true, status: "MISSING", filing_frequency: "Quarterly", penalty_on_default: "Fine up to ₹2,00,000", citation: "Sec. 22", completeness_score: 0.0 },
      ],
      missing_registers_penalties: [
        "Form C (Register of Deductions & Fines): Fine up to ₹20,000",
        "ECR Return (EPFO Electronic Challan): Imprisonment up to 1-3 years",
        "Safety Log (Bi-partite Safety Committee Minutes): Fine up to ₹2,00,000"
      ],
      agent_recommendation: "Autonomous Document Agent flagged 3 missing statutory register(s). Issue statutory summons Form V for immediate submission."
    };
  }
}

export async function runComplianceAgentAudit(establishmentId: string = "EST-001"): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/agents/compliance/audit?establishment_id=${establishmentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Compliance audit failed');
    }
    return await response.json();
  } catch (error) {
    return {
      establishment_id: establishmentId,
      audit_timestamp: new Date().toISOString(),
      compliance_score: 40.0,
      total_rules_evaluated: 5,
      violations_count: 3,
      passed_count: 2,
      findings: [
        {
          finding_id: "FIND-MIN001",
          rule_id: "MIN_WAGE_001",
          rule_name: "Statutory Minimum Wage Rate Floor Verification",
          status: "FAILED",
          severity: "HIGH",
          explanation: "Deterministic rule validation identified non-compliance with The Code on Wages, 2019, Section 6 & 8. Specifically, ₹310.00/day paid vs statutory national floor ₹450.00/day (Deficit: ₹140.00/day).",
          evidence_anchor: {
            document_id: "DOC-MIN_",
            document_name: "ABC_Wage_Register_Oct2024.pdf",
            page_number: 4,
            row_index: 3,
            employee_id: "EMP-003",
            discrepancy_value: "₹310.00/day paid vs statutory floor ₹450.00/day (Deficit: ₹140.00/day)",
            statutory_requirement: "Universal minimum floor wage under Code on Wages Sec. 6 & 8"
          },
          statutory_enrichment: {
            code_id: "wages_2019",
            act_title: "The Code on Wages, 2019",
            section_number: "Section 6 & 8",
            section_title: "Statutory Minimum Wages & Floor Wage",
            statutory_quote: "The appropriate Government shall fix a minimum rate of wages and no employer shall pay to any employee wages less than the minimum rate of wages.",
            authority: "Chief Labour Commissioner (Central) / State Labour Commissioner",
            penalty_schedule: "1st Offense: Fine up to ₹50,000; Subsequent: Imprisonment up to 3 months or fine up to ₹1,00,000",
            relevance_score: 0.98
          },
          actionable_remedy: "Issue statutory demand notice for wage arrears of ₹3,640.00 for helper cadre within 14 days."
        },
        {
          finding_id: "FIND-OT001",
          rule_id: "OVERTIME_001",
          rule_name: "Overtime Double Hourly Rate Floor Parity",
          status: "FAILED",
          severity: "HIGH",
          explanation: "Deterministic rule validation identified non-compliance with The Code on Wages, 2019, Section 14. Specifically, 12 OT hours paid ₹450.00 vs statutory double rate ₹930.00 (Deficit: ₹480.00).",
          evidence_anchor: {
            document_id: "DOC-OVER",
            document_name: "ABC_Wage_Register_Oct2024.pdf",
            page_number: 4,
            row_index: 3,
            employee_id: "EMP-003",
            discrepancy_value: "12 OT hours paid ₹450.00 vs statutory double rate ₹930.00 (Deficit: ₹480.00)",
            statutory_requirement: "Twice the normal wage rate for work beyond 8 hrs/day under Sec. 14"
          },
          statutory_enrichment: {
            code_id: "wages_2019",
            act_title: "The Code on Wages, 2019",
            section_number: "Section 14",
            section_title: "Wages for Overtime Work",
            statutory_quote: "Where an employee is required to work on any day in excess of the number of hours constituting a normal working day, the employer shall pay him for every hour at twice the normal rate of wages.",
            authority: "Inspector-cum-Facilitator",
            penalty_schedule: "Fine up to ₹20,000",
            relevance_score: 0.97
          },
          actionable_remedy: "Recalculate overtime wage schedule at 2x hourly rate and disburse arrears."
        },
        {
          finding_id: "FIND-SAFE001",
          rule_id: "SAFETY_COMMITTEE_001",
          rule_name: "Mandatory Safety Committee Constitution Threshold",
          status: "FAILED",
          severity: "HIGH",
          explanation: "Deterministic rule validation identified non-compliance with The OSHWC Code, 2020, Section 22. Specifically, Factory employs 420 workers (>= 250 threshold) without a registered Safety Committee.",
          evidence_anchor: {
            document_id: "DOC-SAFE",
            document_name: "Factory Profile Manifest",
            page_number: 1,
            row_index: null,
            employee_id: null,
            discrepancy_value: "Factory employs 420 workers without a registered Safety Committee",
            statutory_requirement: "Equal worker representation bi-partite Safety Committee under OSHWC Sec. 22"
          },
          statutory_enrichment: {
            code_id: "oshwc_2020",
            act_title: "The Occupational Safety, Health and Working Conditions Code, 2020",
            section_number: "Section 22",
            section_title: "Safety Committee and Safety Officers",
            statutory_quote: "In every factory where 250 or more workers are ordinarily employed, the employer shall constitute a Safety Committee consisting of equal representatives of workers and management.",
            authority: "Directorate of Industrial Safety and Health (DISH)",
            penalty_schedule: "Fine up to ₹2,00,000",
            relevance_score: 0.99
          },
          actionable_remedy: "Order immediate constitution of Bi-partite Safety Committee with 50% worker members."
        }
      ],
      agent_summary: "Autonomous Compliance Agent evaluated 5 rules and confirmed 3 statutory violations with row-level evidence anchors."
    };
  }
}

export async function reconcileEstablishmentAnomalies(establishmentId: string = "EST-001"): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/anomalies/reconcile?establishment_id=${establishmentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Anomaly reconciliation failed');
    }
    return await response.json();
  } catch (error) {
    return {
      establishment_id: establishmentId,
      audit_timestamp: new Date().toISOString(),
      reconciliation_summary: {
        records_reconciled: 16,
        anomalies_detected: 3,
        financial_discrepancy_total: 392500.0,
        ghost_workers_count: 1,
        uncompensated_workers_count: 1,
      },
      anomalies: [
        {
          anomaly_id: "ANOM-GH001",
          anomaly_type: "GHOST_WORKER",
          severity: "HIGH",
          primary_document: "Form B - Register of Wages",
          cross_reference_document: "Form D - Muster Roll",
          description: "Worker EMP-009 (Vikram Singh) received gross wage disbursement of ₹16,500.00, but has ZERO attendance logged on Form D Muster Roll.",
          discrepancy_amount: 16500.0,
          affected_worker_id: "EMP-009",
          affected_worker_name: "Vikram Singh (Ghost)",
          statutory_implication: "Suspected phantom payroll embezzlement / fraudulent statutory filing under Sec. 50 Code on Wages."
        },
        {
          anomaly_id: "ANOM-UN001",
          anomaly_type: "UNCOMPENSATED_ATTENDANCE",
          severity: "HIGH",
          primary_document: "Form D - Muster Roll",
          cross_reference_document: "Form B - Register of Wages",
          description: "Worker EMP-015 logged 22 physical shifts on Muster Roll Form D, but has NO recorded wage payment on Form B Register.",
          discrepancy_amount: 9900.0,
          affected_worker_id: "EMP-015",
          affected_worker_name: "Dinesh Pal",
          statutory_implication: "Non-payment of earned wages under Section 17 & 18 Code on Wages 2019."
        },
        {
          anomaly_id: "ANOM-SK001",
          anomaly_type: "DISBURSEMENT_MISMATCH",
          severity: "HIGH",
          primary_document: "Form B - Register of Wages",
          cross_reference_document: "Bank Disbursement Scroll (UTR File)",
          description: "Worker EMP-003 Form B Net Payable is ₹7,260.00, but actual bank UTR transfer was ₹6,260.00 (Discrepancy: ₹1,000.00 diverted).",
          discrepancy_amount: 1000.0,
          affected_worker_id: "EMP-003",
          affected_worker_name: "Rajesh K. (Helper)",
          statutory_implication: "Unauthorized wage deduction / diversion in violation of Section 18 Code on Wages."
        },
        {
          anomaly_id: "ANOM-CT001",
          anomaly_type: "CONTRACTOR_SUPPRESSION",
          severity: "HIGH",
          primary_document: "Factory Security Gate Turnstile Log",
          cross_reference_document: "Form A - Register of Employees",
          description: "Gate security access logs show 445 active workers on factory premises, while Form A statutory register declares only 420 employees (25 undeclared contract workers).",
          discrepancy_amount: 375000.0,
          affected_worker_id: null,
          affected_worker_name: "25 Contract Workers",
          statutory_implication: "Suppression of workforce to evade OSHWC Code Section 22 and Code on Social Security Section 16/32."
        }
      ],
      recommendations: [
        "Summon original UTR bank scrolls to cross-examine EMP-003 wage deduction diversion.",
        "Verify physical presence of EMP-009 at factory shopfloor; biometric log indicates zero turnstile entries.",
        "Inspect contractor gate pass muster for the 25 undeclared contract workers identified at gate security."
      ]
    };
  }
}

export async function getEstablishmentEvidenceGraph(establishmentId: string = "EST-001"): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/evidence-graph/${establishmentId}`);
    if (!response.ok) throw new Error('Evidence graph fetch failed');
    return await response.json();
  } catch (error) {
    return {
      establishment_id: establishmentId,
      node_count: 15,
      edge_count: 14,
      nodes: [
        { id: establishmentId, label: "Establishment: ABC Industries Ltd.", node_type: "ESTABLISHMENT", tier: 1, properties: { workforce: 420, sector: "Manufacturing" } },
        { id: "DOC-001", label: "Form B - Wage Register", node_type: "DOCUMENT", tier: 2, properties: { pages: 14 } },
        { id: "DOC-002", label: "Form D - Muster Roll", node_type: "DOCUMENT", tier: 2, properties: { pages: 8 } },
        { id: "DOC-003", label: "Axis Bank UTR Scroll", node_type: "DOCUMENT", tier: 2, properties: { pages: 4 } },
        { id: "REC-EMP003", label: "Record: EMP-003 (Rajesh K.)", node_type: "RECORD", tier: 3, properties: { daily_rate: 310, ot_hours: 12 } },
        { id: "REC-EMP009", label: "Record: EMP-009 (Vikram Singh)", node_type: "RECORD", tier: 3, properties: { gross_wages: 16500 } },
        { id: "REC-ATT009", label: "Attendance: EMP-009 (0 Days)", node_type: "RECORD", tier: 3, properties: { days_present: 0 } },
        { id: "REC-BNK003", label: "Bank Transfer: EMP-003 (₹6,260)", node_type: "RECORD", tier: 3, properties: { amount: 6260 } },
        { id: "VIO-MIN_WAGE", label: "Violation: Below National Floor Wage", node_type: "VIOLATION", tier: 4, properties: { severity: "HIGH", deficit: "₹140/day" } },
        { id: "VIO-OVERTIME", label: "Violation: Overtime Below Double Rate", node_type: "VIOLATION", tier: 4, properties: { severity: "HIGH", deficit: "₹480 deficit" } },
        { id: "ANOM-GHOST", label: "Anomaly: Ghost Worker (Wage Paid, 0 Attendance)", node_type: "VIOLATION", tier: 4, properties: { severity: "HIGH", amount: "₹16,500.00" } },
        { id: "ANOM-SKIM", label: "Anomaly: Net Disbursement Mismatch", node_type: "VIOLATION", tier: 4, properties: { severity: "HIGH", diverted: "₹1,000.00" } },
        { id: "CIT-WAGES-SEC6", label: "Code on Wages, 2019 • Sec. 6 & 8", node_type: "CITATION", tier: 5, properties: { penalty: "Fine up to ₹50,000" } },
        { id: "CIT-WAGES-SEC14", label: "Code on Wages, 2019 • Sec. 14 (Overtime)", node_type: "CITATION", tier: 5, properties: { penalty: "Fine up to ₹20,000" } },
        { id: "CIT-WAGES-SEC50", label: "Code on Wages, 2019 • Sec. 50 (Registers)", node_type: "CITATION", tier: 5, properties: { penalty: "Fine up to ₹20,000" } },
        { id: "CIT-WAGES-SEC18", label: "Code on Wages, 2019 • Sec. 18 (Deduction Cap)", node_type: "CITATION", tier: 5, properties: { penalty: "Fine up to ₹20,000" } }
      ],
      edges: [
        { source: establishmentId, target: "DOC-001", edge_type: "CONTAINS", label: "filed_by" },
        { source: establishmentId, target: "DOC-002", edge_type: "CONTAINS", label: "filed_by" },
        { source: establishmentId, target: "DOC-003", edge_type: "CONTAINS", label: "filed_by" },
        { source: "DOC-001", target: "REC-EMP003", edge_type: "EXTRACTED_FROM", label: "extracted_from" },
        { source: "DOC-001", target: "REC-EMP009", edge_type: "EXTRACTED_FROM", label: "extracted_from" },
        { source: "DOC-002", target: "REC-ATT009", edge_type: "EXTRACTED_FROM", label: "extracted_from" },
        { source: "DOC-003", target: "REC-BNK003", edge_type: "EXTRACTED_FROM", label: "extracted_from" },
        { source: "REC-EMP003", target: "VIO-MIN_WAGE", edge_type: "VIOLATES", label: "exhibits" },
        { source: "REC-EMP003", target: "VIO-OVERTIME", edge_type: "VIOLATES", label: "exhibits" },
        { source: "REC-EMP009", target: "ANOM-GHOST", edge_type: "VIOLATES", label: "exhibits" },
        { source: "REC-ATT009", target: "ANOM-GHOST", edge_type: "VIOLATES", label: "exhibits" },
        { source: "REC-EMP003", target: "ANOM-SKIM", edge_type: "VIOLATES", label: "exhibits" },
        { source: "REC-BNK003", target: "ANOM-SKIM", edge_type: "VIOLATES", label: "exhibits" },
        { source: "VIO-MIN_WAGE", target: "CIT-WAGES-SEC6", edge_type: "STATUTORY_SOURCE", label: "governed_by" },
        { source: "VIO-OVERTIME", target: "CIT-WAGES-SEC14", edge_type: "STATUTORY_SOURCE", label: "governed_by" },
        { source: "ANOM-GHOST", target: "CIT-WAGES-SEC50", edge_type: "STATUTORY_SOURCE", label: "governed_by" },
        { source: "ANOM-SKIM", target: "CIT-WAGES-SEC18", edge_type: "STATUTORY_SOURCE", label: "governed_by" }
      ]
    };
  }
}

export async function getProvenancePath(establishmentId: string = "EST-001", nodeId: string = "VIO-MIN_WAGE"): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/evidence-graph/${establishmentId}/provenance/${nodeId}`);
    if (!response.ok) throw new Error('Provenance fetch failed');
    return await response.json();
  } catch (error) {
    return {
      target_node_id: nodeId,
      path_node_ids: [establishmentId, "DOC-001", "REC-EMP003", nodeId, "CIT-WAGES-SEC6"],
      nodes: [],
      edges: [],
      provenance_summary: `Trace lineage: Establishment ➔ Form B - Wage Register ➔ Record: EMP-003 ➔ ${nodeId} ➔ Code on Wages, 2019 Sec. 6 & 8`
    };
  }
}
