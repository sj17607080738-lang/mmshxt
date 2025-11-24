export interface Criterion {
  id: string;
  content: string;
  note?: string; // Optional note for context (e.g. "Needs 2 of these")
}

export interface Disease {
  id: number;
  code?: string; // e.g., "M001" if available, using index for now
  name: string;
  category?: string; // e.g., "Cardiovascular", "Oncology"
  criteria: Criterion[];
  logicDescription: string; // Human readable logic, e.g. "(1) + (2) + (3)"
  // Function that accepts a set of selected criterion IDs and returns true/false
  isEligible: (selectedIds: Set<string>) => boolean;
}

export interface AuditRecord {
  id: string;
  timestamp: number;
  applicantName: string;
  applicantId: string;
  diseaseId: number;
  diseaseName: string;
  result: 'PASS' | 'FAIL';
  criteriaMet: string[]; // List of criterion IDs met
  notes: string;
}