/// <reference types="jest" />
import {
  calculateConfidenceScore,
  calculateYearConfidence,
  calculateModelConfidence,
  combineConfidenceScores,
} from "../src/decoder/confidenceScore";

describe("calculateConfidenceScore", () => {
  describe("with complete information", () => {
    it("should return high confidence for complete valid decode", () => {
      const score = calculateConfidenceScore({
        vinValid: true,
        wmiFound: true,
        vdsPatternFound: true,
      });
      expect(score).toBeGreaterThan(0.7);
      expect(score).toBeLessThanOrEqual(1);
    });

    it("should return lower confidence for invalid VIN", () => {
      const score = calculateConfidenceScore({
        vinValid: false,
        wmiFound: true,
        vdsPatternFound: false,
      });
      expect(score).toBeLessThan(0.7);
    });
  });

  describe("with partial information", () => {
    it("should return medium confidence for missing VDS pattern", () => {
      const score = calculateConfidenceScore({
        vinValid: true,
        wmiFound: true,
        vdsPatternFound: false,
      });
      expect(score).toBeGreaterThan(0.4);
      expect(score).toBeLessThan(0.9);
    });

    it("should return low confidence for unknown manufacturer", () => {
      const score = calculateConfidenceScore({
        vinValid: true,
        wmiFound: false,
        vdsPatternFound: false,
      });
      expect(score).toBeLessThan(0.5);
    });
  });
});

describe("calculateYearConfidence", () => {
  describe("single year", () => {
    it("should return high confidence for single year result", () => {
      const confidence = calculateYearConfidence([2027]);
      expect(confidence).toBe(1.0);
    });
  });

  describe("multiple years", () => {
    it("should return lower confidence for multiple possible years", () => {
      const confidence = calculateYearConfidence([2001, 2031]);
      expect(confidence).toBeLessThan(1.0);
      expect(confidence).toBeGreaterThan(0);
    });

    it("should return lower confidence for more possible years", () => {
      const twoYears = calculateYearConfidence([2001, 2031]);
      const threeYears = calculateYearConfidence([1980, 2010, 2040]);
      expect(threeYears).toBeLessThan(twoYears);
    });
  });

  describe("no years", () => {
    it("should return 0 for empty array", () => {
      const confidence = calculateYearConfidence([]);
      expect(confidence).toBe(0);
    });
  });
});

describe("calculateModelConfidence", () => {
  describe("with model inference", () => {
    it("should return confidence based on pattern match", () => {
      const confidence = calculateModelConfidence("B22", "B22X5Y");
      expect(confidence).toBeGreaterThan(0);
      expect(confidence).toBeLessThanOrEqual(1);
    });
  });

  describe("without model inference", () => {
    it("should return 0 for undefined pattern", () => {
      const confidence = calculateModelConfidence(undefined, "B22X5Y");
      expect(confidence).toBe(0);
    });
  });
});

describe("combineConfidenceScores", () => {
  describe("basic combination", () => {
    it("should combine scores as average", () => {
      const combined = combineConfidenceScores([1.0, 0.5]);
      expect(combined).toBe(0.75);
    });

    it("should respect weights", () => {
      const combined = combineConfidenceScores([1.0, 0.0], [3, 1]);
      expect(combined).toBe(0.75);
    });
  });

  describe("edge cases", () => {
    it("should return 0 for empty scores", () => {
      const combined = combineConfidenceScores([]);
      expect(combined).toBe(0);
    });

    it("should handle single score", () => {
      const combined = combineConfidenceScores([0.8]);
      expect(combined).toBe(0.8);
    });
  });
});

describe("confidence score ranges", () => {
  it("should always return values between 0 and 1", () => {
    const testCases = [
      {
        vinValid: true,
        wmiFound: true,
        vdsPatternFound: true,
      },
      {
        vinValid: false,
        wmiFound: false,
        vdsPatternFound: false,
      },
      {
        vinValid: true,
        wmiFound: false,
        vdsPatternFound: false,
      },
    ];

    testCases.forEach((factors) => {
      const score = calculateConfidenceScore(factors);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });
});
