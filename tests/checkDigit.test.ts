import { transliterateChar, calculateCheckDigit, verifyCheckDigit } from '../src/core/checkDigit';

describe('transliterateChar', () => {
  it('should return same value for digits', () => {
    expect(transliterateChar('5')).toBe(5);
  });

  it('should transliterate A to 1', () => {
    expect(transliterateChar('A')).toBe(1);
  });

  it('should return null for I, O, Q', () => {
    expect(transliterateChar('I')).toBe(null);
    expect(transliterateChar('O')).toBe(null);
    expect(transliterateChar('Q')).toBe(null);
  });
});

describe('calculateCheckDigit', () => {
  it('should return null for invalid length', () => {
    expect(calculateCheckDigit('123')).toBe(null);
  });

  it('should calculate check digit', () => {
    const result = calculateCheckDigit('11111111111111111');
    expect(result).not.toBe(null);
  });
});

describe('verifyCheckDigit', () => {
  it('should return false for short VIN', () => {
    expect(verifyCheckDigit('123')).toBe(false);
  });
});
