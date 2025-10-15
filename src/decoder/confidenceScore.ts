/**
 * Calculates overall confidence score for VIN decode result
 */
export function calculateConfidenceScore(factors: {
  vinValid: boolean;
  wmiFound: boolean;
  vdsPatternFound: boolean;
  isBrazilian: boolean;
}): number {
  let score = 0;
  let total = 0;
  
  if (factors.vinValid) { score += 0.3; }
  total += 0.3;
  
  if (factors.wmiFound) { score += 0.3; }
  total += 0.3;
  
  if (factors.vdsPatternFound) { score += 0.25; }
  total += 0.25;
  
  if (factors.isBrazilian) { score += 0.15; }
  total += 0.15;
  
  return Math.round((score / total) * 100) / 100;
}
