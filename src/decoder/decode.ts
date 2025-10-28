import wmiData from '../datasets/wmi-br.json';
import yearData from '../datasets/year-map.json';
import { ManufacturerInfo, YearInfo } from '../types';
import { VinComponents, parseVin } from '../core/parseVin';
import { verifyCheckDigit } from '../core/checkDigit';
import { inferModel, ModelInference } from './inferModel';
import { calculateConfidenceScore } from './confidenceScore';

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
  possibleYears?: number[];
  model: string | null;
  confidence: number;
  components?: VinComponents;
  disclaimer: string;
}

const DISCLAIMER = "The returned data is inferred and unofficial. Always verify with official sources.";

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
 * Checks if VIN is Brazilian
 */
export function isBrazilianVin(vin: string): boolean {
  if (vin.length < 1) return false;
  return vin[0] === '9';
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
      confidence: 0,
      disclaimer: DISCLAIMER
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
      confidence: 0,
      disclaimer: DISCLAIMER
    };
  }
  
  const manufacturerInfo = decodeManufacturer(parsed.wmi);
  const yearInfo = decodeYear(parsed.yearCode, parsed.vds[3]);
  const modelInfo = inferModel(parsed.wmi, parsed.vds);
  
  const confidence = calculateConfidenceScore({
    vinValid: true,
    wmiFound: manufacturerInfo !== null,
    vdsPatternFound: modelInfo.model !== null,
    isBrazilian: isBrazilianVin(vin)
  });
  
  const result: VinDecodeResult = {
    vin,
    valid: true,
    manufacturer: manufacturerInfo?.manufacturer || null,
    country: manufacturerInfo?.country || null,
    year: yearInfo.mostLikelyYear,
    possibleYears: yearInfo.possibleYears,
    model: modelInfo.model,
    confidence,
    disclaimer: DISCLAIMER
  };
  
  if (options.includeComponents) {
    result.components = parsed;
  }
  
  return result;
}

export function listKnownManufacturers(country?: string): ManufacturerInfo[] {
  const manufacturers: ManufacturerInfo[] = [];
  
  for (const [wmi, data] of Object.entries(wmiDatabase)) {
    if (!country || data.country.toLowerCase() === country.toLowerCase()) {
      manufacturers.push({
        wmi,
        manufacturer: data.manufacturer,
        country: data.country,
        countryCode: data.countryCode
      });
    }
  }
  
  return manufacturers;
}
