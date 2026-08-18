import type { ModelRecord } from '../core/types';

const normalizedMetrics = new Set([
  'intelligence',
  'coding',
  'costEfficiency',
  'speed',
  'context',
  'reliability',
  'agentic',
  'multimodal',
]);

export interface ValidationProblem {
  modelId: string;
  field: string;
  message: string;
}

export function validateModels(models: ModelRecord[]): ValidationProblem[] {
  const problems: ValidationProblem[] = [];
  const ids = new Set<string>();

  models.forEach((model) => {
    if (ids.has(model.id)) {
      problems.push({
        modelId: model.id,
        field: 'id',
        message: `Duplicate model id: ${model.id}`,
      });
    }
    ids.add(model.id);

    if (!model.name.trim()) {
      problems.push({ modelId: model.id, field: 'name', message: 'Model name is empty.' });
    }

    if (!model.provider.trim()) {
      problems.push({ modelId: model.id, field: 'provider', message: 'Provider is empty.' });
    }

    Object.entries(model.metrics).forEach(([key, metric]) => {
      if (metric.value !== null && !Number.isFinite(metric.value)) {
        problems.push({
          modelId: model.id,
          field: `metrics.${key}`,
          message: 'Metric value must be finite or null.',
        });
      }

      if (
        normalizedMetrics.has(key) &&
        metric.value !== null &&
        (metric.value < 0 || metric.value > 100)
      ) {
        problems.push({
          modelId: model.id,
          field: `metrics.${key}`,
          message: `Normalized metric ${key} must remain within 0..100.`,
        });
      }

      if (
        (metric.confidence === 'high' || metric.confidence === 'medium') &&
        !metric.source &&
        (key === 'intelligence' || key === 'coding')
      ) {
        problems.push({
          modelId: model.id,
          field: `metrics.${key}.source`,
          message: 'Measured benchmark metrics require source/provenance text.',
        });
      }
    });
  });

  return problems;
}
