/// <reference types="jest" />
import {
  decodeVin,
  decodeVinBasic,
  decodeManufacturer,
  decodeYear,
  isBrazilianVin,
  listKnownManufacturers,
} from "../src/decoder/decode";

describe("decodeManufacturer", () => {
  describe("Brazilian manufacturers", () => {
    const brazilianWmis: [string, string][] = [
      ["9BW", "Volkswagen"],
      ["9BG", "Chevrolet (General Motors)"],
      ["9BD", "Fiat"],
      ["93H", "Honda"],
      ["9BF", "Ford"],
      ["9BR", "Toyota"],
      ["93Y", "Renault"],
      ["9BJ", "Jeep"],
    ];

    brazilianWmis.forEach(([wmi, expected]) => {
      it(`should identify ${expected} for WMI ${wmi}`, () => {
        const result = decodeManufacturer(wmi);
        expect(result).not.toBeNull();
        expect(result!.manufacturer).toBe(expected);
        expect(result!.country).toBe("Brasil");
      });
    });
  });

  describe("international manufacturers", () => {
    it("should decode Volkswagen Germany", () => {
      const result = decodeManufacturer("WVW");
      expect(result).not.toBeNull();
      expect(result!.manufacturer).toBe("Volkswagen");
      expect(result!.country).toBe("Alemanha");
    });

    it("should decode Mercedes-Benz", () => {
      const result = decodeManufacturer("WDB");
      expect(result).not.toBeNull();
      expect(result!.manufacturer).toBe("Mercedes-Benz");
      expect(result!.country).toBe("Alemanha");
    });

    it("should decode BMW", () => {
      const result = decodeManufacturer("WBA");
      expect(result).not.toBeNull();
      expect(result!.manufacturer).toBe("BMW");
      expect(result!.country).toBe("Alemanha");
    });
  });

  describe("unknown manufacturers", () => {
    it("should return null for unknown WMI", () => {
      expect(decodeManufacturer("XXX")).toBeNull();
      expect(decodeManufacturer("ZZZ")).toBeNull();
    });
  });
});

describe("decodeYear", () => {
  describe("2010+ year codes", () => {
    const yearCodes: [string, number][] = [
      ["A", 2010],
      ["B", 2011],
      ["C", 2012],
      ["D", 2013],
      ["E", 2014],
      ["F", 2015],
      ["G", 2016],
      ["H", 2017],
      ["J", 2018],
      ["K", 2019],
      ["L", 2020],
      ["M", 2021],
      ["N", 2022],
      ["P", 2023],
      ["R", 2024],
      ["S", 2025],
      ["T", 2026],
    ];

    yearCodes.forEach(([code, year]) => {
      it(`should decode year code ${code}`, () => {
        const result = decodeYear(code);
        expect(result).not.toBeNull();
        expect(result.possibleYears).toContain(year);
      });
    });
  });

  describe("numeric year codes", () => {
    const numericCodes: [string, number[]][] = [
      ["1", [2001, 2031]],
      ["2", [2002, 2032]],
      ["3", [2003, 2033]],
      ["4", [2004, 2034]],
      ["5", [2005, 2035]],
      ["6", [2006, 2036]],
      ["7", [2007, 2037]],
      ["8", [2008, 2038]],
      ["9", [2009, 2039]],
    ];

    numericCodes.forEach(([code, expectedYears]) => {
      it(`should decode numeric year code ${code}`, () => {
        const result = decodeYear(code);
        expect(result).not.toBeNull();
        // Should contain at least one of the expected years
        const hasExpectedYear = expectedYears.some((y) =>
          result.possibleYears.includes(y),
        );
        expect(hasExpectedYear).toBe(true);
      });
    });
  });
});

describe("isBrazilianVin", () => {
  it("should return true for Brazilian VINs (starting with 9)", () => {
    expect(isBrazilianVin("9BWZZZ377VT004251")).toBe(true);
    expect(isBrazilianVin("9BGZZZ377VT004251")).toBe(true);
    expect(isBrazilianVin("93HGK5860SZ000123")).toBe(true);
  });

  it("should return false for non-Brazilian VINs", () => {
    expect(isBrazilianVin("WVWZZZ3CZWE000001")).toBe(false);
    expect(isBrazilianVin("1HGBH41JXMN109186")).toBe(false);
  });
});

describe("decodeVin", () => {
  describe("valid Brazilian VINs", () => {
    it("should decode Volkswagen VIN", () => {
      const result = decodeVin("9BWZZZ377VT004251");
      expect(result.manufacturer).toBe("Volkswagen");
      expect(result.country).toBe("Brasil");
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.disclaimer).toBeDefined();
    });

    it("should decode Honda VIN", () => {
      const result = decodeVin("93HGK5860SZ000123");
      expect(result.manufacturer).toBe("Honda");
      expect(result.country).toBe("Brasil");
    });

    it("should decode Fiat VIN", () => {
      const result = decodeVin("9BD178226J0012345");
      expect(result.manufacturer).toBe("Fiat");
      expect(result.country).toBe("Brasil");
    });
  });

  describe("options", () => {
    it("should include components when requested", () => {
      const result = decodeVin("9BWZZZ377VT004251", {
        includeComponents: true,
      });
      expect(result.components).toBeDefined();
      expect(result.components!.wmi).toBe("9BW");
      expect(result.components!.vds).toBe("ZZZ377");
      expect(result.components!.vis).toBe("VT004251");
    });

    it("should not include components by default", () => {
      const result = decodeVin("9BWZZZ377VT004251");
      expect(result.components).toBeUndefined();
    });
  });

  describe("invalid VINs", () => {
    it("should mark invalid VIN", () => {
      const result = decodeVin("INVALID");
      expect(result.valid).toBe(false);
    });
  });
});

describe("decodeVinBasic", () => {
  it("should return basic decode without options", () => {
    const result = decodeVinBasic("9BWZZZ377VT004251");
    expect(result.manufacturer).toBeDefined();
    expect(result.country).toBeDefined();
    expect(result.year).toBeDefined();
  });
});

describe("listKnownManufacturers", () => {
  it("should return array of manufacturers", () => {
    const manufacturers = listKnownManufacturers();
    expect(Array.isArray(manufacturers)).toBe(true);
    expect(manufacturers.length).toBeGreaterThan(0);
  });

  it("should include Brazilian manufacturers", () => {
    const manufacturers = listKnownManufacturers("Brasil");
    expect(manufacturers.length).toBeGreaterThan(5);
  });

  it("should have required properties", () => {
    const manufacturers = listKnownManufacturers();
    manufacturers.forEach((m) => {
      expect(m.wmi).toBeDefined();
      expect(m.manufacturer).toBeDefined();
      expect(m.country).toBeDefined();
    });
  });
});

describe("confidence scoring", () => {
  it("should have confidence between 0 and 1", () => {
    const result = decodeVin("9BWZZZ377VT004251");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});
