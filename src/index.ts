export {
  normalizeVin,
  isValidVinStructure,
  validateVin,
  isValidVin,
} from "./core/validateVin";

export {
  calculateCheckDigit,
  verifyCheckDigit,
  extractCheckDigit,
  transliterateChar,
} from "./core/checkDigit";

export {
  parseVin,
  extractWmi,
  extractVds,
  extractVis,
  extractYearCode,
  extractPlantCode,
  extractSequentialNumber,
  reconstructVin,
} from "./core/parseVin";

export {
  decodeVin,
  decodeVinBasic,
  decodeManufacturer,
  decodeYear,
  isBrazilianVin,
  listKnownManufacturers,
} from "./decoder/decode";

export {
  inferModel,
  listKnownModels,
  hasModelPatterns,
  getModelPatternsMetadata,
} from "./decoder/inferModel";

export {
  calculateConfidenceScore,
  calculateYearConfidence,
  calculateModelConfidence,
  combineConfidenceScores,
} from "./decoder/confidenceScore";

export type {
  VinValidationResult,
  VinValidationError,
  VinValidationDetails,
  ManufacturerInfo,
  YearInfo,
  VinComponents,
  ModelInference,
  VinDecodeResult,
  DecodeOptions,
} from "./types";

export { DEFAULT_DISCLAIMER } from "./types";
