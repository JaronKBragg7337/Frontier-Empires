import './styles.css';
import { models } from './data/models';
import { validateModels } from './data/validateModels';
import { FrontierScene } from './rendering/FrontierScene';
import { Hud } from './ui/Hud';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root.');

const problems = validateModels(models);
if (problems.length > 0) {
  console.error('[Frontier Empires] model registry validation failed:', problems);

  const panel = document.createElement('pre');
  panel.style.margin = '16px';
  panel.style.padding = '16px';
  panel.style.whiteSpace = 'pre-wrap';
  panel.style.background = '#220f12';
  panel.style.border = '1px solid #7a2d35';
  panel.style.borderRadius = '12px';
  panel.textContent = [
    'Frontier Empires model data is invalid.',
    '',
    ...problems.map((problem) => `${problem.modelId} :: ${problem.field} :: ${problem.message}`),
  ].join('\n');
  app.appendChild(panel);
  throw new Error('Model registry validation failed.');
}

const viewport = document.createElement('div');
viewport.className = 'viewport';
app.appendChild(viewport);

const scene = new FrontierScene(viewport, models);
const hud = new Hud(app);

scene.setSelectionHandler((model, profile) => {
  hud.inspect(model, profile);
});

// Expose a deliberately small debug surface for inspection without coupling
// game code to browser globals.
Object.defineProperty(window, '__FRONTIER_EMPIRES__', {
  value: {
    version: '0.1.0',
    models: scene.getPositionedModels(),
  },
  writable: false,
  configurable: false,
});
