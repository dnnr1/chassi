/// <reference types="jest" />
import {
  validateVin,
  isValidVin,
  normalizeVin,
  isValidVinStructure,
} from "../src/core/validateVin";

describe("normalizeVin", () => {
  it("should convert to uppercase", () => {
    expect(normalizeVin("9bwzzz377vt004251")).toBe("9BWZZZ377VT004251");
  });

  it("should remove spaces", () => {
    expect(normalizeVin("9BW ZZZ 377 VT0 042 51")).toBe("9BWZZZ377VT004251");
  });

  it("should remove hyphens", () => {
    expect(normalizeVin("9BW-ZZZ-377-VT0-042-51")).toBe("9BWZZZ377VT004251");
  });

  it("should handle mixed input", () => {
    expect(normalizeVin("9bw-zzz 377-vt0 042-51")).toBe("9BWZZZ377VT004251");
  });
});

describe("isValidVinStructure", () => {
  it("should return true for valid 17-character VIN", () => {
    expect(isValidVinStructure("9BWZZZ377VT004251")).toBe(true);
  });

  it("should return false for VIN with invalid length", () => {
    expect(isValidVinStructure("9BWZZZ377VT00425")).toBe(false);
    expect(isValidVinStructure("9BWZZZ377VT0042511")).toBe(false);
  });

  it("should return false for VIN with letter I", () => {
    expect(isValidVinStructure("9BWZZZ377IT004251")).toBe(false);
  });

  it("should return false for VIN with letter O", () => {
    expect(isValidVinStructure("9BWZZZ377OT004251")).toBe(false);
  });

  it("should return false for VIN with letter Q", () => {
    expect(isValidVinStructure("9BWZZZ377QT004251")).toBe(false);
  });
});

describe("validateVin", () => {
  describe("structural validation", () => {
    it("should validate proper VIN structure", () => {
      const result = validateVin("9BWZZZ377VT004251");
      expect(result.details.lengthValid).toBe(true);
      expect(result.details.charactersValid).toBe(true);
    });
  });

  describe("invalid VINs", () => {
    it("should reject VIN with wrong length", () => {
      const result = validateVin("9BWZZZ377VT00425");
      expect(result.valid).toBe(false);
      expect(result.details.lengthValid).toBe(false);
      expect(result.errors.some((e) => e.code === "INVALID_LENGTH")).toBe(true);
    });

    it("should reject VIN with invalid characters (I, O, Q)", () => {
      const result = validateVin("9BWZZZ377IT004251");
      expect(result.valid).toBe(false);
      expect(result.details.charactersValid).toBe(false);
    });
  });

  describe("normalization in validation", () => {
    it("should normalize lowercase VIN", () => {
      const result = validateVin("9bwzzz377vt004251");
      expect(result.normalizedVin).toBe("9BWZZZ377VT004251");
    });

    it("should normalize VIN with spaces", () => {
      const result = validateVin("9BW ZZZ 377VT004251");
      expect(result.normalizedVin).toBe("9BWZZZ377VT004251");
    });
  });
});

describe("isValidVin", () => {
  it("should return false for invalid VIN", () => {
    expect(isValidVin("INVALID")).toBe(false);
  });

  it("should return false for empty string", () => {
    expect(isValidVin("")).toBe(false);
  });
});

describe("edge cases", () => {
  it("should handle empty string", () => {
    const result = validateVin("");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("should handle null-like values", () => {
    const result = validateVin(null as unknown as string);
    expect(result.valid).toBe(false);
  });

  it("should handle undefined", () => {
    const result = validateVin(undefined as unknown as string);
    expect(result.valid).toBe(false);
  });

  it("should handle special characters", () => {
    const result = validateVin("9BWZZZ377VT@#$%^&");
    expect(result.valid).toBe(false);
  });
});
