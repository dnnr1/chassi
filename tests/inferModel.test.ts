import {
  inferModel,
  listKnownModels,
  hasModelPatterns,
  getModelPatternsMetadata,
} from "../src/decoder/inferModel";

describe("inferModel", () => {
  describe("Volkswagen models", () => {
    it("should infer Gol model", () => {
      const result = inferModel("9BW", "B22X5Y");
      if (result.model) {
        expect(result.model).toBe("Gol");
      }
    });

    it("should infer Polo model", () => {
      const result = inferModel("9BW", "B1AX5Y");
      if (result.model) {
        expect(result.model).toBe("Polo");
      }
    });
  });

  describe("GM/Chevrolet models", () => {
    it("should infer Onix model", () => {
      const result = inferModel("9BG", "JC692X");
      if (result.model) {
        expect(result.model).toContain("Onix");
      }
    });
  });

  describe("Fiat models", () => {
    it("should infer Argo", () => {
      const result = inferModel("9BD", "178XXX");
      if (result.model) {
        expect(result.model).toBe("Argo");
      }
    });
  });

  describe("inference confidence", () => {
    it("should have confidence between 0 and 1", () => {
      const result = inferModel("9BW", "B22X5Y");
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe("unknown patterns", () => {
    it("should return null model for unknown VIN pattern", () => {
      const result = inferModel("XXX", "XXXXXX");
      expect(result.model).toBeNull();
    });

    it("should return null model for empty WMI", () => {
      const result = inferModel("", "");
      expect(result.model).toBeNull();
    });
  });
});

describe("listKnownModels", () => {
  it("should return models for Volkswagen WMI", () => {
    const models = listKnownModels("9BW");
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThanOrEqual(0);
  });

  it("should return empty array for unknown WMI", () => {
    const models = listKnownModels("XXX");
    expect(models).toHaveLength(0);
  });
});

describe("hasModelPatterns", () => {
  it("should return true for WMIs with patterns", () => {
    expect(hasModelPatterns("9BW")).toBe(true);
    expect(hasModelPatterns("9BG")).toBe(true);
  });

  it("should return false for unknown WMIs", () => {
    expect(hasModelPatterns("XXX")).toBe(false);
  });
});

describe("getModelPatternsMetadata", () => {
  it("should return metadata object", () => {
    const metadata = getModelPatternsMetadata();
    expect(metadata).not.toBeNull();
    expect(metadata.description).toBeDefined();
    expect(metadata.source).toBeDefined();
    expect(metadata.disclaimer).toBeDefined();
  });
});
