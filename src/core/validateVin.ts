import {
  VinValidationResult,
  VinValidationError,
  VinValidationDetails,
} from "../types";
import { calculateCheckDigit } from "./checkDigit";

const VIN_LENGTH = 17;
const FORBIDDEN_CHARS = ["I", "O", "Q"];
const VALID_CHARS_REGEX = /^[A-HJ-NPR-Z0-9]+$/;

/**
 * Normalizes a VIN by converting to uppercase and removing spaces/dashes
 */
export function normalizeVin(vin: string): string {
  if (!vin) return "";
  return vin.toUpperCase().replace(/[\s-]/g, "");
}

/**
 * Checks if VIN has valid structure (correct length and characters)
 */
export function isValidVinStructure(vin: string): boolean {
  const normalized = normalizeVin(vin);
  if (normalized.length !== VIN_LENGTH) return false;
  return VALID_CHARS_REGEX.test(normalized);
}

/**
 * Finds forbidden characters in VIN
 */
function findForbiddenCharacters(vin: string): VinValidationError[] {
  const errors: VinValidationError[] = [];
  const normalized = normalizeVin(vin);

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (FORBIDDEN_CHARS.includes(char)) {
      errors.push({
        code: "FORBIDDEN_CHARACTER",
        message: `Character '${char}' is not allowed in VIN (position ${i + 1})`,
        position: i + 1,
        character: char,
      });
    }
  }

  return errors;
}

/**
 * Finds invalid characters in VIN
 */
function findInvalidCharacters(vin: string): VinValidationError[] {
  const errors: VinValidationError[] = [];
  const normalized = normalizeVin(vin);

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (!/[A-HJ-NPR-Z0-9]/.test(char)) {
      errors.push({
        code: "INVALID_CHARACTER",
        message: `Invalid character '${char}' at position ${i + 1}`,
        position: i + 1,
        character: char,
      });
    }
  }

  return errors;
}

/**
 * Validates a VIN and returns detailed result
 */
export function validateVin(vin: string): VinValidationResult {
  const normalizedVin = normalizeVin(vin);
  const errors: VinValidationError[] = [];

  // Check if VIN was provided
  if (!vin || vin.trim() === "") {
    errors.push({
      code: "VIN_EMPTY",
      message: "VIN was not provided",
    });

    return {
      valid: false,
      vin: vin || "",
      normalizedVin: "",
      errors,
      details: {
        lengthValid: false,
        charactersValid: false,
        checkDigitValid: false,
      },
    };
  }

  // Check length
  const lengthValid = normalizedVin.length === VIN_LENGTH;
  if (!lengthValid) {
    errors.push({
      code: "INVALID_LENGTH",
      message: `VIN must have exactly ${VIN_LENGTH} characters (received ${normalizedVin.length})`,
    });
  }

  // Check forbidden characters
  const forbiddenErrors = findForbiddenCharacters(normalizedVin);
  errors.push(...forbiddenErrors);

  // Check invalid characters
  const invalidErrors = findInvalidCharacters(normalizedVin);
  errors.push(...invalidErrors);

  const charactersValid =
    forbiddenErrors.length === 0 && invalidErrors.length === 0;

  // Check digit validation
  let checkDigitValid = false;
  let providedCheckDigit: string | undefined;
  let calculatedCheckDigit: string | undefined;

  if (lengthValid && charactersValid) {
    providedCheckDigit = normalizedVin[8];
    calculatedCheckDigit = calculateCheckDigit(normalizedVin) || undefined;
    checkDigitValid = providedCheckDigit === calculatedCheckDigit;

    if (!checkDigitValid && calculatedCheckDigit) {
      errors.push({
        code: "INVALID_CHECK_DIGIT",
        message: `Check digit invalid: expected '${calculatedCheckDigit}', received '${providedCheckDigit}'`,
        position: 9,
        character: providedCheckDigit,
      });
    }
  }

  const details: VinValidationDetails = {
    lengthValid,
    charactersValid,
    checkDigitValid,
    providedCheckDigit,
    calculatedCheckDigit,
  };

  return {
    valid: lengthValid && charactersValid && checkDigitValid,
    vin,
    normalizedVin,
    errors,
    details,
  };
}

/**
 * Checks if VIN is valid (simple boolean return)
 */
export function isValidVin(vin: string): boolean {
  return validateVin(vin).valid;
}
