export type MetricConfidence =
  | 'high'
  | 'medium'
  | 'low'
  | 'inferred'
  | 'fictional';

export interface MetricRecord {
  metric: string;
  value: number | null;
  benchmark?: string;
  benchmarkVersion?: string;
  measuredAt?: string;
  source?: string;
  confidence: MetricConfidence;
}

export type ModelStatus = 'active' | 'historical' | 'preview' | 'unverified';

export interface ModelRecord {
  id: string;
  name: string;
  provider: string;
  family?: string;
  parentModel?: string;
  releaseDate?: string;
  image?: string;
  status: ModelStatus;
  metrics: Record<string, MetricRecord>;
}

export interface CivilizationProfile {
  strategicDepth: number;
  engineering: number;
  cyberCapability: number;
  computeEfficiency: number;
  populationCapacity: number;
  reactionSpeed: number;
  commandMemory: number;
  commandComplexity: number;
  informationReliability: number;
  autonomousCommand: number;
  sensorFusion: number;
  operationalEfficiency: number;
}

export interface CapabilityRange {
  min: number;
  max: number;
}

export interface FactionPresentation {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  architecture: 'fortress' | 'industrial' | 'network' | 'balanced';
}

export interface PositionedModel {
  model: ModelRecord;
  profile: CivilizationProfile;
  position: {
    x: number;
    y: number;
    z: number;
  };
}
