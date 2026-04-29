/// <reference types="jest" />

import round2 from "../src/utils/round2";

describe("round2", () => {
  it("should round to two decimal places", () => {
    const actual = round2(200.525);
    const result = 200.53;
    expect(actual).toBe(result);
  });
});
