import { parseVin, extractWmi, extractVds, extractVis, extractYearCode } from '../src/core/parseVin';

describe('parseVin', () => {
  it('should parse valid VIN', () => {
    const result = parseVin('9BWZZZ377VT004251');
    expect(result).not.toBeNull();
    expect(result?.wmi).toBe('9BW');
    expect(result?.vds).toBe('ZZZ377');
  });

  it('should return null for short VIN', () => {
    expect(parseVin('123')).toBeNull();
  });
});

describe('extractWmi', () => {
  it('should extract first 3 characters', () => {
    expect(extractWmi('9BWZZZ377VT004251')).toBe('9BW');
  });
});

describe('extractVds', () => {
  it('should extract characters 4-9', () => {
    expect(extractVds('9BWZZZ377VT004251')).toBe('ZZZ377');
  });
});

describe('extractYearCode', () => {
  it('should extract 10th character', () => {
    expect(extractYearCode('9BWZZZ377VT004251')).toBe('V');
  });
});
