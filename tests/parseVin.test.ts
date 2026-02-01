import {
  parseVin,
  extractWmi,
  extractVds,
  extractVis,
  extractYearCode,
  extractPlantCode,
  extractSequentialNumber,
  reconstructVin
} from '../src/core/parseVin';

describe('parseVin', () => {
  const testVin = '9BWZZZ377VT004251';

  describe('complete parsing', () => {
    it('should parse all VIN components', () => {
      const result = parseVin(testVin);
      expect(result).not.toBeNull();
      expect(result!.wmi).toBe('9BW');
      expect(result!.vds).toBe('ZZZ377');
      expect(result!.vis).toBe('VT004251');
      expect(result!.checkDigit).toBe('7');
      expect(result!.yearCode).toBe('V');
      expect(result!.plantCode).toBe('T');
      expect(result!.sequentialNumber).toBe('004251');
    });

    it('should handle different VINs correctly', () => {
      const vin2 = '93HGK5860SZ000123';
      const result = parseVin(vin2);
      expect(result!.wmi).toBe('93H');
      expect(result!.vds).toBe('GK5860');
      expect(result!.vis).toBe('SZ000123');
      expect(result!.yearCode).toBe('S');
      expect(result!.plantCode).toBe('Z');
      expect(result!.sequentialNumber).toBe('000123');
    });
  });

  describe('invalid inputs', () => {
    it('should return null for VIN with wrong length', () => {
      expect(parseVin('12345')).toBeNull();
      expect(parseVin('123456789012345678')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(parseVin('')).toBeNull();
    });

    it('should return null for null input', () => {
      expect(parseVin(null as unknown as string)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(parseVin(undefined as unknown as string)).toBeNull();
    });
  });
});

describe('extractWmi', () => {
  it('should extract first 3 characters', () => {
    expect(extractWmi('9BWZZZ377VT004251')).toBe('9BW');
    expect(extractWmi('93HGK5860SZ000123')).toBe('93H');
    expect(extractWmi('WVWZZZ3CZWE000001')).toBe('WVW');
  });

  it('should return null for short input', () => {
    expect(extractWmi('9B')).toBeNull();
    expect(extractWmi('')).toBeNull();
  });
});

describe('extractVds', () => {
  it('should extract characters 4-9', () => {
    expect(extractVds('9BWZZZ377VT004251')).toBe('ZZZ377');
    expect(extractVds('93HGK5860SZ000123')).toBe('GK5860');
  });

  it('should return null for short input', () => {
    expect(extractVds('9BWZZ')).toBeNull();
  });
});

describe('extractVis', () => {
  it('should extract characters 10-17', () => {
    expect(extractVis('9BWZZZ377VT004251')).toBe('VT004251');
    expect(extractVis('93HGK5860SZ000123')).toBe('SZ000123');
  });

  it('should return null for short input', () => {
    expect(extractVis('9BWZZZ377')).toBeNull();
  });
});

describe('extractYearCode', () => {
  it('should extract the 10th character', () => {
    expect(extractYearCode('9BWZZZ377VT004251')).toBe('V');
    expect(extractYearCode('93HGK5860SZ000123')).toBe('S');
  });

  it('should return null for short input', () => {
    expect(extractYearCode('9BWZZZ377')).toBeNull();
  });
});

describe('extractPlantCode', () => {
  it('should extract the 11th character', () => {
    expect(extractPlantCode('9BWZZZ377VT004251')).toBe('T');
    expect(extractPlantCode('93HGK5860SZ000123')).toBe('Z');
  });

  it('should return null for short input', () => {
    expect(extractPlantCode('9BWZZZ377V')).toBeNull();
  });
});

describe('extractSequentialNumber', () => {
  it('should extract characters 12-17', () => {
    expect(extractSequentialNumber('9BWZZZ377VT004251')).toBe('004251');
    expect(extractSequentialNumber('93HGK5860SZ000123')).toBe('000123');
  });

  it('should return null for short input', () => {
    expect(extractSequentialNumber('9BWZZZ377VT')).toBeNull();
  });
});

describe('reconstructVin', () => {
  it('should reconstruct VIN from components', () => {
    const components = {
      wmi: '9BW',
      vds: 'ZZZ377',
      vis: 'VT004251',
      checkDigit: '7',
      yearCode: 'V',
      plantCode: 'T',
      sequentialNumber: '004251'
    };
    expect(reconstructVin(components)).toBe('9BWZZZ377VT004251');
  });

  it('should work with parseVin output', () => {
    const original = '9BWZZZ377VT004251';
    const parsed = parseVin(original);
    expect(parsed).not.toBeNull();
    expect(reconstructVin(parsed!)).toBe(original);
  });
});

describe('round-trip parsing', () => {
  const testVins = [
    '9BWZZZ377VT004251',
    '93HGK5860SZ000123',
    '9BD178226J0012345',
    'WVWZZZ3CZWE000001',
  ];

  testVins.forEach(vin => {
    it(`should round-trip ${vin}`, () => {
      const parsed = parseVin(vin);
      expect(parsed).not.toBeNull();
      expect(reconstructVin(parsed!)).toBe(vin);
    });
  });
});
