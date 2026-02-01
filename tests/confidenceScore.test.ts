import {
  calculateConfidenceScore,
  calculateYearConfidence,
  calculateModelConfidence,
  combineConfidenceScores
} from '../src/decoder/confidenceScore';

describe('calculateConfidenceScore', () => {
  describe('with complete information', () => {
    it('should return high confidence for complete valid decode', () => {
      const decodeResult = {
        vin: '9BWZZZ377VT004251',
        valid: true,
        manufacturer: 'Volkswagen do Brasil',
        country: 'Brazil',
        year: 2027,
        confidence: 0,
        disclaimer: ''
      };
      const score = calculateConfidenceScore(decodeResult);
      expect(score).toBeGreaterThan(0.7);
    });

    it('should return lower confidence for invalid VIN', () => {
      const decodeResult = {
        vin: '9BWZZZ370VT004251',
        valid: false,
        manufacturer: 'Volkswagen do Brasil',
        country: 'Brazil',
        confidence: 0,
        disclaimer: ''
      };
      const score = calculateConfidenceScore(decodeResult);
      expect(score).toBeLessThan(0.5);
    });
  });

  describe('with partial information', () => {
    it('should return medium confidence for missing year', () => {
      const decodeResult = {
        vin: '9BWZZZ377VT004251',
        valid: true,
        manufacturer: 'Volkswagen do Brasil',
        country: 'Brazil',
        confidence: 0,
        disclaimer: ''
      };
      const score = calculateConfidenceScore(decodeResult);
      expect(score).toBeGreaterThan(0.5);
    });

    it('should return low confidence for unknown manufacturer', () => {
      const decodeResult = {
        vin: 'XXXXXXXXXXXXXXXXX',
        valid: true,
        confidence: 0,
        disclaimer: ''
      };
      const score = calculateConfidenceScore(decodeResult);
      expect(score).toBeLessThan(0.5);
    });
  });

  describe('with model inference', () => {
    it('should increase confidence when model is inferred', () => {
      const withoutModel = {
        vin: '9BWZZZ377VT004251',
        valid: true,
        manufacturer: 'Volkswagen do Brasil',
        country: 'Brazil',
        confidence: 0,
        disclaimer: ''
      };
      const withModel = {
        ...withoutModel,
        model: 'Gol'
      };
      
      const scoreWithout = calculateConfidenceScore(withoutModel);
      const scoreWith = calculateConfidenceScore(withModel);
      
      expect(scoreWith).toBeGreaterThanOrEqual(scoreWithout);
    });
  });
});

describe('calculateYearConfidence', () => {
  describe('single year', () => {
    it('should return high confidence for single year result', () => {
      const confidence = calculateYearConfidence([2027]);
      expect(confidence).toBe(1.0);
    });
  });

  describe('multiple years', () => {
    it('should return lower confidence for multiple possible years', () => {
      const confidence = calculateYearConfidence([2001, 2031]);
      expect(confidence).toBeLessThan(1.0);
      expect(confidence).toBeGreaterThan(0);
    });

    it('should return lower confidence for more possible years', () => {
      const twoYears = calculateYearConfidence([2001, 2031]);
      const threeYears = calculateYearConfidence([1980, 2010, 2040]);
      expect(threeYears).toBeLessThan(twoYears);
    });
  });

  describe('no years', () => {
    it('should return 0 for empty array', () => {
      const confidence = calculateYearConfidence([]);
      expect(confidence).toBe(0);
    });
  });
});

describe('calculateModelConfidence', () => {
  describe('with model inference', () => {
    it('should return model inference confidence', () => {
      const inference = {
        model: 'Gol',
        confidence: 0.85,
        pattern: 'B22'
      };
      const confidence = calculateModelConfidence(inference);
      expect(confidence).toBe(0.85);
    });
  });

  describe('without model inference', () => {
    it('should return 0 for null inference', () => {
      const confidence = calculateModelConfidence(null);
      expect(confidence).toBe(0);
    });

    it('should return 0 for undefined inference', () => {
      const confidence = calculateModelConfidence(undefined);
      expect(confidence).toBe(0);
    });
  });
});

describe('combineConfidenceScores', () => {
  describe('basic combination', () => {
    it('should combine scores with weights', () => {
      const scores = [
        { score: 1.0, weight: 1 },
        { score: 0.5, weight: 1 }
      ];
      const combined = combineConfidenceScores(scores);
      expect(combined).toBe(0.75);
    });

    it('should respect weights', () => {
      const scores = [
        { score: 1.0, weight: 3 },
        { score: 0.0, weight: 1 }
      ];
      const combined = combineConfidenceScores(scores);
      expect(combined).toBe(0.75);
    });
  });

  describe('edge cases', () => {
    it('should return 0 for empty scores', () => {
      const combined = combineConfidenceScores([]);
      expect(combined).toBe(0);
    });

    it('should handle single score', () => {
      const scores = [{ score: 0.8, weight: 1 }];
      const combined = combineConfidenceScores(scores);
      expect(combined).toBe(0.8);
    });

    it('should handle zero weight', () => {
      const scores = [
        { score: 1.0, weight: 0 },
        { score: 0.5, weight: 1 }
      ];
      const combined = combineConfidenceScores(scores);
      expect(combined).toBe(0.5);
    });

    it('should clamp result between 0 and 1', () => {
      const scores = [
        { score: 1.5, weight: 1 },
        { score: 1.0, weight: 1 }
      ];
      const combined = combineConfidenceScores(scores);
      expect(combined).toBeLessThanOrEqual(1);
    });
  });

  describe('typical usage', () => {
    it('should combine validation, manufacturer, year, and model scores', () => {
      const scores = [
        { score: 1.0, weight: 2 },  // valid VIN
        { score: 1.0, weight: 2 },  // known manufacturer
        { score: 1.0, weight: 1 },  // year decoded
        { score: 0.8, weight: 1 }   // model inferred with 80% confidence
      ];
      const combined = combineConfidenceScores(scores);
      expect(combined).toBeGreaterThan(0.9);
    });
  });
});

describe('confidence score ranges', () => {
  it('should always return values between 0 and 1', () => {
    const testCases = [
      { vin: '9BWZZZ377VT004251', valid: true, manufacturer: 'VW', country: 'Brazil', year: 2027 },
      { vin: 'INVALID', valid: false },
      { vin: 'XXXXXXXXXXXXXXXXX', valid: true },
    ];

    testCases.forEach(decodeResult => {
      const score = calculateConfidenceScore({
        ...decodeResult,
        confidence: 0,
        disclaimer: ''
      });
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });
});
