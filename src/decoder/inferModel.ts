import modelData from '../datasets/model-patterns.json';

interface ModelPattern {
  model: string;
  confidence: number;
}

interface ModelInference {
  model: string | null;
  confidence: number;
  source: string;
  matchedPattern?: string;
}

const patterns = (modelData as any).patterns as Record<string, Record<string, ModelPattern>>;

/**
 * Infers the vehicle model from WMI and VDS
 */
export function inferModel(wmi: string, vds: string): ModelInference {
  const normalizedWmi = wmi.toUpperCase();
  const normalizedVds = vds.toUpperCase();
  
  const wmiPatterns = patterns[normalizedWmi];
  if (!wmiPatterns) {
    return { model: null, confidence: 0, source: 'inferred' };
  }
  
  // Try to find matching pattern
  for (const [pattern, data] of Object.entries(wmiPatterns)) {
    if (normalizedVds.startsWith(pattern)) {
      return {
        model: data.model,
        confidence: data.confidence,
        source: 'inferred',
        matchedPattern: pattern
      };
    }
  }
  
  return { model: null, confidence: 0, source: 'inferred' };
}
