/// <reference types="jest" />
import { validateVin } from "../src/core/validateVin";
import { decodeVin } from "../src/decoder/decode";
import { parseVin } from "../src/core/parseVin";

/**
 * Consistency tests to ensure validateVin and decodeVin return consistent results.
 * If one function says a VIN is valid, the other must agree.
 */
describe("Consistency between validateVin and decodeVin", () => {
  describe("European VINs (no check digit requirement)", () => {
    const europeanVins = [
      {
        vin: "WVWZZZ3CZWE123456",
        manufacturer: "Volkswagen",
        country: "Germany",
      },
      { vin: "WBAPH5C55BA123456", manufacturer: "BMW", country: "Germany" },
      {
        vin: "WDBRF61J21F123456",
        manufacturer: "Mercedes-Benz",
        country: "Germany",
      },
      { vin: "ZFFCW56A390123456", manufacturer: "Ferrari", country: "Italy" },
    ];

    europeanVins.forEach(({ vin, manufacturer, country }) => {
      describe(`${manufacturer} (${country}) - ${vin}`, () => {
        it("should have consistent validity between validateVin and decodeVin", () => {
          const validation = validateVin(vin);
          const decode = decodeVin(vin);

          expect(validation.valid).toBe(decode.valid);
        });

        it("should mark check digit as not applicable for European VIN", () => {
          const validation = validateVin(vin);

          expect(validation.details.checkDigitApplicable).toBe(false);
        });

        it("should decode manufacturer correctly", () => {
          const decode = decodeVin(vin);

          expect(decode.manufacturer).toBe(manufacturer);
          expect(decode.country).toBe(country);
        });
      });
    });
  });

  describe("North American VINs (check digit required)", () => {
    const northAmericanVins = [
      {
        vin: "1HGBH41JXMN109186",
        manufacturer: "Honda",
        country: "United States",
        valid: true,
      },
      {
        vin: "1G1YY22G865109876",
        manufacturer: "Chevrolet",
        country: "United States",
        valid: true,
      },
      {
        vin: "5YJSA1CN5DFP12345",
        manufacturer: "Tesla",
        country: "United States",
        valid: false,
      }, // invalid check digit
    ];

    northAmericanVins.forEach(({ vin, manufacturer, country, valid }) => {
      describe(`${manufacturer} (${country}) - ${vin}`, () => {
        it("should have consistent validity between validateVin and decodeVin", () => {
          const validation = validateVin(vin);
          const decode = decodeVin(vin);

          if (valid) {
            expect(validation.valid).toBe(true);
            expect(decode.valid).toBe(true);
          } else {
            expect(validation.valid).toBe(false);
          }
        });

        it("should mark check digit as applicable for North American VIN", () => {
          const validation = validateVin(vin);

          expect(validation.details.checkDigitApplicable).toBe(true);
        });

        if (valid) {
          it("should decode manufacturer correctly when valid", () => {
            const decode = decodeVin(vin);

            expect(decode.manufacturer).toBe(manufacturer);
            expect(decode.country).toBe(country);
          });
        }
      });
    });
  });

  describe("Brazilian VINs", () => {
    const brazilianVins = [
      {
        vin: "9BWZZZ377VT004251",
        manufacturer: "Volkswagen",
        country: "Brazil",
      },
      {
        vin: "9BGKS48D0AG123456",
        manufacturer: "Chevrolet (General Motors)",
        country: "Brazil",
      },
      { vin: "9BD178226G0123456", manufacturer: "Fiat", country: "Brazil" },
    ];

    brazilianVins.forEach(({ vin, manufacturer, country }) => {
      describe(`${manufacturer} (${country}) - ${vin}`, () => {
        it("should have consistent validity between validateVin and decodeVin", () => {
          const validation = validateVin(vin);
          const decode = decodeVin(vin);

          expect(validation.valid).toBe(decode.valid);
        });

        it("should decode manufacturer correctly", () => {
          const decode = decodeVin(vin);

          expect(decode.manufacturer).toBe(manufacturer);
          expect(decode.country).toBe(country);
        });
      });
    });
  });

  describe("parseVin consistency with validateVin", () => {
    const testVins = [
      "WVWZZZ3CZWE123456",
      "1HGBH41JXMN109186",
      "9BWZZZ377VT004251",
    ];

    testVins.forEach((vin) => {
      it(`should parse valid VIN ${vin} when validateVin passes`, () => {
        const validation = validateVin(vin);
        const parsed = parseVin(vin);

        if (validation.valid) {
          expect(parsed).not.toBeNull();
          expect(parsed!.wmi).toBe(vin.substring(0, 3));
          expect(parsed!.vds).toBe(vin.substring(3, 9));
          expect(parsed!.vis).toBe(vin.substring(9, 17));
        }
      });
    });
  });

  describe("Strict mode consistency", () => {
    it("should reject European VIN with strictCheckDigit option", () => {
      const vin = "WVWZZZ3CZWE123456"; // European VIN with Z as check digit

      const normalValidation = validateVin(vin);
      const strictValidation = validateVin(vin, { strictCheckDigit: true });
      const decode = decodeVin(vin);
      const strictDecode = decodeVin(vin, { strict: true });

      expect(normalValidation.valid).toBe(true);
      expect(decode.valid).toBe(true);
      expect(strictValidation.valid).toBe(false);
      expect(strictDecode.valid).toBe(false);
    });
  });

  describe("Invalid VINs - consistent rejection", () => {
    const invalidVins = [
      { vin: "INVALID", reason: "too short" },
      { vin: "12345678901234567890", reason: "too long" },
      { vin: "WVWZZZ3CZWE12345I", reason: "contains I" },
      { vin: "WVWZZZ3CZWE12345O", reason: "contains O" },
      { vin: "WVWZZZ3CZWE12345Q", reason: "contains Q" },
      { vin: "", reason: "empty" },
    ];

    invalidVins.forEach(({ vin, reason }) => {
      it(`should consistently reject VIN that is ${reason}`, () => {
        const validation = validateVin(vin);
        const decode = decodeVin(vin);

        expect(validation.valid).toBe(false);
        expect(decode.valid).toBe(false);
      });
    });
  });

  describe("Component data consistency", () => {
    const vinsWithComponents = [
      { vin: "WVWZZZ3CZWE123456", expectedYear: 1998 },
      { vin: "1HGBH41JXMN109186", expectedYear: 2021 },
    ];

    vinsWithComponents.forEach(({ vin, expectedYear }) => {
      it(`should have consistent year extraction for ${vin}`, () => {
        const parsed = parseVin(vin);
        const decode = decodeVin(vin, { includeComponents: true });

        expect(parsed).not.toBeNull();
        expect(decode.components).toBeDefined();
        expect(decode.components!.yearCode).toBe(parsed!.yearCode);
        expect(decode.year).toBe(expectedYear);
      });

      it(`should have consistent WMI between parse and decode for ${vin}`, () => {
        const parsed = parseVin(vin);
        const decode = decodeVin(vin, { includeComponents: true });

        expect(decode.components!.wmi).toBe(parsed!.wmi);
      });
    });
  });

  describe("Normalized VIN consistency", () => {
    const vinsWithVariations = [
      { original: "wvwzzz3czwe123456", normalized: "WVWZZZ3CZWE123456" },
      { original: "WVW-ZZZ-3CZ-WE1-234-56", normalized: "WVWZZZ3CZWE123456" },
      { original: "WVW ZZZ 3CZ WE1 234 56", normalized: "WVWZZZ3CZWE123456" },
    ];

    vinsWithVariations.forEach(({ original, normalized }) => {
      it(`should normalize "${original}" consistently`, () => {
        const validation = validateVin(original);
        const decode = decodeVin(original);

        expect(validation.normalizedVin).toBe(normalized);
        expect(decode.vin).toBe(original); // decodeVin stores original
      });
    });
  });

  describe("Edge cases - both functions should handle gracefully", () => {
    const edgeCases = [null, undefined, "   ", "\t\n"];

    edgeCases.forEach((vin) => {
      it(`should handle edge case: ${JSON.stringify(vin)}`, () => {
        // @ts-ignore - testing with invalid types intentionally
        const validation = validateVin(vin);
        // @ts-ignore
        const decode = decodeVin(vin);

        expect(validation.valid).toBe(false);
        expect(decode.valid).toBe(false);
      });
    });
  });
});
