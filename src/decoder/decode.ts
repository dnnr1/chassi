import wmiData from "../datasets/wmi.json";
import yearData from "../datasets/year-map.json";
import {
  ManufacturerInfo,
  YearInfo,
  VinDecodeResult,
  DecodeOptions,
  DEFAULT_DISCLAIMER,
} from "../types";
import { parseVin } from "../core/parseVin";
import { verifyCheckDigit } from "../core/checkDigit";
import { normalizeVin } from "../core/validateVin";
import { inferModel } from "./inferModel";
import { calculateConfidenceScore } from "./confidenceScore";

const { _metadata, ...wmiEntries } = wmiData as any;
const wmiDatabase = wmiEntries as Record<
  string,
  { manufacturer: string; country: string; countryCode: string }
>;
const yearCodes = (yearData as any).codes as Record<string, number[]>;

export function decodeManufacturer(wmi: string): ManufacturerInfo | null {
  const normalized = wmi.toUpperCase();
  const data = wmiDatabase[normalized];

  if (data) {
    return {
      wmi: normalized,
      manufacturer: data.manufacturer,
      country: data.country,
      countryCode: data.countryCode,
    };
  }

  return null;
}

export function decodeYear(yearCode: string, seventhChar?: string): YearInfo {
  const normalized = yearCode.toUpperCase();
  const years = yearCodes[normalized] || [];

  const currentYear = new Date().getFullYear();
  const validYears = years.filter((y) => y <= currentYear + 1);

  let mostLikely: number | null = null;
  let confidence = 0;

  if (validYears.length === 1) {
    mostLikely = validYears[0];
    confidence = 1;
  } else if (validYears.length > 1) {
    if (seventhChar && /[0-9]/.test(seventhChar)) {
      mostLikely = validYears[validYears.length - 1];
      confidence = 0.8;
    } else {
      mostLikely = validYears[validYears.length - 1];
      confidence = 0.5;
    }
  }

  return {
    code: normalized,
    possibleYears: validYears,
    mostLikelyYear: mostLikely,
    confidence,
  };
}

/** Main decode function. Returns manufacturer, country, year, model and confidence. */
export function decodeVin(
  vin: string,
  options: DecodeOptions = {},
): VinDecodeResult {
  const parsed = parseVin(vin);

  if (!parsed) {
    return {
      vin,
      valid: false,
      manufacturer: null,
      country: null,
      countryCode: null,
      year: null,
      possibleYears: [],
      model: null,
      confidence: 0,
      disclaimer: DEFAULT_DISCLAIMER,
    };
  }

  const checkDigitValid = verifyCheckDigit(vin);
  if (options.strict && !checkDigitValid) {
    return {
      vin,
      valid: false,
      manufacturer: null,
      country: null,
      countryCode: null,
      year: null,
      possibleYears: [],
      model: null,
      confidence: 0,
      disclaimer: DEFAULT_DISCLAIMER,
    };
  }

  const manufacturerInfo = decodeManufacturer(parsed.wmi);
  const yearInfo = decodeYear(parsed.yearCode, parsed.vds[3]);
  const modelInfo = inferModel(parsed.wmi, parsed.vds);

  const confidence = calculateConfidenceScore({
    vinValid: true,
    wmiFound:
      manufacturerInfo !== null && manufacturerInfo.manufacturer !== "Unknown",
    vdsPatternFound: modelInfo.model !== null,
  });

  const result: VinDecodeResult = {
    vin,
    valid: true,
    manufacturer: manufacturerInfo?.manufacturer || null,
    country: manufacturerInfo?.country || null,
    countryCode: manufacturerInfo?.countryCode || null,
    year: yearInfo.mostLikelyYear,
    possibleYears: yearInfo.possibleYears,
    model: modelInfo.model,
    confidence,
    disclaimer: DEFAULT_DISCLAIMER,
  };

  if (options.includeComponents) {
    result.components = parsed;
  }

  return result;
}

export function decodeVinBasic(vin: string): {
  manufacturer: string | null;
  country: string | null;
  year: number | null;
  model: string | null;
} {
  const result = decodeVin(vin);
  return {
    manufacturer: result.manufacturer,
    country: result.country,
    year: result.year,
    model: result.model,
  };
}

export function listKnownManufacturers(country?: string): ManufacturerInfo[] {
  const manufacturers: ManufacturerInfo[] = [];

  for (const [wmi, data] of Object.entries(wmiDatabase)) {
    if (!country || data.country.toLowerCase() === country.toLowerCase()) {
      manufacturers.push({
        wmi,
        manufacturer: data.manufacturer,
        country: data.country,
        countryCode: data.countryCode,
      });
    }
  }

  return manufacturers;
}
