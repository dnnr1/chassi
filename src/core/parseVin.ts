import { normalizeVin, hasValidCharacters } from './validateVin';

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
 * Parses a VIN into its components
 */
export function parseVin(vin: string): VinComponents | null {
  const normalized = normalizeVin(vin);
  
  if (normalized.length !== 17) return null;
  if (!hasValidCharacters(normalized)) return null;
  
  return {
    wmi: normalized.substring(0, 3),
    vds: normalized.substring(3, 9),
    vis: normalized.substring(9, 17),
    checkDigit: normalized[8],
    yearCode: normalized[9],
    plantCode: normalized[10],
    sequentialNumber: normalized.substring(11, 17)
  };
}

/**
 * Extracts the World Manufacturer Identifier (positions 1-3)
 */
export function extractWmi(vin: string): string | null {
  const normalized = normalizeVin(vin);
  if (normalized.length < 3) return null;
  return normalized.substring(0, 3);
}

/**
 * Extracts the Vehicle Descriptor Section (positions 4-9)
 */
export function extractVds(vin: string): string | null {
  const normalized = normalizeVin(vin);
  if (normalized.length < 9) return null;
  return normalized.substring(3, 9);
}

/**
 * Extracts the Vehicle Identifier Section (positions 10-17)
 */
export function extractVis(vin: string): string | null {
  const normalized = normalizeVin(vin);
  if (normalized.length < 17) return null;
  return normalized.substring(9, 17);
}

/**
 * Extracts the year code (position 10)
 */
export function extractYearCode(vin: string): string | null {
  const normalized = normalizeVin(vin);
  if (normalized.length < 10) return null;
  return normalized[9];
}

/**
 * Extracts the plant code (position 11)
 */
export function extractPlantCode(vin: string): string | null {
  const normalized = normalizeVin(vin);
  if (normalized.length < 11) return null;
  return normalized[10];
}

/**
 * Extracts the sequential number (positions 12-17)
 */
export function extractSequentialNumber(vin: string): string | null {
  const normalized = normalizeVin(vin);
  if (normalized.length < 17) return null;
  return normalized.substring(11, 17);
}
