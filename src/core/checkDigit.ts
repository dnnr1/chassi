const TRANSLITERATION: Record<string, number> = {
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8,
  'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9,
  'S': 2, 'T': 3, 'U': 4, 'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9
};

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Transliterates a character to its numeric value per ISO 3779
 */
export function transliterateChar(char: string): number | null {
  const c = char.toUpperCase();
  if (/[0-9]/.test(c)) return parseInt(c);
  if (TRANSLITERATION[c] !== undefined) return TRANSLITERATION[c];
  return null;
}

/**
 * Calculates the check digit for a VIN
 */
export function calculateCheckDigit(vin: string): string | null {
  if (vin.length !== 17) return null;
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    if (i === 8) continue;
    const value = transliterateChar(vin[i]);
    if (value === null) return null;
    sum += value * WEIGHTS[i];
  }
  
  const remainder = sum % 11;
  return remainder === 10 ? 'X' : remainder.toString();
}

/**
 * Verifies if the check digit in a VIN is correct
 */
export function verifyCheckDigit(vin: string): boolean {
  if (vin.length !== 17) return false;
  const calculated = calculateCheckDigit(vin);
  if (calculated === null) return false;
  return vin[8].toUpperCase() === calculated;
}

/**
 * Extracts the check digit from a VIN
 */
export function extractCheckDigit(vin: string): string | null {
  if (vin.length < 9) return null;
  return vin[8].toUpperCase();
}
