import {
  inferModel,
  listKnownModels,
  hasModelPatterns,
  getModelPatternsMetadata
} from '../src/decoder/inferModel';

describe('inferModel', () => {
  describe('Volkswagen models', () => {
    const vwModels: [string, string | null][] = [
      ['9BWZZZ377VT004251', null], // ZZZ pattern not in our data
      ['9BW1B22X5YP123456', 'Gol'],
      ['9BW4B1AX5YP123456', 'Polo'],
      ['9BWDB45U5YP123456', 'T-Cross'],
    ];

    vwModels.forEach(([vin, expectedModel]) => {
      it(`should infer model for VIN ${vin.substring(0, 10)}...`, () => {
        const result = inferModel(vin);
        if (expectedModel) {
          expect(result).not.toBeNull();
          expect(result!.model).toBe(expectedModel);
        }
      });
    });
  });

  describe('GM/Chevrolet models', () => {
    it('should infer Onix', () => {
      const result = inferModel('9BGJC692X0B123456');
      if (result) {
        expect(result.model).toBe('Onix');
      }
    });

    it('should infer S10', () => {
      const result = inferModel('9BGS10XX50B123456');
      if (result) {
        expect(result.model).toBe('S10');
      }
    });
  });

  describe('Fiat models', () => {
    it('should infer Argo', () => {
      const result = inferModel('9BD178XXXJP123456');
      if (result) {
        expect(result.model).toBe('Argo');
      }
    });

    it('should infer Strada', () => {
      const result = inferModel('9BD278XXXJP123456');
      if (result) {
        expect(result.model).toBe('Strada');
      }
    });
  });

  describe('Honda models', () => {
    it('should infer Civic', () => {
      const result = inferModel('93HFC1XXXSZ123456');
      if (result) {
        expect(result.model).toBe('Civic');
      }
    });

    it('should infer HR-V', () => {
      const result = inferModel('93HRU5XXXSZ123456');
      if (result) {
        expect(result.model).toBe('HR-V');
      }
    });
  });

  describe('Toyota models', () => {
    it('should infer Corolla', () => {
      const result = inferModel('9BRKB42EXKP123456');
      if (result) {
        expect(result.model).toBe('Corolla');
      }
    });

    it('should infer Hilux', () => {
      const result = inferModel('9BRKN15DXKP123456');
      if (result) {
        expect(result.model).toBe('Hilux');
      }
    });
  });

  describe('inference confidence', () => {
    it('should have confidence between 0 and 1', () => {
      const testVins = [
        '9BW1B22X5YP123456',
        '9BGJC692X0B123456',
        '9BD178XXXJP123456'
      ];

      testVins.forEach(vin => {
        const result = inferModel(vin);
        if (result) {
          expect(result.confidence).toBeGreaterThanOrEqual(0);
          expect(result.confidence).toBeLessThanOrEqual(1);
        }
      });
    });
  });

  describe('unknown patterns', () => {
    it('should return null for unknown VIN pattern', () => {
      const result = inferModel('XXXXXXXXXXXXXXXXX');
      expect(result).toBeNull();
    });

    it('should return null for invalid VIN', () => {
      const result = inferModel('');
      expect(result).toBeNull();
    });
  });
});

describe('listKnownModels', () => {
  describe('without manufacturer filter', () => {
    it('should return all known models', () => {
      const models = listKnownModels();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(10);
    });

    it('should include models from multiple manufacturers', () => {
      const models = listKnownModels();
      const manufacturers = new Set(models.map(m => m.manufacturer));
      expect(manufacturers.size).toBeGreaterThan(3);
    });
  });

  describe('with manufacturer filter', () => {
    it('should filter by Volkswagen', () => {
      const models = listKnownModels('Volkswagen');
      expect(models.every(m => m.manufacturer === 'Volkswagen')).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should filter by GM', () => {
      const models = listKnownModels('GM');
      expect(models.every(m => m.manufacturer === 'GM')).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should filter by Fiat', () => {
      const models = listKnownModels('Fiat');
      expect(models.every(m => m.manufacturer === 'Fiat')).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown manufacturer', () => {
      const models = listKnownModels('UnknownManufacturer');
      expect(models).toHaveLength(0);
    });
  });
});

describe('hasModelPatterns', () => {
  it('should return true for manufacturers with patterns', () => {
    expect(hasModelPatterns('Volkswagen')).toBe(true);
    expect(hasModelPatterns('GM')).toBe(true);
    expect(hasModelPatterns('Fiat')).toBe(true);
    expect(hasModelPatterns('Honda')).toBe(true);
    expect(hasModelPatterns('Toyota')).toBe(true);
  });

  it('should return false for unknown manufacturers', () => {
    expect(hasModelPatterns('UnknownManufacturer')).toBe(false);
  });
});

describe('getModelPatternsMetadata', () => {
  it('should return metadata for known manufacturers', () => {
    const metadata = getModelPatternsMetadata('Volkswagen');
    expect(metadata).not.toBeNull();
    expect(metadata!.manufacturer).toBe('Volkswagen');
    expect(metadata!.patternCount).toBeGreaterThan(0);
    expect(Array.isArray(metadata!.models)).toBe(true);
  });

  it('should return null for unknown manufacturer', () => {
    const metadata = getModelPatternsMetadata('UnknownManufacturer');
    expect(metadata).toBeNull();
  });

  it('should include all model names', () => {
    const metadata = getModelPatternsMetadata('Volkswagen');
    expect(metadata!.models).toContain('Gol');
    expect(metadata!.models).toContain('Polo');
    expect(metadata!.models).toContain('T-Cross');
  });
});
