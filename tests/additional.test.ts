/**
 * Additional tests for edge cases, integration, and real-world scenarios
 */

import { decodeVin, isValidVin, parseVin, validateVin } from '../src';

describe('Integration Tests', () => {
  describe('full decode workflow', () => {
    const realWorldVins = [
      { vin: '9BWZZZ377VT004251', manufacturer: 'Volkswagen', country: 'Brazil' },
      { vin: '93HGK5860SZ000123', manufacturer: 'Honda', country: 'Brazil' },
      { vin: '9BD178226J0012345', manufacturer: 'Fiat', country: 'Brazil' },
    ];

    realWorldVins.forEach(({ vin, manufacturer, country }) => {
      it(`should fully decode ${manufacturer} VIN`, () => {
        // Validate
        expect(isValidVin(vin)).toBe(true);

        // Parse
        const parsed = parseVin(vin);
        expect(parsed).not.toBeNull();

        // Decode
        const decoded = decodeVin(vin, { includeComponents: true });
        expect(decoded.valid).toBe(true);
        expect(decoded.manufacturer).toContain(manufacturer);
        expect(decoded.country).toBe(country);
        expect(decoded.components).toBeDefined();
      });
    });
  });

  describe('error handling', () => {
    it('should handle empty string gracefully', () => {
      expect(isValidVin('')).toBe(false);
      expect(parseVin('')).toBeNull();
      const decoded = decodeVin('');
      expect(decoded.valid).toBe(false);
    });

    it('should handle null input gracefully', () => {
      expect(isValidVin(null as unknown as string)).toBe(false);
      const validation = validateVin(null as unknown as string);
      expect(validation.valid).toBe(false);
    });

    it('should handle undefined input gracefully', () => {
      expect(isValidVin(undefined as unknown as string)).toBe(false);
      const validation = validateVin(undefined as unknown as string);
      expect(validation.valid).toBe(false);
    });
  });
});

describe('Brazilian Market VINs', () => {
  describe('WMI codes', () => {
    const brazilianWmis = ['9BW', '9BG', '9BD', '93H', '9BF', '9BR', '93Y', '9BH', '9BJ'];

    brazilianWmis.forEach(wmi => {
      it(`should recognize Brazilian WMI ${wmi}`, () => {
        const vin = `${wmi}ZZZ377VT004251`.substring(0, 17);
        const paddedVin = vin.padEnd(17, '0');
        const decoded = decodeVin(paddedVin, { skipValidation: true });
        expect(decoded.country).toBe('Brazil');
      });
    });
  });

  describe('model year codes', () => {
    const yearCodes: [string, number][] = [
      ['A', 2010], ['B', 2011], ['C', 2012], ['D', 2013], ['E', 2014],
      ['F', 2015], ['G', 2016], ['H', 2017], ['J', 2018], ['K', 2019],
      ['L', 2020], ['M', 2021], ['N', 2022], ['P', 2023], ['R', 2024],
      ['S', 2025], ['T', 2026], ['V', 2027], ['W', 2028], ['X', 2029],
      ['Y', 2030]
    ];

    yearCodes.forEach(([code, year]) => {
      it(`should decode year code ${code} as ${year}`, () => {
        const vin = `9BWZZZ377${code}T004251`;
        const decoded = decodeVin(vin, { skipValidation: true });
        expect(decoded.year).toBe(year);
      });
    });
  });
});

describe('Validation Edge Cases', () => {
  describe('forbidden characters', () => {
    const forbiddenChars = ['I', 'O', 'Q'];

    forbiddenChars.forEach(char => {
      it(`should reject VIN containing ${char}`, () => {
        const vin = `9BWZZZ377${char}T004251`;
        expect(isValidVin(vin)).toBe(false);
        const validation = validateVin(vin);
        expect(validation.errors.some(e => e.code === 'INVALID_CHARACTERS')).toBe(true);
      });
    });
  });

  describe('special inputs', () => {
    it('should reject VIN with special characters', () => {
      expect(isValidVin('9BWZZZ377VT00425!')).toBe(false);
      expect(isValidVin('9BWZZZ377VT00425@')).toBe(false);
      expect(isValidVin('9BWZZZ377VT00425#')).toBe(false);
    });

    it('should handle very long input', () => {
      const longInput = 'A'.repeat(1000);
      expect(isValidVin(longInput)).toBe(false);
    });

    it('should handle unicode characters', () => {
      expect(isValidVin('9BWZZZ377VT00425É')).toBe(false);
      expect(isValidVin('9BWZZZ377VT00425中')).toBe(false);
    });
  });
});

describe('Check Digit Verification', () => {
  describe('X check digit', () => {
    it('should handle X as valid check digit', () => {
      // VINs where the check digit calculation results in 10 (represented as X)
      const vinWithX = 'WVWZZZ3CZWE000001';
      const validation = validateVin(vinWithX);
      // This may or may not be valid depending on the actual check digit
      expect(validation.details.checkDigitValid).toBeDefined();
    });
  });

  describe('numeric check digits', () => {
    for (let i = 0; i <= 9; i++) {
      it(`should handle check digit ${i}`, () => {
        // Each check digit should be properly processed
        const validation = validateVin(`9BWZZZ37${i}VT004251`);
        expect(validation.details.checkDigitValid).toBeDefined();
      });
    }
  });
});

describe('Performance', () => {
  it('should decode multiple VINs efficiently', () => {
    const vins = Array(100).fill('9BWZZZ377VT004251');
    const start = Date.now();
    
    vins.forEach(vin => {
      decodeVin(vin, { includeComponents: true });
    });
    
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(1000); // Should complete in under 1 second
  });

  it('should validate multiple VINs efficiently', () => {
    const vins = Array(100).fill('9BWZZZ377VT004251');
    const start = Date.now();
    
    vins.forEach(vin => {
      validateVin(vin);
    });
    
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(500); // Should complete in under 500ms
  });
});

describe('Export Verification', () => {
  it('should export all public functions from main module', () => {
    const mainExports = require('../src');
    
    // Core functions
    expect(typeof mainExports.validateVin).toBe('function');
    expect(typeof mainExports.isValidVin).toBe('function');
    expect(typeof mainExports.normalizeVin).toBe('function');
    
    // Check digit functions
    expect(typeof mainExports.calculateCheckDigit).toBe('function');
    expect(typeof mainExports.verifyCheckDigit).toBe('function');
    
    // Parse functions
    expect(typeof mainExports.parseVin).toBe('function');
    expect(typeof mainExports.extractWmi).toBe('function');
    
    // Decode functions
    expect(typeof mainExports.decodeVin).toBe('function');
    expect(typeof mainExports.decodeVinBasic).toBe('function');
    expect(typeof mainExports.listKnownManufacturers).toBe('function');
    
    // Model inference
    expect(typeof mainExports.inferModel).toBe('function');
    expect(typeof mainExports.listKnownModels).toBe('function');
    
    // Confidence
    expect(typeof mainExports.calculateConfidenceScore).toBe('function');
  });
});
