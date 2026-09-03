export type SystemHealth = {
  status: string;
  project: string;
  version: string;
  environment: string;
  services: Record<string, string>;
};

export type Establishment = {
  id: string;
  name: string;
  registration_number: string;
  industry: string;
  worker_count: number;
  risk_score: number;
  risk_category: 'LOW' | 'MEDIUM' | 'HIGH';
  findings_count: number;
  anomalies_count: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: string;
};

export type DocumentRecord = {
  id: string;
  document_type: string;
  filename: string;
  upload_date: string;
  ocr_confidence: number;
  status: string;
  pages: number;
  extracted_records: number;
};

export type ComplianceFinding = {
  id: string;
  rule_id: string;
  rule_name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  source_document: string;
  page: number;
  evidence: string;
  statutory_reference: string;
  authority: string;
  status: 'PENDING_VERIFICATION' | 'CONFIRMED' | 'REJECTED';
};

export type CrossDocumentAnomaly = {
  id: string;
  anomaly_type: string;
  description: string;
  involved_registers: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  detected_discrepancy: string;
  evidence_summary: string;
};

export type SHAPContribution = {
  feature_name: string;
  feature_label: string;
  contribution: number;
  direction: 'positive' | 'negative';
};

export type EstablishmentDossier = {
  establishment: Establishment;
  documents: DocumentRecord[];
  findings: ComplianceFinding[];
  anomalies: CrossDocumentAnomaly[];
  risk_breakdown: {
    ml_model: string;
    risk_score: number;
    risk_probability: number;
    classification: string;
    percentile: string;
    recommended_action: string;
  };
  shap_contributions: SHAPContribution[];
  ai_inspection_brief: {
    priority: string;
    risk_score: number;
    brief_summary: string;
    critical_focus_areas: string[];
    recommended_statutory_documents: string[];
  };
};

export type ActiveRole = 'landing' | 'employer' | 'inspector' | 'establishment-detail' | 'upload';
