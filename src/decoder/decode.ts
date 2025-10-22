import wmiData from '../datasets/wmi-br.json';
import yearData from '../datasets/year-map.json';
import { ManufacturerInfo, YearInfo } from '../types';
import { parseVin } from '../core/parseVin';
import { verifyCheckDigit } from '../core/checkDigit';
import { inferModel, ModelInference } from './inferModel';

const wmiDatabase = wmiData as Record<string, { manufacturer: string; country: string; countryCode: string }>;
const yearCodes = (yearData as any).codes as Record<string, number[]>;

export interface DecodeOptions {
  strict?: boolean;
  includeComponents?: boolean;
}

export interface VinDecodeResult {
  vin: string;
  valid: boolean;
  manufacturer: string | null;
  country: string | null;
  year: number | null;
  model: string | null;
  confidence: number;
}

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
export function decodeYear(yearCode: string, seventhChar?: string): YearInfo {
  const normalized = yearCode.toUpperCase();
  const years = yearCodes[normalized] || [];
  
  const currentYear = new Date().getFullYear();
  const validYears = years.filter(y => y <= currentYear + 1);
  
  let mostLikely: number | null = null;
  if (validYears.length === 1) {
    mostLikely = validYears[0];
  } else if (validYears.length > 1) {
    mostLikely = validYears[validYears.length - 1];
  }
  
  return {
    code: normalized,
    possibleYears: validYears,
    mostLikelyYear: mostLikely,
    confidence: validYears.length === 1 ? 1 : 0.5
  };
}

/**
 * Decodes a VIN
 */
export function decodeVin(vin: string, options: DecodeOptions = {}): VinDecodeResult {
  const parsed = parseVin(vin);
  
  if (!parsed) {
    return {
      vin,
      valid: false,
      manufacturer: null,
      country: null,
      year: null,
      model: null,
      confidence: 0
    };
  }
  
  const checkDigitValid = verifyCheckDigit(vin);
  if (options.strict && !checkDigitValid) {
    return {
      vin,
      valid: false,
      manufacturer: null,
      country: null,
      year: null,
      model: null,
      confidence: 0
    };
  }
  
  const manufacturerInfo = decodeManufacturer(parsed.wmi);
  const yearInfo = decodeYear(parsed.yearCode, parsed.vds[3]);
  const modelInfo = inferModel(parsed.wmi, parsed.vds);
  
  return {
    vin,
    valid: true,
    manufacturer: manufacturerInfo?.manufacturer || null,
    country: manufacturerInfo?.country || null,
    year: yearInfo.mostLikelyYear,
    model: modelInfo.model,
    confidence: 0.8
  };
}
