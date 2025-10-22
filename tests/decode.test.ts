import { decodeVin, decodeManufacturer, decodeYear, isBrazilianVin } from '../src/decoder/decode';

describe('decodeVin', () => {
  it('should decode Volkswagen VIN', () => {
    const result = decodeVin('9BWZZZ377VT004251');
    expect(result.manufacturer).toBe('Volkswagen');
    expect(result.country).toBe('Brasil');
  });

  it('should include components when requested', () => {
    const result = decodeVin('9BWZZZ377VT004251', { includeComponents: true });
    expect(result.components).toBeDefined();
    expect(result.components?.wmi).toBe('9BW');
  });

  it('should return invalid for short VIN', () => {
    const result = decodeVin('123');
    expect(result.valid).toBe(false);
  });
});

describe('isBrazilianVin', () => {
  it('should return true for Brazilian VIN', () => {
    expect(isBrazilianVin('9BWZZZ377VT004251')).toBe(true);
  });

  it('should return false for non-Brazilian VIN', () => {
    expect(isBrazilianVin('WVWZZZ377VT004251')).toBe(false);
  });
});
