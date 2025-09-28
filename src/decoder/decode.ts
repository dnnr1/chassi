import wmiData from '../datasets/wmi-br.json';
import { ManufacturerInfo } from '../types';

const wmiDatabase = wmiData as Record<string, { manufacturer: string; country: string; countryCode: string }>;

/**
 * Decodes manufacturer from WMI
 */
export function decodeManufacturer(wmi: string): ManufacturerInfo | null {
  const normalized = wmi.toUpperCase();
  const data = wmiDatabase[normalized];
  
  if (!data) return null;
  
  return {
    wmi: normalized,
    manufacturer: data.manufacturer,
    country: data.country,
    countryCode: data.countryCode
  };
}
