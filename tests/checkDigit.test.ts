import {
  calculateCheckDigit,
  verifyCheckDigit,
  extractCheckDigit,
  transliterateChar
} from '../src/core/checkDigit';

describe('transliterateChar', () => {
  describe('numeric characters', () => {
    it('should return the same value for digits 0-9', () => {
      for (let i = 0; i <= 9; i++) {
        expect(transliterateChar(String(i))).toBe(i);
      }
    });
  });

  describe('alphabetic characters', () => {
    const charValues: [string, number][] = [
      ['A', 1], ['B', 2], ['C', 3], ['D', 4], ['E', 5],
      ['F', 6], ['G', 7], ['H', 8], ['J', 1], ['K', 2],
      ['L', 3], ['M', 4], ['N', 5], ['P', 7], ['R', 9],
      ['S', 2], ['T', 3], ['U', 4], ['V', 5], ['W', 6],
      ['X', 7], ['Y', 8], ['Z', 9]
    ];

    charValues.forEach(([char, value]) => {
      it(`should return ${value} for character ${char}`, () => {
        expect(transliterateChar(char)).toBe(value);
      });
    });
  });

  describe('invalid characters', () => {
    it('should return 0 for letter I', () => {
      expect(transliterateChar('I')).toBe(0);
    });

    it('should return 0 for letter O', () => {
      expect(transliterateChar('O')).toBe(0);
    });

    it('should return 0 for letter Q', () => {
      expect(transliterateChar('Q')).toBe(0);
    });
  });
});

describe('calculateCheckDigit', () => {
  describe('valid VINs', () => {
    const testCases: [string, string][] = [
      ['9BWZZZ377VT004251', '7'],
      ['93HGK5860SZ000123', '6'],
      ['9BD178226J0012345', '2'],
      ['11111111111111111', '1'],
      ['WVWZZZ3CZWE000001', 'X'],
    ];

    testCases.forEach(([vin, expectedDigit]) => {
      it(`should calculate check digit ${expectedDigit} for ${vin}`, () => {
        expect(calculateCheckDigit(vin)).toBe(expectedDigit);
      });
    });
  });

  describe('invalid inputs', () => {
    it('should return null for VIN with wrong length', () => {
      expect(calculateCheckDigit('12345')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(calculateCheckDigit('')).toBeNull();
    });

    it('should return null for null input', () => {
      expect(calculateCheckDigit(null as unknown as string)).toBeNull();
    });
  });

  describe('check digit X', () => {
    it('should return X when remainder is 10', () => {
      // VIN specifically constructed to have check digit X
      const vin = 'WVWZZZ3CZWE000001';
      const result = calculateCheckDigit(vin);
      expect(result).toBe('X');
    });
  });
});

describe('verifyCheckDigit', () => {
  describe('valid check digits', () => {
    const validVins = [
      '9BWZZZ377VT004251',
      '93HGK5860SZ000123',
      '9BD178226J0012345',
    ];

    validVins.forEach(vin => {
      it(`should return true for ${vin}`, () => {
        expect(verifyCheckDigit(vin)).toBe(true);
      });
    });
  });

  describe('invalid check digits', () => {
    it('should return false for VIN with wrong check digit', () => {
      // Original: 9BWZZZ377VT004251 (check digit is 7)
      expect(verifyCheckDigit('9BWZZZ370VT004251')).toBe(false);
      expect(verifyCheckDigit('9BWZZZ371VT004251')).toBe(false);
      expect(verifyCheckDigit('9BWZZZ379VT004251')).toBe(false);
    });

    it('should return false for invalid VIN', () => {
      expect(verifyCheckDigit('INVALID')).toBe(false);
    });
  });
});

describe('extractCheckDigit', () => {
  it('should extract the 9th character', () => {
    expect(extractCheckDigit('9BWZZZ377VT004251')).toBe('7');
    expect(extractCheckDigit('93HGK5860SZ000123')).toBe('0');
    expect(extractCheckDigit('WVWZZZ3CZWE000001')).toBe('Z');
  });

  it('should return null for short VIN', () => {
    expect(extractCheckDigit('12345678')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(extractCheckDigit('')).toBeNull();
  });
});

describe('weight positions', () => {
  // The weights for positions 1-17 are: 8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2
  // Position 9 (check digit) has weight 0
  it('should correctly calculate with all weights', () => {
    // Testing with a known VIN where we can verify the calculation
    const vin = '9BWZZZ377VT004251';
    const calculatedDigit = calculateCheckDigit(vin);
    const extractedDigit = extractCheckDigit(vin);
    expect(calculatedDigit).toBe(extractedDigit);
  });
});
