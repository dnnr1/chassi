import modelData from '../datasets/model-patterns.json';

interface ModelPattern {
  model: string;
  confidence: number;
}

export interface ModelInference {
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
  
  // Sort patterns by length (longer = more specific = higher priority)
  const sortedPatterns = Object.entries(wmiPatterns)
    .sort((a, b) => b[0].length - a[0].length);
  
  // Try to find matching pattern
  for (const [pattern, data] of sortedPatterns) {
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

/**
 * Lists all known models for a WMI
 */
export function listKnownModels(wmi: string): string[] {
  const normalizedWmi = wmi.toUpperCase();
  const wmiPatterns = patterns[normalizedWmi];
  if (!wmiPatterns) return [];
  
  const models = new Set<string>();
  for (const data of Object.values(wmiPatterns)) {
    models.add(data.model);
  }
  return Array.from(models).sort();
}
