// API Configuration for Hüner AI SUT Engine
// API Documentation: https://sut-engine.hunerai.com/
// Note: Browser requests go through local proxy to avoid CORS issues

export const API_CONFIG = {
  // Use local proxy for browser requests (avoids CORS)
  baseUrl: "/api",
  // Direct API URL (for server-side use)
  directUrl: "https://sut-engine.hunerai.com",
  endpoints: {
    analyze: "/analyze",
    health: "/health",
  },
};

// Request/Response Types based on OpenAPI spec

export interface Facility {
  code: string;
  title: string;
}

export interface ReportInformation {
  reportNo: string;
  reportDate: string;
  protocolNo: string;
  reportType: string;
  facility: Facility;
}

export interface Demographic {
  gender: string;
  dateOfBirth: string;
  age: number;
}

export interface Diagnosis {
  code: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Patient {
  demographic: Demographic;
  diagnoses: Diagnosis[];
}

export interface Usage {
  frequency: string;
  amount: string;
}

export interface MedicationInformation {
  activeIngredient: string;
  sgkCode: string;
  brandName: string;
  form: string;
  dose: string;
  usage: Usage;
  addedTime: string;
}

export interface Doctor {
  fullName: string;
  specialty: string;
  diplomaNo: string;
  registrationNo: string;
}

export interface Finding {
  type: string;
  value: string;
  description: string;
  date: string;
}

export interface Notes {
  clinicalSummary: string;
  dosageDetails: string;
  allergies: string;
  contraindications: string;
  sideEffects: string;
  monitoring: string;
  lifestyle: string;
  emergencyInstructions: string;
  additionalComments: string;
}

export interface HealthReportRequest {
  title: string;
  reportInformation: ReportInformation;
  patient: Patient;
  medicationInformation: MedicationInformation[];
  doctors: Doctor[];
  findings: Finding[];
  notes: Notes;
}

export interface AnalysisResponse {
  request_id: string;
  message: string;
  data: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

// API Client Functions

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.health}`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return response.json();
}

export async function analyzeHealthReport(
  request: HealthReportRequest
): Promise<AnalysisResponse> {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.analyze}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errorData: HTTPValidationError = await response.json();
      throw new Error(`Validation Error: ${errorData.detail.map(e => e.msg).join(", ")}`);
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Helper to convert extracted data to API request format
export function prepareHealthReportRequest(extractedData: {
  title?: string;
  reportInformation?: Partial<ReportInformation>;
  patient?: {
    demographic?: Partial<Demographic>;
    diagnoses?: Partial<Diagnosis>[];
  };
  medicationInformation?: Partial<MedicationInformation>[];
  doctors?: Partial<Doctor>[];
  findings?: Partial<Finding>[];
  notes?: Partial<Notes>;
}): HealthReportRequest {
  // Fill in default values for required fields
  const defaultFacility: Facility = {
    code: extractedData.reportInformation?.facility?.code || "",
    title: extractedData.reportInformation?.facility?.title || "",
  };

  const defaultReportInfo: ReportInformation = {
    reportNo: extractedData.reportInformation?.reportNo || "",
    reportDate: extractedData.reportInformation?.reportDate || "",
    protocolNo: extractedData.reportInformation?.protocolNo || "",
    reportType: extractedData.reportInformation?.reportType || "",
    facility: defaultFacility,
  };

  const defaultDemographic: Demographic = {
    gender: extractedData.patient?.demographic?.gender || "",
    dateOfBirth: extractedData.patient?.demographic?.dateOfBirth || "",
    age: extractedData.patient?.demographic?.age || 0,
  };

  const diagnoses: Diagnosis[] = (extractedData.patient?.diagnoses || []).map((d) => ({
    code: d.code || "",
    title: d.title || "",
    description: d.description || "",
    startDate: d.startDate || "",
    endDate: d.endDate || "",
  }));

  const medications: MedicationInformation[] = (extractedData.medicationInformation || []).map((m) => ({
    activeIngredient: m.activeIngredient || "",
    sgkCode: m.sgkCode || "",
    brandName: m.brandName || "",
    form: m.form || "",
    dose: m.dose || "",
    usage: {
      frequency: m.usage?.frequency || "",
      amount: m.usage?.amount || "",
    },
    addedTime: m.addedTime || "",
  }));

  const doctors: Doctor[] = (extractedData.doctors || []).map((d) => ({
    fullName: d.fullName || "",
    specialty: d.specialty || "",
    diplomaNo: d.diplomaNo || "",
    registrationNo: d.registrationNo || "",
  }));

  const findings: Finding[] = (extractedData.findings || []).map((f) => ({
    type: f.type || "",
    value: f.value || "",
    description: f.description || "",
    date: f.date || "",
  }));

  const notes: Notes = {
    clinicalSummary: extractedData.notes?.clinicalSummary || "",
    dosageDetails: extractedData.notes?.dosageDetails || "",
    allergies: extractedData.notes?.allergies || "",
    contraindications: extractedData.notes?.contraindications || "",
    sideEffects: extractedData.notes?.sideEffects || "",
    monitoring: extractedData.notes?.monitoring || "",
    lifestyle: extractedData.notes?.lifestyle || "",
    emergencyInstructions: extractedData.notes?.emergencyInstructions || "",
    additionalComments: extractedData.notes?.additionalComments || "",
  };

  return {
    title: extractedData.title || "Huner Engine Medical Report Extractor v1.0",
    reportInformation: defaultReportInfo,
    patient: {
      demographic: defaultDemographic,
      diagnoses,
    },
    medicationInformation: medications,
    doctors,
    findings,
    notes,
  };
}

