/**
 * Normalizes a VIN by converting to uppercase and removing spaces/dashes
 */
export function normalizeVin(vin: string): string {
  return vin.toUpperCase().replace(/[\s-]/g, '');
}
