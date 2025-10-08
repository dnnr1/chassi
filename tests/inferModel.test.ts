import { inferModel, listKnownModels } from '../src/decoder/inferModel';

describe('inferModel', () => {
  it('should infer Gol for 9BW + ZZZ37', () => {
    const result = inferModel('9BW', 'ZZZ377');
    expect(result.model).toBe('Gol');
  });

  it('should infer Onix for 9BG + JB', () => {
    const result = inferModel('9BG', 'JB1234');
    expect(result.model).toBe('Onix');
  });

  it('should return null for unknown WMI', () => {
    const result = inferModel('ZZZ', 'ABCDEF');
    expect(result.model).toBeNull();
  });
});

describe('listKnownModels', () => {
  it('should list Volkswagen models', () => {
    const models = listKnownModels('9BW');
    expect(models).toContain('Gol');
    expect(models).toContain('Fox');
  });

  it('should return empty for unknown WMI', () => {
    const models = listKnownModels('ZZZ');
    expect(models).toHaveLength(0);
  });
});
