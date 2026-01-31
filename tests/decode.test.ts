/// <reference types="jest" />
import {
  decodeVin,
  decodeVinBasic,
  decodeManufacturer,
  decodeYear,
  listKnownManufacturers,
} from "../src/decoder/decode";

describe("decodeManufacturer", () => {
  describe("manufacturers", () => {
    const wmis: [string, string, string][] = [
      ["9BW", "Volkswagen", "Brazil"],
      ["9BG", "Chevrolet (General Motors)", "Brazil"],
      ["9BD", "Fiat", "Brazil"],
      ["93H", "Honda", "Brazil"],
      ["9BF", "Ford", "Brazil"],
      ["9BR", "Toyota", "Brazil"],
      ["93Y", "Renault", "Brazil"],
      ["9BJ", "Jeep", "Brazil"],
      ["WVW", "Volkswagen", "Germany"],
      ["WBA", "BMW", "Germany"],
      ["WDB", "Mercedes-Benz", "Germany"],
      ["1G1", "Chevrolet", "United States"],
      ["5YJ", "Tesla", "United States"],
      ["JHM", "Honda", "Japan"],
      ["ZFF", "Ferrari", "Italy"],
    ];

    wmis.forEach(([wmi, manufacturer, country]) => {
      it(`should identify ${manufacturer} (${country}) for WMI ${wmi}`, () => {
        const result = decodeManufacturer(wmi);
        expect(result).not.toBeNull();
        expect(result!.manufacturer).toBe(manufacturer);
        expect(result!.country).toBe(country);
      });
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

describe("decodeVin", () => {
  describe("valid VINs", () => {
    it("should decode Volkswagen Brazil VIN", () => {
      const result = decodeVin("9BWZZZ377VT004251");
      expect(result.manufacturer).toBe("Volkswagen");
      expect(result.country).toBe("Brazil");
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.disclaimer).toBeDefined();
    });

    it("should decode Honda Brazil VIN", () => {
      const result = decodeVin("93HGK5860SZ000123");
      expect(result.manufacturer).toBe("Honda");
      expect(result.country).toBe("Brazil");
    });

    it("should decode Fiat Brazil VIN", () => {
      const result = decodeVin("9BD178226J0012345");
      expect(result.manufacturer).toBe("Fiat");
      expect(result.country).toBe("Brazil");
    });

    it("should decode Tesla US VIN", () => {
      const result = decodeVin("5YJ3E1EA5LF123456");
      expect(result.manufacturer).toBe("Tesla");
      expect(result.country).toBe("United States");
    });

    it("should decode BMW Germany VIN", () => {
      const result = decodeVin("WBAPK5C55BA123456");
      expect(result.manufacturer).toBe("BMW");
      expect(result.country).toBe("Germany");
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

  it("should filter by country", () => {
    const manufacturers = listKnownManufacturers("Germany");
    expect(manufacturers.length).toBeGreaterThan(5);
    manufacturers.forEach((m) => {
      expect(m.country).toBe("Germany");
    });
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
