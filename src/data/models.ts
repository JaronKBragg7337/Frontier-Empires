import registry from './model-registry.json';
import type { ModelRecord } from '../core/types';

/**
 * Manually editable registry loader.
 *
 * The real AI models are NEVER called by Frontier Empires. The JSON file is
 * the owner-facing source of truth for model names, images, measured metrics,
 * and clearly marked inferred/fictional game inputs.
 *
 * Runtime validation in validateModels.ts catches malformed values before the
 * scene/simulation starts.
 */
export const models = registry as ModelRecord[];
