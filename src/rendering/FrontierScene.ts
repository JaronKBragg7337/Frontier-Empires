import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CivilizationProfile, ModelRecord, PositionedModel } from '../core/types';
import { mapModelToCivilization } from '../simulation/capabilityMapper';
import { ModelCore } from './ModelCore';

const providerAccent: Record<string, THREE.ColorRepresentation> = {
  OpenAI: 0x65e8c4,
  Anthropic: 0xe3a66f,
  'Moonshot AI': 0x6ea8ff,
  xAI: 0xc7d2dc,
  Google: 0xf3cf65,
};

export type SelectionHandler = (
  model: ModelRecord,
  profile: CivilizationProfile,
) => void;

export class FrontierScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;

  private readonly controls: OrbitControls;
  private readonly clock = new THREE.Clock();
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly modelCores: ModelCore[] = [];
  private readonly positionedModels: PositionedModel[] = [];
  private selectionHandler?: SelectionHandler;
  private raf = 0;

  constructor(private readonly container: HTMLElement, models: ModelRecord[]) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05080b);
    this.scene.fog = new THREE.FogExp2(0x081018, 0.0085);

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 650);
    this.camera.position.set(58, 42, 68);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.domElement.setAttribute('aria-label', 'Frontier Empires 3D observatory');
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.065;
    this.controls.target.set(0, 10, 0);
    this.controls.minDistance = 18;
    this.controls.maxDistance = 145;
    this.controls.maxPolarAngle = Math.PI * 0.485;
    this.controls.screenSpacePanning = false;
    this.controls.zoomToCursor = true;

    this.buildLighting();
    this.buildObservatoryDeck();
    this.buildCapabilityAxes();
    this.addModels(models);

    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp);
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);

    this.onResize();
    this.animate();
  }

  setSelectionHandler(handler: SelectionHandler): void {
    this.selectionHandler = handler;
  }

  getPositionedModels(): readonly PositionedModel[] {
    return this.positionedModels;
  }

  dispose(): void {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.renderer.domElement.removeEventListener('pointerup', this.onPointerUp);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
    this.controls.dispose();
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }

  private buildLighting(): void {
    const hemisphere = new THREE.HemisphereLight(0x9dbbd5, 0x15110c, 1.25);
    hemisphere.name = 'environment_hemisphere';
    this.scene.add(hemisphere);

    const key = new THREE.DirectionalLight(0xe8f2ff, 4.1);
    key.name = 'primary_sun';
    key.position.set(34, 62, 26);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -70;
    key.shadow.camera.right = 70;
    key.shadow.camera.top = 70;
    key.shadow.camera.bottom = -70;
    key.shadow.camera.near = 2;
    key.shadow.camera.far = 150;
    key.shadow.bias = -0.00035;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x4c78a8, 1.15);
    rim.name = 'cool_rim';
    rim.position.set(-48, 28, -35);
    this.scene.add(rim);
  }

  private buildObservatoryDeck(): void {
    const deckMaterial = new THREE.MeshStandardMaterial({
      color: 0x11171d,
      metalness: 0.35,
      roughness: 0.72,
    });
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: 0x263038,
      metalness: 0.82,
      roughness: 0.32,
    });

    const deck = new THREE.Mesh(
      new THREE.CylinderGeometry(54, 56, 1.35, 96, 2),
      deckMaterial,
    );
    deck.name = 'observatory_primary_deck';
    deck.position.y = -0.68;
    deck.receiveShadow = true;
    this.scene.add(deck);

    const perimeter = new THREE.Mesh(
      new THREE.TorusGeometry(53.4, 0.32, 12, 160),
      trimMaterial,
    );
    perimeter.name = 'perimeter_service_rail';
    perimeter.rotation.x = Math.PI / 2;
    perimeter.position.y = 0.06;
    perimeter.castShadow = true;
    this.scene.add(perimeter);

    // Radial deck seams are physical inlaid strips instead of a shader-only grid.
    for (let index = 0; index < 24; index += 1) {
      const angle = (index / 24) * Math.PI * 2;
      const seam = new THREE.Mesh(
        new THREE.BoxGeometry(0.055, 0.025, 50),
        trimMaterial,
      );
      seam.name = `deck_radial_seam_${index}`;
      seam.position.y = 0.018;
      seam.rotation.y = angle;
      this.scene.add(seam);
    }

    // Concentric maintenance rings provide scale and improve depth perception.
    [12, 24, 36, 48].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.045, 8, 144),
        trimMaterial,
      );
      ring.name = `deck_maintenance_ring_${index}`;
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.03;
      this.scene.add(ring);
    });
  }

  private buildCapabilityAxes(): void {
    const axisMaterial = new THREE.MeshStandardMaterial({
      color: 0x65727e,
      emissive: 0x111820,
      emissiveIntensity: 0.85,
      metalness: 0.72,
      roughness: 0.35,
    });

    const makeAxis = (
      name: string,
      start: THREE.Vector3,
      end: THREE.Vector3,
      radius = 0.075,
    ): THREE.Mesh => {
      const direction = end.clone().sub(start);
      const length = direction.length();
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, length, 10),
        axisMaterial,
      );
      mesh.name = name;
      mesh.position.copy(start.clone().add(end).multiplyScalar(0.5));
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      return mesh;
    };

    this.scene.add(
      makeAxis('axis_intelligence', new THREE.Vector3(-44, 0.13, -42), new THREE.Vector3(44, 0.13, -42)),
      makeAxis('axis_cost_efficiency', new THREE.Vector3(-44, 0.13, -42), new THREE.Vector3(-44, 0.13, 42)),
      makeAxis('axis_coding', new THREE.Vector3(-44, 0.13, -42), new THREE.Vector3(-44, 27, -42)),
    );
  }

  private addModels(models: ModelRecord[]): void {
    models.forEach((model) => {
      const profile = mapModelToCivilization(model);
      const intelligence = model.metrics.intelligence?.value ?? 50;
      const coding = model.metrics.coding?.value ?? 50;
      const efficiency = model.metrics.costEfficiency?.value ?? 50;

      // X = Intelligence, Y = Coding, Z = Cost efficiency.
      // The numeric ranges are visual transforms only. Raw source values remain
      // untouched in the registry and inspector.
      const x = THREE.MathUtils.mapLinear(intelligence, 45, 70, -34, 34);
      const y = THREE.MathUtils.mapLinear(coding, 40, 75, 3.2, 22);
      const z = THREE.MathUtils.mapLinear(efficiency, 0, 100, -34, 34);
      const accent = providerAccent[model.provider] ?? 0x8fc7dd;

      const pylon = this.buildObservationPylon(x, z, y, accent, model.id);
      this.scene.add(pylon);

      const core = new ModelCore({ model, profile, accent });
      core.position.set(x, y, z);
      core.scale.setScalar(0.82);
      core.traverse((object) => {
        object.userData.modelId = model.id;
      });
      this.scene.add(core);
      this.modelCores.push(core);

      this.positionedModels.push({
        model,
        profile,
        position: { x, y, z },
      });
    });
  }

  private buildObservationPylon(
    x: number,
    z: number,
    topY: number,
    accent: THREE.ColorRepresentation,
    modelId: string,
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = `observation_pylon:${modelId}`;
    group.position.set(x, 0, z);

    const metal = new THREE.MeshStandardMaterial({
      color: 0x202a31,
      metalness: 0.84,
      roughness: 0.34,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x070b0e,
      metalness: 0.92,
      roughness: 0.28,
    });
    const beacon = new THREE.MeshStandardMaterial({
      color: accent,
      emissive: new THREE.Color(accent),
      emissiveIntensity: 1.5,
      metalness: 0.35,
      roughness: 0.22,
    });

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 4.45, 0.5, 32),
      metal,
    );
    platform.name = 'top_service_platform';
    platform.position.y = topY - 0.25;
    platform.castShadow = true;
    platform.receiveShadow = true;
    group.add(platform);

    const legOffset = 2.85;
    const legHeight = Math.max(2.5, topY - 0.5);
    const legGeometry = new THREE.CylinderGeometry(0.18, 0.24, legHeight, 12);
    const legPoints = [
      [-legOffset, -legOffset],
      [legOffset, -legOffset],
      [legOffset, legOffset],
      [-legOffset, legOffset],
    ] as const;

    legPoints.forEach(([lx, lz], index) => {
      const leg = new THREE.Mesh(legGeometry, metal);
      leg.name = `pylon_leg_${index}`;
      leg.position.set(lx, legHeight / 2, lz);
      leg.castShadow = true;
      group.add(leg);
    });

    const levels = Math.max(2, Math.floor(legHeight / 2.4));
    for (let level = 1; level < levels; level += 1) {
      const y = (level / levels) * legHeight;
      const braces = [
        [[-legOffset, -legOffset], [legOffset, -legOffset]],
        [[legOffset, -legOffset], [legOffset, legOffset]],
        [[legOffset, legOffset], [-legOffset, legOffset]],
        [[-legOffset, legOffset], [-legOffset, -legOffset]],
      ] as const;
      braces.forEach(([start, end], braceIndex) => {
        const a = new THREE.Vector3(start[0], y, start[1]);
        const b = new THREE.Vector3(end[0], y, end[1]);
        const direction = b.clone().sub(a);
        const brace = new THREE.Mesh(
          new THREE.CylinderGeometry(0.075, 0.075, direction.length(), 8),
          dark,
        );
        brace.name = `cross_brace_${level}_${braceIndex}`;
        brace.position.copy(a.clone().add(b).multiplyScalar(0.5));
        brace.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
        group.add(brace);
      });
    }

    const beaconHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.22, 0.5, 12),
      beacon,
    );
    beaconHousing.name = 'metric_beacon';
    beaconHousing.position.set(3.55, topY + 0.05, 0);
    group.add(beaconHousing);

    return group;
  }

  private onResize = (): void => {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);
  };

  private onPointerMove = (event: PointerEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersections = this.raycaster.intersectObjects(this.modelCores, true);
    this.renderer.domElement.style.cursor = intersections.length > 0 ? 'pointer' : 'grab';
  };

  private onPointerUp = (event: PointerEvent): void => {
    // Ignore multi-touch gesture completion; OrbitControls owns those gestures.
    if (!event.isPrimary) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersections = this.raycaster.intersectObjects(this.modelCores, true);
    const hit = intersections[0]?.object;
    if (!hit) return;

    let cursor: THREE.Object3D | null = hit;
    while (cursor && !(cursor instanceof ModelCore)) cursor = cursor.parent;
    if (!(cursor instanceof ModelCore)) return;

    this.selectionHandler?.(cursor.model, cursor.profile);
  };

  private animate = (): void => {
    this.raf = requestAnimationFrame(this.animate);
    const elapsed = this.clock.getElapsedTime();
    this.controls.update();
    this.modelCores.forEach((core) => core.update(elapsed));
    this.renderer.render(this.scene, this.camera);
  };
}
