function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Weighted confidence: VIN valid (30%), WMI found (30%), VDS pattern (25%), Brazilian (15%). */
export function calculateConfidenceScore(factors: {
  vinValid: boolean;
  wmiFound: boolean;
  vdsPatternFound: boolean;
  isBrazilian: boolean;
}): number {
  let score = 0;
  let total = 0;

  if (factors.vinValid) {
    score += 0.3;
  }
  total += 0.3;

  if (factors.wmiFound) {
    score += 0.3;
  }
  total += 0.3;

  if (factors.vdsPatternFound) {
    score += 0.25;
  }
  total += 0.25;

  if (factors.isBrazilian) {
    score += 0.15;
  }
  total += 0.15;

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
