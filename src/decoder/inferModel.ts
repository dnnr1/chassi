import modelData from "../datasets/model-patterns.json";
import { ModelInference } from "../types";

interface ModelPattern {
  model: string;
  confidence: number;
  generation?: string;
}

const patterns = (modelData as any).patterns as Record<
  string,
  Record<string, ModelPattern>
>;

/**
 * Infers the vehicle model from WMI and VDS
 */
export function inferModel(wmi: string, vds: string): ModelInference {
  const normalizedWmi = wmi.toUpperCase();
  const normalizedVds = vds.toUpperCase();

  const wmiPatterns = patterns[normalizedWmi];
  if (!wmiPatterns) {
    return { model: null, confidence: 0, source: "inferred" };
  }

  const sortedPatterns = Object.entries(wmiPatterns).sort(
    (a, b) => b[0].length - a[0].length,
  );

  for (const [pattern, data] of sortedPatterns) {
    if (normalizedVds.startsWith(pattern)) {
      const result: ModelInference = {
        model: data.model,
        confidence: data.confidence,
        source: "inferred",
        matchedPattern: pattern,
      };

      if (data.generation) {
        result.additionalInfo = { generation: data.generation };
      }

      return result;
    }
  }

  return { model: null, confidence: 0, source: "inferred" };
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

/**
 * Checks if WMI has model patterns
 */
export function hasModelPatterns(wmi: string): boolean {
  const normalizedWmi = wmi.toUpperCase();
  return patterns[normalizedWmi] !== undefined;
}

/**
 * Gets metadata about model patterns dataset
 */
export function getModelPatternsMetadata(): {
  description: string;
  source: string;
  disclaimer: string;
} {
  return {
    description: (modelData as any).metadata.description,
    source: (modelData as any).metadata.source,
    disclaimer: (modelData as any).metadata.disclaimer,
  };
}
