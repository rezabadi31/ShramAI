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

export type AgentExecutionStep = {
  step_index: number;
  node_name: string;
  action_taken: string;
  timestamp: string;
  details: Record<string, any>;
};

export type OrchestrationExecutionResponse = {
  workflow_id: string;
  establishment_id: string;
  status: string;
  steps_completed: number;
  execution_time_ms: number;
  compliance_score: number;
  risk_score: number;
  risk_category: string;
  findings_count: number;
  steps: AgentExecutionStep[];
  ai_inspection_brief: Record<string, any>;
};

export type RegisterComparisonItem = {
  register_id: string;
  register_name: string;
  form_designation: string;
  statute: string;
  section: string;
  mandatory: boolean;
  status: 'SUBMITTED' | 'MISSING' | 'INCOMPLETE';
  filing_frequency: string;
  penalty_on_default: string;
  citation: string;
  submitted_document_id?: string | null;
  completeness_score: number;
};

export type DocumentAgentAuditResult = {
  establishment_id: string;
  audit_timestamp: string;
  overall_legibility_score: number;
  legibility_status: 'EXCELLENT' | 'ADEQUATE' | 'DEGRADED' | 'UNREADABLE';
  completeness_score: number;
  total_required_registers: number;
  submitted_count: number;
  missing_count: number;
  register_comparisons: RegisterComparisonItem[];
  missing_registers_penalties: string[];
  agent_recommendation: string;
};

export type EvidenceAnchor = {
  document_id: string;
  document_name: string;
  page_number: number;
  row_index?: number | null;
  employee_id?: string | null;
  discrepancy_value: string;
  statutory_requirement: string;
};

export type StatutoryEnrichment = {
  code_id: string;
  act_title: string;
  section_number: string;
  section_title: string;
  statutory_quote: string;
  authority: string;
  penalty_schedule?: string | null;
  relevance_score: number;
};

export type GroundedComplianceFinding = {
  finding_id: string;
  rule_id: string;
  rule_name: string;
  status: string;
  severity: string;
  explanation: string;
  evidence_anchor: EvidenceAnchor;
  statutory_enrichment: StatutoryEnrichment;
  actionable_remedy: string;
};

export type ComplianceAgentAuditResult = {
  establishment_id: string;
  audit_timestamp: string;
  compliance_score: number;
  total_rules_evaluated: number;
  violations_count: number;
  passed_count: number;
  findings: GroundedComplianceFinding[];
  agent_summary: string;
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

export type CrossDocumentAnomalyItem = {
  anomaly_id: string;
  anomaly_type: 'GHOST_WORKER' | 'UNCOMPENSATED_ATTENDANCE' | 'DISBURSEMENT_MISMATCH' | 'OVERTIME_HOURS_DISCREPANCY' | 'CONTRACTOR_SUPPRESSION';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  primary_document: string;
  cross_reference_document: string;
  description: string;
  discrepancy_amount?: number | null;
  affected_worker_id?: string | null;
  affected_worker_name?: string | null;
  statutory_implication: string;
};

export type ReconciliationSummary = {
  records_reconciled: number;
  anomalies_detected: number;
  financial_discrepancy_total: number;
  ghost_workers_count: number;
  uncompensated_workers_count: number;
};

export type CrossDocumentAuditResult = {
  establishment_id: string;
  audit_timestamp: string;
  reconciliation_summary: {
    records_reconciled: number;
    anomalies_detected: number;
    financial_discrepancy_total: number;
    ghost_workers_count: number;
    uncompensated_workers_count: number;
  };
  anomalies: CrossDocumentAnomalyItem[];
  recommendations: string[];
};

export type EvidenceGraphNode = {
  id: string;
  label: string;
  node_type: 'ESTABLISHMENT' | 'DOCUMENT' | 'RECORD' | 'VIOLATION' | 'CITATION';
  tier: number;
  properties: Record<string, any>;
};

export type EvidenceGraphEdge = {
  source: string;
  target: string;
  edge_type: 'CONTAINS' | 'EXTRACTED_FROM' | 'VIOLATES' | 'STATUTORY_SOURCE';
  label: string;
};

export type EvidenceGraphResponse = {
  establishment_id: string;
  node_count: number;
  edge_count: number;
  nodes: EvidenceGraphNode[];
  edges: EvidenceGraphEdge[];
};

export type ProvenancePathResponse = {
  target_node_id: string;
  path_node_ids: string[];
  nodes: EvidenceGraphNode[];
  edges: EvidenceGraphEdge[];
  provenance_summary: string;
};

export type EstablishmentRecordSynthetic = {
  establishment_id: string;
  name: string;
  state: string;
  district: string;
  industry_sector: string;
  hazardous_process: boolean;
  worker_count: number;
  contract_worker_ratio: number;
  female_worker_ratio: number;
  wage_violation_count: number;
  ot_violation_count: number;
  deduction_violation_count: number;
  missing_register_count: number;
  ghost_worker_count: number;
  uncompensated_worker_count: number;
  disbursement_mismatch_count: number;
  inspection_history_violations: number;
  grievance_complaint_count: number;
  ground_truth_risk_score: number;
  ground_truth_inspection_priority: 'HIGH' | 'MEDIUM' | 'LOW';
};

export type SectorDistributionItem = {
  sector: string;
  count: number;
  percentage: number;
};

export type RiskDistributionItem = {
  priority: string;
  count: number;
  percentage: number;
};

export type DatasetSummaryMetrics = {
  total_establishments: number;
  average_worker_count: number;
  average_risk_score: number;
  sector_distribution: SectorDistributionItem[];
  risk_distribution: RiskDistributionItem[];
  total_violations_simulated: number;
  total_ghost_workers_simulated: number;
};

export type DatasetGenerationResponse = {
  status: string;
  samples_generated: number;
  csv_path?: string | null;
  json_path?: string | null;
  summary_metrics: DatasetSummaryMetrics;
};

export type FeatureCategory = 'DEMOGRAPHIC' | 'DETERMINISTIC' | 'ANOMALY' | 'HISTORICAL' | 'INTERACTION';

export type FeatureDefinition = {
  name: string;
  label: string;
  category: FeatureCategory;
  description: string;
  formula: string;
  weight_hint: number;
};

export type FeatureVectorItem = {
  name: string;
  label: string;
  category: FeatureCategory;
  raw_value: number;
  normalized_value: number;
  formula: string;
};

export type FeatureExtractionResponse = {
  establishment_id: string;
  feature_count: number;
  features: FeatureVectorItem[];
  vector: Record<string, number>;
};

export type ModelEvaluationMetrics = {
  model_name: string;
  algorithm: string;
  roc_auc: number;
  precision: number;
  recall: number;
  f1_score: number;
  rmse: number;
  r2_score: number;
  training_time_ms: number;
  is_champion: boolean;
};

export type ModelBenchmarkComparison = {
  models: ModelEvaluationMetrics[];
  champion_model: string;
  total_training_samples: number;
  total_testing_samples: number;
  benchmark_timestamp: string;
};

export type RiskPredictionResponse = {
  establishment_id: string;
  ml_model: string;
  risk_score: number;
  risk_probability: number;
  priority_class: 'HIGH' | 'MEDIUM' | 'LOW';
  percentile: string;
  confidence_score: number;
  calibrated_action: string;
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

export type ShapFeatureContribution = {
  feature_name: string;
  feature_label: string;
  category: string;
  feature_value: number;
  shap_value: number;
  direction: 'positive' | 'negative';
  explanation: string;
};

export type ShapLocalExplanationResponse = {
  establishment_id: string;
  base_value: number;
  predicted_risk_score: number;
  net_shap_adjustment: number;
  positive_escalators: ShapFeatureContribution[];
  negative_mitigators: ShapFeatureContribution[];
  all_contributions: ShapFeatureContribution[];
};

export type ShapGlobalFeatureImportanceItem = {
  feature_name: string;
  feature_label: string;
  category: string;
  mean_abs_shap: number;
  rank: number;
};

export type ShapGlobalSummaryResponse = {
  dataset_size: number;
  feature_count: number;
  top_features: ShapGlobalFeatureImportanceItem[];
};

export type TacticalEnforcementDirective = {
  directive_id: string;
  action_type: string;
  urgency: string;
  description: string;
  statutory_authority: string;
};

export type RiskAttributionSynthesis = {
  top_escalators: string[];
  top_mitigators: string[];
  synthesis_narrative: string;
};

export type RiskAgentAuditResult = {
  establishment_id: string;
  ml_model_used: string;
  calibrated_risk_score: number;
  priority_class: 'HIGH' | 'MEDIUM' | 'LOW';
  percentile_context: string;
  confidence_score: number;
  base_jurisdiction_risk: number;
  net_shap_escalation: number;
  attribution_synthesis: RiskAttributionSynthesis;
  enforcement_directives: TacticalEnforcementDirective[];
  agent_reasoning: string;
  timestamp: string;
};

export type PrioritizedEstablishmentItem = {
  establishment_id: string;
  name: string;
  registration_number: string;
  industrial_belt: string;
  industry_sector: string;
  worker_count: number;
  ml_risk_score: number;
  composite_priority_score: number;
  priority_class: 'HIGH' | 'MEDIUM' | 'LOW';
  selection_reason: 'RISK_DRIVEN' | 'RANDOM_AUDIT_CONTROL';
  recency_months: number;
  inspection_status: 'PENDING' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  assigned_inspector_id?: string | null;
  target_audit_window?: string | null;
};

export type PrioritizedQueueResponse = {
  total_count: number;
  page: number;
  page_size: number;
  items: PrioritizedEstablishmentItem[];
};

export type QueueSummaryMetrics = {
  total_jurisdiction_establishments: number;
  high_priority_count: number;
  medium_priority_count: number;
  low_priority_count: number;
  random_control_quota_count: number;
  monthly_inspector_capacity: number;
  capacity_utilization_percent: number;
};

export type SHAPContribution = {
  feature_name: string;
  feature_label: string;
  contribution: number;
  direction: 'positive' | 'negative';
};

export type StatutoryExposureItem = {
  code_name: string;
  section: string;
  contravention: string;
  penalty_provision: string;
};

export type RemediationStepItem = {
  step_number: number;
  action: string;
  deadline: string;
  statutory_cure: string;
  estimated_financial_arrears: string;
};

export type InspectorExplanationBrief = {
  establishment_id: string;
  risk_score: number;
  priority_class: string;
  executive_summary: string;
  statutory_exposures: StatutoryExposureItem[];
  mandatory_documents_to_seize: string[];
  cross_examination_checklist: string[];
  investigation_focus_areas: string[];
};

export type EmployerRemediationPlan = {
  establishment_id: string;
  advisory_summary: string;
  root_cause_analysis: string[];
  remediation_steps: RemediationStepItem[];
  safe_harbour_guidelines: string[];
  total_estimated_arrears_inr: number;
};

export type ComprehensiveExplanationResponse = {
  establishment_id: string;
  establishment_name: string;
  ml_risk_score: number;
  priority_class: string;
  inspector_brief: InspectorExplanationBrief;
  employer_remediation: EmployerRemediationPlan;
  zero_hallucination_verified: boolean;
  timestamp: string;
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
