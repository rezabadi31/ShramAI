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
  registrationNumber: string;
  industry: string;
  riskScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH';
  findingsCount: number;
  anomaliesCount: number;
  status: string;
};

export type ComplianceFinding = {
  id: string;
  ruleId: string;
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence: string;
  sourceDocument: string;
  page: number;
  statutoryReference: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
};
