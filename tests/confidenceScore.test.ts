import { calculateConfidenceScore, calculateYearConfidence, calculateModelConfidence } from '../src/decoder/confidenceScore';

describe('calculateConfidenceScore', () => {
  it('should return high score for all positive factors', () => {
    const score = calculateConfidenceScore({
      vinValid: true,
      wmiFound: true,
      vdsPatternFound: true,
      isBrazilian: true
    });
    expect(score).toBe(1);
  });

  it('should return low score for all negative factors', () => {
    const score = calculateConfidenceScore({
      vinValid: false,
      wmiFound: false,
      vdsPatternFound: false,
      isBrazilian: false
    });
    expect(score).toBe(0);
  });
});

describe('calculateYearConfidence', () => {
  it('should return 1 for single year', () => {
    expect(calculateYearConfidence([2020])).toBe(1);
  });

  it('should return 0 for empty years', () => {
    expect(calculateYearConfidence([])).toBe(0);
  });
});

describe('calculateModelConfidence', () => {
  it('should return 0 when no pattern', () => {
    expect(calculateModelConfidence(undefined, 'ZZZ377')).toBe(0);
  });
});
