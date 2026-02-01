import {
  decodeVin,
  decodeVinBasic,
  decodeManufacturer,
  decodeYear,
  isBrazilianVin,
  listKnownManufacturers
} from '../src/decoder/decode';

describe('decodeManufacturer', () => {
  describe('Brazilian manufacturers', () => {
    const brazilianWmis: [string, string][] = [
      ['9BW', 'Volkswagen do Brasil'],
      ['9BG', 'General Motors Brasil'],
      ['9BD', 'Fiat Automóveis'],
      ['93H', 'Honda Automóveis do Brasil'],
      ['9BF', 'Ford Motor Company Brasil'],
      ['9BR', 'Toyota do Brasil'],
      ['93Y', 'Renault do Brasil'],
      ['9BH', 'Hyundai Motor Brasil'],
      ['9BJ', 'Jeep Brasil'],
    ];

    brazilianWmis.forEach(([wmi, expected]) => {
      it(`should identify ${expected} for WMI ${wmi}`, () => {
        const result = decodeManufacturer(wmi);
        expect(result).not.toBeNull();
        expect(result!.name).toBe(expected);
        expect(result!.country).toBe('Brazil');
      });
    });
  });

  describe('international manufacturers', () => {
    it('should decode Volkswagen Germany', () => {
      const result = decodeManufacturer('WVW');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Volkswagen AG');
      expect(result!.country).toBe('Germany');
    });

    it('should decode Mercedes-Benz', () => {
      const result = decodeManufacturer('WDB');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Mercedes-Benz');
      expect(result!.country).toBe('Germany');
    });

    it('should decode BMW', () => {
      const result = decodeManufacturer('WBA');
      expect(result).not.toBeNull();
      expect(result!.name).toBe('BMW AG');
      expect(result!.country).toBe('Germany');
    });
  });

  describe('unknown manufacturers', () => {
    it('should return null for unknown WMI', () => {
      expect(decodeManufacturer('XXX')).toBeNull();
      expect(decodeManufacturer('ZZZ')).toBeNull();
    });
  });
});

describe('decodeYear', () => {
  describe('2010+ year codes', () => {
    const yearCodes: [string, number[]][] = [
      ['A', [2010]],
      ['B', [2011]],
      ['C', [2012]],
      ['D', [2013]],
      ['E', [2014]],
      ['F', [2015]],
      ['G', [2016]],
      ['H', [2017]],
      ['J', [2018]],
      ['K', [2019]],
      ['L', [2020]],
      ['M', [2021]],
      ['N', [2022]],
      ['P', [2023]],
      ['R', [2024]],
      ['S', [2025]],
      ['T', [2026]],
      ['V', [2027]],
      ['W', [2028]],
      ['X', [2029]],
      ['Y', [2030]],
    ];

    yearCodes.forEach(([code, expectedYears]) => {
      it(`should decode year code ${code}`, () => {
        const result = decodeYear(code);
        expect(result).not.toBeNull();
        expect(result!.possibleYears).toContain(expectedYears[0]);
      });
    });
  });

  describe('numeric year codes', () => {
    const numericCodes: [string, number[]][] = [
      ['1', [2001, 2031]],
      ['2', [2002, 2032]],
      ['3', [2003, 2033]],
      ['4', [2004, 2034]],
      ['5', [2005, 2035]],
      ['6', [2006, 2036]],
      ['7', [2007, 2037]],
      ['8', [2008, 2038]],
      ['9', [2009, 2039]],
    ];

    numericCodes.forEach(([code, expectedYears]) => {
      it(`should decode numeric year code ${code}`, () => {
        const result = decodeYear(code);
        expect(result).not.toBeNull();
        expectedYears.forEach(year => {
          expect(result!.possibleYears).toContain(year);
        });
      });
    });
  });

  describe('invalid codes', () => {
    it('should return null for invalid codes', () => {
      expect(decodeYear('I')).toBeNull();
      expect(decodeYear('O')).toBeNull();
      expect(decodeYear('Q')).toBeNull();
      expect(decodeYear('U')).toBeNull();
      expect(decodeYear('Z')).toBeNull();
      expect(decodeYear('0')).toBeNull();
    });
  });
});

describe('isBrazilianVin', () => {
  it('should return true for Brazilian VINs', () => {
    expect(isBrazilianVin('9BWZZZ377VT004251')).toBe(true);
    expect(isBrazilianVin('9BGZZZ377VT004251')).toBe(true);
    expect(isBrazilianVin('93HGK5860SZ000123')).toBe(true);
  });

  it('should return false for non-Brazilian VINs', () => {
    expect(isBrazilianVin('WVWZZZ3CZWE000001')).toBe(false);
    expect(isBrazilianVin('1HGBH41JXMN109186')).toBe(false);
  });
});

describe('decodeVin', () => {
  describe('valid Brazilian VINs', () => {
    it('should decode Volkswagen VIN', () => {
      const result = decodeVin('9BWZZZ377VT004251');
      expect(result.valid).toBe(true);
      expect(result.manufacturer).toBe('Volkswagen do Brasil');
      expect(result.country).toBe('Brazil');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.disclaimer).toBeDefined();
    });

    it('should decode Honda VIN', () => {
      const result = decodeVin('93HGK5860SZ000123');
      expect(result.valid).toBe(true);
      expect(result.manufacturer).toBe('Honda Automóveis do Brasil');
      expect(result.country).toBe('Brazil');
    });

    it('should decode Fiat VIN', () => {
      const result = decodeVin('9BD178226J0012345');
      expect(result.valid).toBe(true);
      expect(result.manufacturer).toBe('Fiat Automóveis');
      expect(result.country).toBe('Brazil');
    });
  });

  describe('options', () => {
    it('should include components when requested', () => {
      const result = decodeVin('9BWZZZ377VT004251', { includeComponents: true });
      expect(result.components).toBeDefined();
      expect(result.components!.wmi).toBe('9BW');
      expect(result.components!.vds).toBe('ZZZ377');
      expect(result.components!.vis).toBe('VT004251');
    });

    it('should not include components by default', () => {
      const result = decodeVin('9BWZZZ377VT004251');
      expect(result.components).toBeUndefined();
    });

    it('should skip validation when requested', () => {
      const result = decodeVin('9BWZZZ370VT004251', { skipValidation: true });
      expect(result.valid).toBe(true);
    });
  });

  describe('invalid VINs', () => {
    it('should mark invalid VIN', () => {
      const result = decodeVin('INVALID');
      expect(result.valid).toBe(false);
    });

    it('should still return partial info for invalid VIN', () => {
      const result = decodeVin('9BWZZZ370VT004251'); // wrong check digit
      expect(result.valid).toBe(false);
      expect(result.manufacturer).toBe('Volkswagen do Brasil');
    });
  });
});

describe('decodeVinBasic', () => {
  it('should return basic decode without options', () => {
    const result = decodeVinBasic('9BWZZZ377VT004251');
    expect(result.valid).toBe(true);
    expect(result.manufacturer).toBeDefined();
    expect(result.components).toBeUndefined();
  });
});

describe('listKnownManufacturers', () => {
  it('should return array of manufacturers', () => {
    const manufacturers = listKnownManufacturers();
    expect(Array.isArray(manufacturers)).toBe(true);
    expect(manufacturers.length).toBeGreaterThan(0);
  });

  it('should include Brazilian manufacturers', () => {
    const manufacturers = listKnownManufacturers();
    const brazilianManufacturers = manufacturers.filter(m => m.country === 'Brazil');
    expect(brazilianManufacturers.length).toBeGreaterThan(5);
  });

  it('should have required properties', () => {
    const manufacturers = listKnownManufacturers();
    manufacturers.forEach(m => {
      expect(m.wmi).toBeDefined();
      expect(m.name).toBeDefined();
      expect(m.country).toBeDefined();
    });
  });
});

describe('confidence scoring', () => {
  it('should have higher confidence for valid VIN with known manufacturer', () => {
    const result = decodeVin('9BWZZZ377VT004251');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should have lower confidence for unknown manufacturer', () => {
    const result = decodeVin('XXXZZZ377VT004251', { skipValidation: true });
    expect(result.confidence).toBeLessThan(0.5);
  });
});
