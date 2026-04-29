/// <reference types="jest" />
import { validateVin } from "../src/core/validateVin";
import { decodeVin } from "../src/decoder/decode";
import { parseVin } from "../src/core/parseVin";
import { isValidVin } from "../src/core/validateVin";

const vins = [
  "1HGCM82633A004352",
  "2FTRX18W1XCA12345",
  "3FAHP0HA6AR298374",
  "1N4AL11D75C109876",
  "JHMCM56557C404321",
  "1FTFW1ET4EFA56789",
  "5YJSA1E26HF000111",
  "1GNEK13Z63R298765",
  "2HGES16555H123456",
  "1C4RJFBG8FC625789",
  "3VWFE21C04M000222",
  "1HGFA16526L081234",
  "JTDKN3DU0A0123456",
  "1FTSW21P07EB56789",
  "5NPE24AF4FH098765",
  "1GCHK23D37F456789",
  "2C3KA53G76H111222",
  "1NXBR32E84Z654321",
  "JN8AZ2KR9DT000333",
  "1G1JC5244R7256789",
  "3N1AB7AP4GY234567",
  "1HGCR2F3XEA345678",
  "2T1BURHE5FC456789",
  "5UXWX7C5XBL567890",
  "1FAHP2F82DG678901",
  "KM8J3CA46JU789012",
  "1N4BL4BV0KC890123",
  "2HGFB2F50DH901234",
  "1GNSKCKC1FR012345",
  "1C6RR7KT5ES123456",
  "JH4KA8260MC234567",
  "1FTMF1CM5EK345678",
  "3CZRE4H59BG456789",
  "1FMCU0GX9FUA56789",
  "5FNRL5H63GB678901",
  "1G4HP54KX4U789012",
  "2HKRM4H52EH890123",
  "1HGCP2F34AA901234",
  "1N6AA07A65N012345",
  "3GNEK18Z96G123456",
  "2G1WT57K991234567",
  "1D7HU18N45S234567",
  "JHLRD78444C345678",
  "1FAFP404X1F456789",
  "1G8ZS1277WZ567890",
  "1FTZR15E3YTA67890",
  "3FA6P0H73ER789012",
  "2HKYF185X4H890123",
  "1N4AA5AP7EC901234",
  "1G1JC1247T7123456",
  "1HGFA16526L081235",
  "2FTRX18W5XCA54321",
  "3FAHP0HA7AR298375",
  "1N4AL11D85C109877",
  "JHMCM56567C404322",
  "1FTFW1ET5EFA56780",
  "5YJSA1E27HF000112",
  "1GNEK13Z73R298766",
  "2HGES16565H123457",
  "1C4RJFBG9FC625780",
  "3VWFE21C14M000223",
  "JTDKN3DU1A0123457",
  "1FTSW21P17EB56780",
  "5NPE24AF5FH098766",
  "1GCHK23D47F456780",
  "2C3KA53G86H111223",
  "1NXBR32E94Z654322",
  "JN8AZ2KR0DT000334",
  "1G1JC5245R7256790",
  "3N1AB7AP5GY234568",
  "1HGCR2F4XEA345679",
  "2T1BURHE6FC456780",
  "5UXWX7C6XBL567891",
  "1FAHP2F92DG678902",
  "KM8J3CA56JU789013",
  "1N4BL4BV1KC890124",
  "2HGFB2F60DH901235",
  "1GNSKCKC2FR012346",
  "1C6RR7KT6ES123457",
  "JH4KA8261MC234568",
  "1FTMF1CM6EK345679",
  "3CZRE4H69BG456780",
  "1FMCU0GX0FUA56780",
  "5FNRL5H64GB678902",
  "1G4HP54K5X4U78901",
  "2HKRM4H62EH890124",
  "1HGCP2F44AA901235",
  "1N6AA07A75N012346",
  "3GNEK18Z06G123457",
  "2G1WT57K091234568",
  "1D7HU18N55S234568",
  "JHLRD78454C345679",
  "1FAFP4042F4567901",
  "1G8ZS1278WZ567891",
  "1FTZR15E4YTA67891",
  "3FA6P0H83ER789013",
  "2HKYF1855H8901245",
  "1N4AA5AP8EC901235",
  "1G1JC1248T7123457",
];

/**
 * Consistency tests to ensure validateVin and decodeVin return consistent results.
 * If one function says a VIN is valid, the other must agree.
 */
describe("Consistency between validateVin and decodeVin", () => {
  describe("Provided VIN list", () => {
    vins.forEach((vin) => {
      it(`should keep validation consistent for ${vin}`, () => {
        const validation = validateVin(vin);
        const decode = decodeVin(vin);
        const validCheck = isValidVin(vin);

        expect(validation.valid).toBe(decode.valid);
        expect(validCheck).toBe(validation.valid);
        expect(decode.vin).toBe(vin);
        expect(parseVin(vin)).not.toBeNull();
      });
    });
  });

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

          expect(validation.valid).toBe(valid);
          expect(decode.valid).toBe(valid);
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
