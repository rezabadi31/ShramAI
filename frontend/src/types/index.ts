export type SystemHealth = {
  status: string;
  project: string;
  version: string;
  environment: string;
  services: Record<string, string>;
};

export type Role = 'employer' | 'inspector' | 'admin';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: Role;
  designation: string;
  jurisdiction?: string | null;
  establishment_id?: string | null;
};

export type AuthToken = {
  access_token: string;
  token_type: string;
  role: Role;
  name: string;
  email: string;
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

export type ExtractionProvenance = {
  document_id: string;
  page: number;
  table_index: number;
  confidence: number;
  bounding_box?: number[] | null;
};

export type ExtractedTableRow = {
  row_index: number;
  values: Record<string, any>;
  provenance: ExtractionProvenance;
};

export type ExtractedTable = {
  table_name: string;
  headers: string[];
  rows: ExtractedTableRow[];
  row_count: number;
};

export type DocumentIntelligenceResult = {
  document_id: string;
  document_type: string;
  filename: string;
  pages: number;
  overall_confidence: number;
  extraction_method: string;
  tables: ExtractedTable[];
  extracted_records_count: number;
  raw_text_sample: string;
};

export type MissingFieldFlag = {
  field_name: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  affected_rows_count: number;
};

export type NormalizedDocumentDossier = {
  document_id: string;
  category: string;
  record_type: string;
  records_count: number;
  data_quality_score: number;
  normalization_confidence: number;
  missing_fields: MissingFieldFlag[];
  records: Record<string, any>[];
};

export type PenaltyStructure = {
  first_offense_fine: string;
  subsequent_offense: string;
  imprisonment_term?: string | null;
  compoundable: boolean;
};

export type StatutoryThreshold = {
  criterion: string;
  applicability_limit: string;
  enforcing_authority: string;
};

export type StatutorySection = {
  code_id: string;
  code_name: string;
  chapter_number: string;
  chapter_title: string;
  section_number: string;
  title: string;
  statutory_text: string;
  keywords: string[];
  thresholds?: StatutoryThreshold | null;
  penalties?: PenaltyStructure | null;
  mandatory_registers: string[];
  citation: string;
};

export type LabourCodeSummary = {
  code_id: string;
  title: string;
  act_number: string;
  enactment_year: number;
  total_chapters: number;
  total_sections: number;
  primary_objective: string;
  enforcing_spheres: string[];
  repealed_acts: string[];
  mandatory_registers: string[];
};

export type RuleEvaluationFinding = {
  rule_id: string;
  rule_name: string;
  status: 'PASSED' | 'FAILED' | 'WARNING';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  statutory_reference: string;
  authority: string;
  evidence: string;
  affected_entities_count: number;
  affected_entity_ids: string[];
};

export type ComplianceAuditReport = {
  establishment_id: string;
  audit_timestamp: string;
  total_rules_evaluated: number;
  passed_count: number;
  failed_count: number;
  warning_count: number;
  overall_compliance_score: number;
  findings: RuleEvaluationFinding[];
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
