import type { CivilizationProfile, MetricRecord, ModelRecord } from '../core/types';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));
const clamp100 = (value: number): number => Math.min(100, Math.max(0, value));

/**
 * Smooth bounded mapping that avoids turning a few benchmark points into a
 * ridiculous battlefield multiplier. Input and output are normalized 0..100.
 */
const smoothCapability = (value: number, midpoint = 50, steepness = 0.055): number => {
  const logistic = 1 / (1 + Math.exp(-steepness * (value - midpoint)));
  const floor = 1 / (1 + Math.exp(steepness * midpoint));
  const ceiling = 1 / (1 + Math.exp(-steepness * (100 - midpoint)));
  return clamp100(((logistic - floor) / (ceiling - floor)) * 100);
};

const metricValue = (metric: MetricRecord | undefined, fallback = 50): number => {
  if (!metric || metric.value === null || Number.isNaN(metric.value)) return fallback;
  return clamp100(metric.value);
};

const weighted = (...terms: Array<[number, number]>): number => {
  const totalWeight = terms.reduce((sum, [, weight]) => sum + weight, 0);
  if (totalWeight <= 0) return 0;
  return clamp100(terms.reduce((sum, [value, weight]) => sum + value * weight, 0) / totalWeight);
};

/**
 * Translate model-facing metrics into game-facing capabilities.
 *
 * IMPORTANT: this function knows nothing about model names/providers. That is
 * deliberate. A future model automatically inherits the same rules.
 */
export function mapModelToCivilization(model: ModelRecord): CivilizationProfile {
  const intelligence = smoothCapability(metricValue(model.metrics.intelligence));
  const coding = smoothCapability(metricValue(model.metrics.coding));
  const costEfficiency = smoothCapability(metricValue(model.metrics.costEfficiency));
  const speed = smoothCapability(metricValue(model.metrics.speed));
  const context = smoothCapability(metricValue(model.metrics.context));
  const reliability = smoothCapability(metricValue(model.metrics.reliability));
  const agentic = smoothCapability(metricValue(model.metrics.agentic));
  const multimodal = smoothCapability(metricValue(model.metrics.multimodal));

  const strategicDepth = weighted(
    [intelligence, 0.68],
    [reliability, 0.17],
    [context, 0.15],
  );

  const engineering = weighted(
    [coding, 0.62],
    [agentic, 0.23],
    [intelligence, 0.15],
  );

  const cyberCapability = weighted(
    [coding, 0.55],
    [agentic, 0.25],
    [speed, 0.2],
  );

  const populationCapacity = weighted(
    [costEfficiency, 0.72],
    [speed, 0.13],
    [context, 0.15],
  );

  const reactionSpeed = weighted(
    [speed, 0.7],
    [agentic, 0.2],
    [reliability, 0.1],
  );

  const commandMemory = weighted(
    [context, 0.72],
    [reliability, 0.18],
    [intelligence, 0.1],
  );

  const commandComplexity = weighted(
    [context, 0.4],
    [intelligence, 0.35],
    [agentic, 0.25],
  );

  const autonomousCommand = weighted(
    [agentic, 0.57],
    [intelligence, 0.28],
    [coding, 0.15],
  );

  const sensorFusion = weighted(
    [multimodal, 0.55],
    [reliability, 0.25],
    [intelligence, 0.2],
  );

  // Cheap capability is useful only when the civilization can turn that cheap
  // compute into competent work. This prevents "almost-free but ineffective"
  // profiles from automatically dominating the economy.
  const usefulCapability = weighted(
    [strategicDepth, 0.26],
    [engineering, 0.26],
    [reactionSpeed, 0.16],
    [autonomousCommand, 0.18],
    [reliability, 0.14],
  );

  const operationalEfficiency = clamp100(
    100 * Math.sqrt(clamp01(usefulCapability / 100) * clamp01(costEfficiency / 100)),
  );

  return {
    strategicDepth,
    engineering,
    cyberCapability,
    computeEfficiency: costEfficiency,
    populationCapacity,
    reactionSpeed,
    commandMemory,
    commandComplexity,
    informationReliability: reliability,
    autonomousCommand,
    sensorFusion,
    operationalEfficiency,
  };
}
