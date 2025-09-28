import wmiData from '../datasets/wmi-br.json';
import yearData from '../datasets/year-map.json';
import { ManufacturerInfo, YearInfo } from '../types';

const wmiDatabase = wmiData as Record<string, { manufacturer: string; country: string; countryCode: string }>;
const yearCodes = (yearData as any).codes as Record<string, number[]>;

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

/**
 * Decodes year from year code
 */
export function decodeYear(yearCode: string): YearInfo {
  const normalized = yearCode.toUpperCase();
  const years = yearCodes[normalized] || [];
  
  return {
    code: normalized,
    possibleYears: years,
    mostLikelyYear: years.length > 0 ? years[years.length - 1] : null,
    confidence: years.length === 1 ? 1 : years.length === 2 ? 0.5 : 0
  };
}
