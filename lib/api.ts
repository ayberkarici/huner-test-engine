// API Configuration for Hüner AI SUT Engine
// API Documentation: https://sut-engine.hunerai.com/docs
// Note: Browser requests go through local proxy to avoid CORS issues

export const API_CONFIG = {
  // Use local proxy for browser requests (avoids CORS)
  baseUrl: "/api",
  // Direct API URL (for server-side use)
  directUrl: "https://sut-engine.hunerai.com",
  endpoints: {
    jsonize: "/jsonize",  // Convert plain text to structured JSON
    analyze: "/analyze",  // Analyze structured JSON for SUT compliance
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

// Jsonize endpoint types
export interface JsonizeRequest {
  text: string;
}

export interface JsonizeResponse {
  request_id: string;
  message: string;
  data: HealthReportRequest;
}

// Analyze endpoint types  
export interface AnalysisResponse {
  request_id: string;
  message: string;
  data: string; // JSON string containing SUT evaluation
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

/**
 * Step 1: Convert plain text medical report to structured JSON
 * POST /jsonize
 */
export async function jsonizeReport(text: string): Promise<JsonizeResponse> {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.jsonize}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errorData: HTTPValidationError = await response.json();
      throw new Error(`Validation Error: ${errorData.detail.map(e => e.msg).join(", ")}`);
    }
    const errorText = await response.text();
    throw new Error(`Jsonize API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Step 2: Analyze structured JSON for SUT compliance
 * POST /analyze
 */
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
    const errorText = await response.text();
    throw new Error(`Analyze API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Full pipeline: Plain text → JSON → SUT Analysis
 */
export async function processReport(text: string): Promise<{
  jsonizeResponse: JsonizeResponse;
  analysisResponse: AnalysisResponse;
}> {
  // Step 1: Convert plain text to structured JSON
  const jsonizeResponse = await jsonizeReport(text);
  
  // Step 2: Analyze the structured data
  const analysisResponse = await analyzeHealthReport(jsonizeResponse.data);
  
  return { jsonizeResponse, analysisResponse };
}
