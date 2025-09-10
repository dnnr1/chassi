import { normalizeVin, hasValidCharacters, findForbiddenCharacters } from '../src/core/validateVin';

describe('normalizeVin', () => {
  it('should convert to uppercase', () => {
    expect(normalizeVin('abc')).toBe('ABC');
  });

  it('should remove spaces', () => {
    expect(normalizeVin('ABC DEF')).toBe('ABCDEF');
  });

  it('should remove dashes', () => {
    expect(normalizeVin('ABC-DEF')).toBe('ABCDEF');
  });
});

describe('hasValidCharacters', () => {
  it('should return true for valid characters', () => {
    expect(hasValidCharacters('ABCDEF123')).toBe(true);
  });

  it('should return false for forbidden I', () => {
    expect(hasValidCharacters('ABCIDEF')).toBe(false);
  });
});

describe('findForbiddenCharacters', () => {
  it('should find I, O, Q', () => {
    const result = findForbiddenCharacters('AIBOCQD');
    expect(result.length).toBe(3);
  });
});
