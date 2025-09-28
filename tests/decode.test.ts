import { decodeManufacturer, decodeYear } from '../src/decoder/decode';

describe('decodeManufacturer', () => {
  it('should decode Volkswagen Brazil', () => {
    const result = decodeManufacturer('9BW');
    expect(result?.manufacturer).toBe('Volkswagen');
    expect(result?.country).toBe('Brasil');
  });

  it('should decode Chevrolet Brazil', () => {
    const result = decodeManufacturer('9BG');
    expect(result?.manufacturer).toBe('Chevrolet (General Motors)');
  });

  it('should return null for unknown WMI', () => {
    expect(decodeManufacturer('ZZZ')).toBeNull();
  });
});

describe('decodeYear', () => {
  it('should decode V as 1997 or 2027', () => {
    const result = decodeYear('V');
    expect(result.possibleYears).toContain(1997);
    expect(result.possibleYears).toContain(2027);
  });
});
