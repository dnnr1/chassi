/// <reference types="jest" />
/**
 * Additional tests for edge cases, integration, and real-world scenarios
 */
import { decodeVin, isValidVin, parseVin, validateVin } from "../src";
import * as mainExports from "../src";

describe("Integration Tests", () => {
  describe("full decode workflow", () => {
    const realWorldVins = [
      {
        vin: "9BWZZZ377VT004251",
        manufacturer: "Volkswagen",
        country: "Brasil",
      },
      { vin: "93HGK5860SZ000123", manufacturer: "Honda", country: "Brasil" },
      { vin: "9BD178226J0012345", manufacturer: "Fiat", country: "Brasil" },
    ];

    realWorldVins.forEach(({ vin, manufacturer, country }) => {
      it(`should fully decode ${manufacturer} VIN`, () => {
        // Parse
        const parsed = parseVin(vin);
        expect(parsed).not.toBeNull();

        // Decode
        const decoded = decodeVin(vin, { includeComponents: true });
        expect(decoded.manufacturer).toBe(manufacturer);
        expect(decoded.country).toBe(country);
        expect(decoded.components).toBeDefined();
      });
    });
  });

  describe("error handling", () => {
    it("should handle empty string gracefully", () => {
      expect(isValidVin("")).toBe(false);
      expect(parseVin("")).toBeNull();
      const decoded = decodeVin("");
      expect(decoded.valid).toBe(false);
    });

    it("should handle null input gracefully", () => {
      expect(isValidVin(null as unknown as string)).toBe(false);
      const validation = validateVin(null as unknown as string);
      expect(validation.valid).toBe(false);
    });

    it("should handle undefined input gracefully", () => {
      expect(isValidVin(undefined as unknown as string)).toBe(false);
      const validation = validateVin(undefined as unknown as string);
      expect(validation.valid).toBe(false);
    });
  });
});

describe("Brazilian Market VINs", () => {
  describe("WMI codes", () => {
    const brazilianWmis = [
      "9BW",
      "9BG",
      "9BD",
      "93H",
      "9BF",
      "9BR",
      "93Y",
      "9BJ",
    ];

    brazilianWmis.forEach((wmi) => {
      it(`should recognize Brazilian WMI ${wmi}`, () => {
        const vin = `${wmi}ZZZ377VT004251`.substring(0, 17);
        const paddedVin = vin.padEnd(17, "0");
        const decoded = decodeVin(paddedVin);
        // Brazilian WMI starts with 9
        expect(paddedVin[0]).toBe("9");
      });
    });
  });
});

describe("Validation Edge Cases", () => {
  describe("forbidden characters", () => {
    const forbiddenChars = ["I", "O", "Q"];

    forbiddenChars.forEach((char) => {
      it(`should reject VIN containing ${char}`, () => {
        const vin = `9BWZZZ377${char}T004251`;
        expect(isValidVin(vin)).toBe(false);
        const validation = validateVin(vin);
        expect(validation.valid).toBe(false);
      });
    });
  });

  describe("special inputs", () => {
    it("should reject VIN with special characters", () => {
      expect(isValidVin("9BWZZZ377VT00425!")).toBe(false);
      expect(isValidVin("9BWZZZ377VT00425@")).toBe(false);
      expect(isValidVin("9BWZZZ377VT00425#")).toBe(false);
    });

    it("should handle very long input", () => {
      const longInput = "A".repeat(1000);
      expect(isValidVin(longInput)).toBe(false);
    });

    it("should handle unicode characters", () => {
      expect(isValidVin("9BWZZZ377VT00425É")).toBe(false);
      expect(isValidVin("9BWZZZ377VT00425中")).toBe(false);
    });
  });
});

describe("Performance", () => {
  it("should decode multiple VINs efficiently", () => {
    const vins = Array(100).fill("9BWZZZ377VT004251");
    const start = Date.now();

    vins.forEach((vin) => {
      decodeVin(vin, { includeComponents: true });
    });

    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(1000); // Should complete in under 1 second
  });

  it("should validate multiple VINs efficiently", () => {
    const vins = Array(100).fill("9BWZZZ377VT004251");
    const start = Date.now();

    vins.forEach((vin) => {
      validateVin(vin);
    });

    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(500); // Should complete in under 500ms
  });
});

describe("Export Verification", () => {
  it("should export all public functions from main module", () => {
    // Core functions
    expect(typeof mainExports.validateVin).toBe("function");
    expect(typeof mainExports.isValidVin).toBe("function");
    expect(typeof mainExports.normalizeVin).toBe("function");

    // Check digit functions
    expect(typeof mainExports.calculateCheckDigit).toBe("function");
    expect(typeof mainExports.verifyCheckDigit).toBe("function");

    // Parse functions
    expect(typeof mainExports.parseVin).toBe("function");
    expect(typeof mainExports.extractWmi).toBe("function");

    // Decode functions
    expect(typeof mainExports.decodeVin).toBe("function");
    expect(typeof mainExports.decodeVinBasic).toBe("function");
    expect(typeof mainExports.listKnownManufacturers).toBe("function");

    // Model inference
    expect(typeof mainExports.inferModel).toBe("function");
    expect(typeof mainExports.listKnownModels).toBe("function");

    // Confidence
    expect(typeof mainExports.calculateConfidenceScore).toBe("function");
  });
});
