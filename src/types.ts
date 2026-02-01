/**
 * Error found during VIN validation
 */
export interface VinValidationError {
  code: string;
  message: string;
  position?: number;
  character?: string;
}

/**
 * Details of VIN validation
 */
export interface VinValidationDetails {
  lengthValid: boolean;
  charactersValid: boolean;
  checkDigitValid: boolean;
  providedCheckDigit?: string;
  calculatedCheckDigit?: string;
}

/**
 * Result of VIN validation
 */
export interface VinValidationResult {
  valid: boolean;
  vin: string;
  normalizedVin: string;
  errors: VinValidationError[];
  details: VinValidationDetails;
}

/**
 * Manufacturer information decoded from WMI
 */
export interface ManufacturerInfo {
  wmi: string;
  manufacturer: string;
  country: string;
  countryCode: string;
}

/**
 * Year information decoded from VIN
 */
export interface YearInfo {
  code: string;
  possibleYears: number[];
  mostLikelyYear: number | null;
  confidence: number;
}

/**
 * VIN components
 */
export interface VinComponents {
  wmi: string;
  vds: string;
  vis: string;
  checkDigit: string;
  yearCode: string;
  plantCode: string;
  sequentialNumber: string;
}

/**
 * Model inference result
 */
export interface ModelInference {
  model: string | null;
  confidence: number;
  source: string;
  matchedPattern?: string;
  additionalInfo?: Record<string, string>;
}

/**
 * Full VIN decode result
 */
export interface VinDecodeResult {
  vin: string;
  valid: boolean;
  manufacturer: string | null;
  country: string | null;
  countryCode: string | null;
  year: number | null;
  possibleYears: number[];
  model: string | null;
  confidence: number;
  components?: VinComponents;
  disclaimer: string;
}

/**
 * Decode options
 */
export interface DecodeOptions {
  strict?: boolean;
  includeComponents?: boolean;
}

/**
 * Default disclaimer message
 */
export const DEFAULT_DISCLAIMER =
  "The returned data is inferred and unofficial. For official information, consult DENATRAN or the manufacturer.";
