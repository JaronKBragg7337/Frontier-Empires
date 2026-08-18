import type { CivilizationProfile, MetricRecord, ModelRecord } from '../core/types';

const metricLabel: Record<string, string> = {
  intelligence: 'Intelligence',
  coding: 'Coding',
  costEfficiency: 'Cost efficiency',
  speed: 'Speed',
  context: 'Context',
  reliability: 'Reliability',
  agentic: 'Agentic ability',
  multimodal: 'Multimodal',
};

const capabilityLabel: Record<keyof CivilizationProfile, string> = {
  strategicDepth: 'Strategic depth',
  engineering: 'Engineering',
  cyberCapability: 'Cyber capability',
  computeEfficiency: 'Compute efficiency',
  populationCapacity: 'Population capacity',
  reactionSpeed: 'Reaction speed',
  commandMemory: 'Command memory',
  commandComplexity: 'Command complexity',
  informationReliability: 'Information reliability',
  autonomousCommand: 'Officer autonomy',
  sensorFusion: 'Sensor fusion',
  operationalEfficiency: 'Operational efficiency',
};

const formatMetric = (metric: MetricRecord): string => {
  if (metric.value === null) return 'Unknown';
  return Number.isInteger(metric.value) ? String(metric.value) : metric.value.toFixed(2);
};

export class Hud {
  private readonly root: HTMLElement;
  private readonly inspector: HTMLElement;
  private readonly selectedName: HTMLElement;
  private readonly selectedProvider: HTMLElement;
  private readonly rawMetrics: HTMLElement;
  private readonly capabilities: HTMLElement;

  constructor(container: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'hud';
    this.root.innerHTML = `
      <header class="topbar glass-panel">
        <div class="brand-block">
          <div class="eyebrow">HEARTBEAT OBSERVATORY // STRATEGIC SIMULATION</div>
          <h1>FRONTIER EMPIRES</h1>
          <p>The frontier never stays conquered.</p>
        </div>
        <div class="mode-switch" aria-label="Game mode">
          <button class="mode active" type="button" data-mode="observatory">Observatory</button>
          <button class="mode" type="button" data-mode="war" disabled title="War Mode foundation is next">War</button>
          <button class="mode" type="button" data-mode="history" disabled title="History Mode foundation is next">History</button>
        </div>
      </header>

      <aside class="axis-panel glass-panel">
        <div class="panel-kicker">CAPABILITY SPACE</div>
        <div class="axis-row"><span class="axis-chip axis-x">X</span><strong>Intelligence</strong></div>
        <div class="axis-row"><span class="axis-chip axis-y">Y</span><strong>Coding</strong></div>
        <div class="axis-row"><span class="axis-chip axis-z">Z</span><strong>Cost efficiency</strong></div>
        <p>Drag to orbit · pinch / wheel to zoom · tap a Model Core to inspect.</p>
      </aside>

      <aside class="inspector glass-panel is-empty" aria-live="polite">
        <button class="inspector-close" type="button" aria-label="Close model inspector">×</button>
        <div class="panel-kicker">MODEL CORE</div>
        <h2 class="selected-name">Select a civilization</h2>
        <div class="selected-provider">Tap one of the structures in capability space.</div>
        <section class="metric-section">
          <h3>Source / manual metrics</h3>
          <div class="raw-metrics"></div>
        </section>
        <section class="metric-section">
          <h3>Derived military capability</h3>
          <div class="capabilities"></div>
        </section>
      </aside>

      <div class="data-warning glass-panel">
        <span class="status-light"></span>
        <span><strong>No AI API.</strong> Models are local data + imagery. Values marked fictional are temporary game inputs, not benchmark claims.</span>
      </div>
    `;

    container.appendChild(this.root);

    this.inspector = this.root.querySelector('.inspector') as HTMLElement;
    this.selectedName = this.root.querySelector('.selected-name') as HTMLElement;
    this.selectedProvider = this.root.querySelector('.selected-provider') as HTMLElement;
    this.rawMetrics = this.root.querySelector('.raw-metrics') as HTMLElement;
    this.capabilities = this.root.querySelector('.capabilities') as HTMLElement;

    this.root.querySelector('.inspector-close')?.addEventListener('click', () => {
      this.inspector.classList.add('is-empty');
      this.selectedName.textContent = 'Select a civilization';
      this.selectedProvider.textContent = 'Tap one of the structures in capability space.';
      this.rawMetrics.replaceChildren();
      this.capabilities.replaceChildren();
    });
  }

  inspect(model: ModelRecord, profile: CivilizationProfile): void {
    this.inspector.classList.remove('is-empty');
    this.selectedName.textContent = model.name;
    this.selectedProvider.textContent = `${model.provider}${model.family ? ` · ${model.family}` : ''}`;

    this.rawMetrics.replaceChildren();
    Object.entries(model.metrics).forEach(([key, metric]) => {
      const row = document.createElement('div');
      row.className = 'metric-row';

      const label = document.createElement('div');
      label.className = 'metric-label';
      label.textContent = metricLabel[key] ?? metric.metric;

      const valueWrap = document.createElement('div');
      valueWrap.className = 'metric-value-wrap';

      const value = document.createElement('strong');
      value.className = 'metric-value';
      value.textContent = formatMetric(metric);

      const confidence = document.createElement('span');
      confidence.className = `confidence confidence-${metric.confidence}`;
      confidence.textContent = metric.confidence;

      valueWrap.append(value, confidence);
      row.append(label, valueWrap);

      if (metric.benchmark) {
        const source = document.createElement('div');
        source.className = 'metric-source';
        source.textContent = `${metric.benchmark}${metric.benchmarkVersion ? ` · v${metric.benchmarkVersion}` : ''}`;
        row.append(source);
      }

      this.rawMetrics.appendChild(row);
    });

    this.capabilities.replaceChildren();
    (Object.keys(profile) as Array<keyof CivilizationProfile>).forEach((key) => {
      const value = profile[key];
      const row = document.createElement('div');
      row.className = 'capability-row';

      const label = document.createElement('span');
      label.textContent = capabilityLabel[key];

      const meter = document.createElement('div');
      meter.className = 'capability-meter';

      const fill = document.createElement('div');
      fill.className = 'capability-meter-fill';
      fill.style.width = `${Math.max(0, Math.min(100, value))}%`;

      const numeric = document.createElement('strong');
      numeric.textContent = value.toFixed(0);

      meter.appendChild(fill);
      row.append(label, meter, numeric);
      this.capabilities.appendChild(row);
    });
  }
}
