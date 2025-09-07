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
