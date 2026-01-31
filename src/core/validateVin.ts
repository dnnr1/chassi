import {
  VinValidationResult,
  VinValidationError,
  VinValidationDetails,
} from "../types";
import { calculateCheckDigit } from "./checkDigit";
import wmiData from "../datasets/wmi.json";

const { _metadata, ...wmiEntries } = wmiData as any;
const wmiDatabase = wmiEntries as Record<
  string,
  { manufacturer: string; country: string; countryCode: string }
>;

/** Countries that require check digit validation (North American region) */
const CHECK_DIGIT_REQUIRED_COUNTRIES = ["US", "CA", "MX"];

export interface ValidateVinOptions {
  /**
   * When true, enforces check digit validation for all VINs.
   * When false, only validates check digit for North American vehicles.
   * Default: false (auto-detect based on WMI)
   */
  strictCheckDigit?: boolean;
}

/**
 * Determines if check digit validation is required for a VIN.
 * North American vehicles (US, CA, MX) require check digit validation.
 * European and other regions do not use the ISO 3779 check digit system.
 */
function isCheckDigitRequired(wmi: string): boolean {
  const data = wmiDatabase[wmi.toUpperCase()];
  if (!data) {
    const firstChar = wmi[0];
    return /[1-5]/.test(firstChar);
  }
  return CHECK_DIGIT_REQUIRED_COUNTRIES.includes(data.countryCode);
}

const VIN_LENGTH = 17;
const FORBIDDEN_CHARS = ["I", "O", "Q"];
const VALID_CHARS_REGEX = /^[A-HJ-NPR-Z0-9]+$/;

export function normalizeVin(vin: string): string {
  if (!vin) return "";
  return vin.toUpperCase().replace(/[\s-]/g, "");
}

export function isValidVinStructure(vin: string): boolean {
  const normalized = normalizeVin(vin);
  if (normalized.length !== VIN_LENGTH) return false;
  return VALID_CHARS_REGEX.test(normalized);
}

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

export function validateVin(
  vin: string,
  options: ValidateVinOptions = {},
): VinValidationResult {
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
  let checkDigitApplicable = true;

  if (lengthValid && charactersValid) {
    const wmi = normalizedVin.substring(0, 3);
    checkDigitApplicable =
      options.strictCheckDigit ?? isCheckDigitRequired(wmi);

    providedCheckDigit = normalizedVin[8];
    calculatedCheckDigit = calculateCheckDigit(normalizedVin) || undefined;

    if (checkDigitApplicable) {
      checkDigitValid = providedCheckDigit === calculatedCheckDigit;

      if (!checkDigitValid && calculatedCheckDigit) {
        errors.push({
          code: "INVALID_CHECK_DIGIT",
          message: `Check digit invalid: expected '${calculatedCheckDigit}', received '${providedCheckDigit}'`,
          position: 9,
          character: providedCheckDigit,
        });
      }
    } else {
      // For non-North American VINs, check digit position can contain any valid character
      // Mark as valid since check digit validation doesn't apply
      checkDigitValid = true;
    }
  }

  const details: VinValidationDetails = {
    lengthValid,
    charactersValid,
    checkDigitValid,
    checkDigitApplicable,
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

export function isValidVin(vin: string): boolean {
  return validateVin(vin).valid;
}
