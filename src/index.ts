// Core validation functions
export {
  normalizeVin,
  isValidVinStructure,
  validateVin,
  isValidVin
} from './core/validateVin';

// Check digit functions
export {
  calculateCheckDigit,
  verifyCheckDigit,
  extractCheckDigit,
  transliterateChar
} from './core/checkDigit';

// VIN parsing functions
export {
  parseVin,
  extractWmi,
  extractVds,
  extractVis,
  extractYearCode,
  extractPlantCode,
  extractSequentialNumber,
  reconstructVin
} from './core/parseVin';

// Decoder functions
export {
  decodeVin,
  decodeVinBasic,
  decodeManufacturer,
  decodeYear,
  isBrazilianVin,
  listKnownManufacturers
} from './decoder/decode';

// Model inference functions
export {
  inferModel,
  listKnownModels,
  hasModelPatterns,
  getModelPatternsMetadata
} from './decoder/inferModel';

// Confidence calculation functions
export {
  calculateConfidenceScore,
  calculateYearConfidence,
  calculateModelConfidence,
  combineConfidenceScores
} from './decoder/confidenceScore';

// Type exports
export type {
  VinValidationResult,
  VinValidationError,
  VinValidationDetails,
  ManufacturerInfo,
  YearInfo,
  VinComponents,
  ModelInference,
  ModelPattern,
  VinDecodeResult,
  DecodeOptions
} from './types';

// Constants
export { DEFAULT_DISCLAIMER } from './types';
