export interface VinValidationError {
  code: string;
  message: string;
  position?: number;
  character?: string;
}

export interface VinValidationDetails {
  lengthValid: boolean;
  charactersValid: boolean;
  checkDigitValid: boolean;
  providedCheckDigit?: string;
  calculatedCheckDigit?: string;
}

export interface VinValidationResult {
  valid: boolean;
  vin: string;
  normalizedVin: string;
  errors: VinValidationError[];
  details: VinValidationDetails;
}

export interface ManufacturerInfo {
  wmi: string;
  manufacturer: string;
  country: string;
  countryCode: string;
}

export interface YearInfo {
  code: string;
  possibleYears: number[];
  mostLikelyYear: number | null;
  confidence: number;
}

export interface VinComponents {
  wmi: string;
  vds: string;
  vis: string;
  checkDigit: string;
  yearCode: string;
  plantCode: string;
  sequentialNumber: string;
}

export interface ModelInference {
  model: string | null;
  confidence: number;
  source: string;
  matchedPattern?: string;
  additionalInfo?: Record<string, string>;
}

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

export interface DecodeOptions {
  strict?: boolean;
  includeComponents?: boolean;
}

export const DEFAULT_DISCLAIMER =
  "The returned data is inferred and unofficial. For official information, consult DENATRAN or the manufacturer.";
