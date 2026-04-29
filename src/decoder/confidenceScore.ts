import round2 from "../utils/round2";

/** Weighted confidence: VIN valid (35%), WMI found (35%), VDS pattern (30%). */
export function calculateConfidenceScore(factors: {
  vinValid: boolean;
  wmiFound: boolean;
  vdsPatternFound: boolean;
}): number {
  let score = 0;
  let total = 0;

  if (factors.vinValid) {
    score += 0.35;
  }
  total += 0.35;

  if (factors.wmiFound) {
    score += 0.35;
  }
  total += 0.35;

  if (factors.vdsPatternFound) {
    score += 0.3;
  }
  total += 0.3;

  return round2(score / total);
}

export function calculateYearConfidence(possibleYears: number[]): number {
  if (possibleYears.length === 0) return 0;
  if (possibleYears.length === 1) return 1;

  const currentYear = new Date().getFullYear();
  const validYears = possibleYears.filter((y) => y <= currentYear + 1);

  if (validYears.length === 1) return 0.9;
  if (validYears.length === 2) return 0.5;

  return 0.3;
}

export function calculateModelConfidence(
  matchedPattern: string | undefined,
  vds: string,
): number {
  if (!matchedPattern) return 0;

  const patternLength = matchedPattern.length;
  const vdsLength = vds.length;

  let score = (patternLength / vdsLength) * 0.8;

  if (patternLength === vdsLength) {
    score += 0.2;
  }

  return Math.min(1, round2(score));
}

export function combineConfidenceScores(
  scores: number[],
  weights?: number[],
): number {
  if (scores.length === 0) return 0;

  if (!weights || weights.length !== scores.length) {
    return round2(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = scores.reduce(
    (sum, score, i) => sum + score * weights[i],
    0,
  );
  return round2(weightedSum / totalWeight);
}
