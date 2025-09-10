const FORBIDDEN_CHARS = ['I', 'O', 'Q'];
const VALID_CHARS = /^[A-HJ-NPR-Z0-9]+$/;

/**
 * Normalizes a VIN by converting to uppercase and removing spaces/dashes
 */
export function normalizeVin(vin: string): string {
  return vin.toUpperCase().replace(/[\s-]/g, '');
}

/**
 * Checks if VIN contains only valid characters
 */
export function hasValidCharacters(vin: string): boolean {
  const normalized = normalizeVin(vin);
  return VALID_CHARS.test(normalized);
}

/**
 * Finds forbidden characters in VIN
 */
export function findForbiddenCharacters(vin: string): { char: string; position: number }[] {
  const normalized = normalizeVin(vin);
  const found: { char: string; position: number }[] = [];
  
  for (let i = 0; i < normalized.length; i++) {
    if (FORBIDDEN_CHARS.includes(normalized[i])) {
      found.push({ char: normalized[i], position: i + 1 });
    }
  }
  
  return found;
}
