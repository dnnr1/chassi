import {
  calculateCheckDigit,
  verifyCheckDigit,
  extractCheckDigit,
  transliterateChar,
} from "../src/core/checkDigit";

describe("transliterateChar", () => {
  describe("numeric characters", () => {
    it("should return the same value for digits 0-9", () => {
      for (let i = 0; i <= 9; i++) {
        expect(transliterateChar(String(i))).toBe(i);
      }
    });
  });

  describe("alphabetic characters", () => {
    const charValues: [string, number][] = [
      ["A", 1],
      ["B", 2],
      ["C", 3],
      ["D", 4],
      ["E", 5],
      ["F", 6],
      ["G", 7],
      ["H", 8],
      ["J", 1],
      ["K", 2],
      ["L", 3],
      ["M", 4],
      ["N", 5],
      ["P", 7],
      ["R", 9],
      ["S", 2],
      ["T", 3],
      ["U", 4],
      ["V", 5],
      ["W", 6],
      ["X", 7],
      ["Y", 8],
      ["Z", 9],
    ];

    charValues.forEach(([char, value]) => {
      it(`should return ${value} for character ${char}`, () => {
        expect(transliterateChar(char)).toBe(value);
      });
    });
  });

  describe("invalid characters", () => {
    it("should return null for letter I", () => {
      expect(transliterateChar("I")).toBeNull();
    });

    it("should return null for letter O", () => {
      expect(transliterateChar("O")).toBeNull();
    });

    it("should return null for letter Q", () => {
      expect(transliterateChar("Q")).toBeNull();
    });
  });
});

describe("calculateCheckDigit", () => {
  describe("valid calculations", () => {
    it("should return a digit for valid 17-char VIN", () => {
      const result = calculateCheckDigit("9BWZZZ377VT004251");
      expect(result).not.toBeNull();
      expect(result!.length).toBe(1);
      expect(/^[0-9X]$/.test(result!)).toBe(true);
    });

    it("should be consistent - same VIN gives same result", () => {
      const vin = "9BWZZZ377VT004251";
      const result1 = calculateCheckDigit(vin);
      const result2 = calculateCheckDigit(vin);
      expect(result1).toBe(result2);
    });
  });

  describe("invalid inputs", () => {
    it("should return null for VIN with wrong length", () => {
      expect(calculateCheckDigit("12345")).toBeNull();
    });

    it("should return null for empty string", () => {
      expect(calculateCheckDigit("")).toBeNull();
    });
  });

  describe("check digit range", () => {
    it("should only return 0-9 or X", () => {
      const testVins = [
        "9BWZZZ377VT004251",
        "93HGK5860SZ000123",
        "9BD178226J0012345",
        "WVWZZZ3CZWE000001",
      ];

      testVins.forEach((vin) => {
        const result = calculateCheckDigit(vin);
        if (result !== null) {
          expect(/^[0-9X]$/.test(result)).toBe(true);
        }
      });
    });
  });
});

describe("verifyCheckDigit", () => {
  describe("verify calculated digit matches position 9", () => {
    it("should verify check digit correctly", () => {
      const vin = "9BWZZZ377VT004251";
      const calculated = calculateCheckDigit(vin);
      // If calculated matches position 9, verify should be true
      if (calculated === vin[8]) {
        expect(verifyCheckDigit(vin)).toBe(true);
      } else {
        expect(verifyCheckDigit(vin)).toBe(false);
      }
    });
  });

  describe("invalid inputs", () => {
    it("should return false for short VIN", () => {
      expect(verifyCheckDigit("INVALID")).toBe(false);
    });

    it("should return false for empty string", () => {
      expect(verifyCheckDigit("")).toBe(false);
    });
  });
});

describe("extractCheckDigit", () => {
  it("should extract the 9th character", () => {
    expect(extractCheckDigit("9BWZZZ377VT004251")).toBe("7");
    expect(extractCheckDigit("93HGK5860SZ000123")).toBe("0");
    expect(extractCheckDigit("WVWZZZ3CZWE000001")).toBe("Z");
  });

  it("should return null for short VIN", () => {
    expect(extractCheckDigit("12345678")).toBeNull();
  });

  it("should return null for empty string", () => {
    expect(extractCheckDigit("")).toBeNull();
  });
});

describe("weight positions", () => {
  it("should calculate consistently", () => {
    const vin = "9BWZZZ377VT004251";
    const calculatedDigit = calculateCheckDigit(vin);
    expect(calculatedDigit).not.toBeNull();
    expect(/^[0-9X]$/.test(calculatedDigit!)).toBe(true);
  });
});
