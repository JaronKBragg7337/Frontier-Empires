import * as THREE from 'three';
import type { CivilizationProfile, ModelRecord } from '../core/types';

export interface ModelCoreOptions {
  model: ModelRecord;
  profile: CivilizationProfile;
  accent: THREE.ColorRepresentation;
}

/**
 * Procedural Model Core used by the Observatory and later as the seed of a
 * civilization in War Mode. It is intentionally assembled from semantically
 * named components rather than represented as one decorative mesh.
 */
export class ModelCore extends THREE.Group {
  readonly model: ModelRecord;
  readonly profile: CivilizationProfile;
  private readonly accentMaterial: THREE.MeshStandardMaterial;
  private readonly emissiveMaterial: THREE.MeshStandardMaterial;
  private readonly rotatingRings: THREE.Object3D[] = [];

  constructor({ model, profile, accent }: ModelCoreOptions) {
    super();
    this.model = model;
    this.profile = profile;
    this.name = `MODEL_CORE:${model.id}`;
    this.userData.assetId = `CORE-${model.id.toUpperCase()}`;
    this.userData.assetType = 'ModelCore';
    this.userData.modelId = model.id;

    const accentColor = new THREE.Color(accent);

    const structuralMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.105, 0.125, 0.145),
      metalness: 0.82,
      roughness: 0.34,
    });

    const darkMetal = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.035, 0.045, 0.052),
      metalness: 0.9,
      roughness: 0.25,
    });

    this.accentMaterial = new THREE.MeshStandardMaterial({
      color: accentColor.clone().multiplyScalar(0.72),
      metalness: 0.58,
      roughness: 0.27,
    });

    this.emissiveMaterial = new THREE.MeshStandardMaterial({
      color: accentColor.clone().multiplyScalar(0.22),
      emissive: accentColor,
      emissiveIntensity: 2.15,
      metalness: 0.32,
      roughness: 0.2,
    });

    // PRIMARY FORM — load-bearing base and central command housing.
    const foundation = new THREE.Mesh(
      new THREE.CylinderGeometry(3.3, 3.7, 0.72, 48, 2),
      structuralMaterial,
    );
    foundation.name = 'foundation';
    foundation.position.y = 0.36;
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    this.add(foundation);

    const lowerPlinth = new THREE.Mesh(
      new THREE.CylinderGeometry(2.65, 3.05, 0.78, 32, 2),
      darkMetal,
    );
    lowerPlinth.name = 'lower_plinth';
    lowerPlinth.position.y = 1.05;
    lowerPlinth.castShadow = true;
    lowerPlinth.receiveShadow = true;
    this.add(lowerPlinth);

    const commandHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 2.15, 4.4, 24, 4),
      structuralMaterial,
    );
    commandHousing.name = 'command_housing';
    commandHousing.position.y = 3.35;
    commandHousing.castShadow = true;
    commandHousing.receiveShadow = true;
    this.add(commandHousing);

    const cognitionCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.18, 3),
      this.emissiveMaterial,
    );
    cognitionCore.name = 'cognition_core';
    cognitionCore.position.y = 5.75;
    cognitionCore.scale.y = 1.24;
    cognitionCore.castShadow = true;
    this.add(cognitionCore);

    // SECONDARY FORM — structural buttresses explain how the tall housing is
    // supported and give stronger silhouette readability at RTS camera range.
    const buttressGeometry = new THREE.BoxGeometry(0.54, 2.35, 1.18, 2, 4, 2);
    for (let index = 0; index < 6; index += 1) {
      const angle = (index / 6) * Math.PI * 2;
      const buttress = new THREE.Mesh(buttressGeometry, structuralMaterial);
      buttress.name = `buttress_${index}`;
      buttress.position.set(Math.cos(angle) * 2.3, 2.1, Math.sin(angle) * 2.3);
      buttress.rotation.y = -angle;
      buttress.rotation.z = Math.cos(angle) * 0.055;
      buttress.castShadow = true;
      buttress.receiveShadow = true;
      this.add(buttress);

      const servicePanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 1.1, 0.68),
        this.accentMaterial,
      );
      servicePanel.name = `service_panel_${index}`;
      servicePanel.position.set(Math.cos(angle) * 2.89, 2.25, Math.sin(angle) * 2.89);
      servicePanel.rotation.y = -angle;
      servicePanel.castShadow = true;
      this.add(servicePanel);
    }

    // Rotating data/command rings are separate assemblies with independent
    // pivots. Their speed later communicates operational tempo.
    const ringSpecs = [
      { radius: 2.0, tube: 0.09, y: 4.45, tilt: 0.28 },
      { radius: 2.55, tube: 0.075, y: 5.25, tilt: -0.45 },
      { radius: 1.75, tube: 0.07, y: 6.4, tilt: 0.75 },
    ];

    ringSpecs.forEach((spec, index) => {
      const pivot = new THREE.Group();
      pivot.name = `command_ring_pivot_${index}`;
      pivot.position.y = spec.y;
      pivot.rotation.x = spec.tilt;

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(spec.radius, spec.tube, 12, 80),
        index === 1 ? this.emissiveMaterial : this.accentMaterial,
      );
      ring.name = `command_ring_${index}`;
      ring.rotation.x = Math.PI / 2;
      ring.castShadow = true;
      pivot.add(ring);
      this.add(pivot);
      this.rotatingRings.push(pivot);
    });

    // SECONDARY/TIERTIARY — radial conduits and access pylons make the core
    // read as infrastructure rather than a magic sculpture.
    for (let index = 0; index < 8; index += 1) {
      const angle = (index / 8) * Math.PI * 2 + Math.PI / 8;
      const pylon = new THREE.Group();
      pylon.name = `utility_pylon_${index}`;
      pylon.position.set(Math.cos(angle) * 4.3, 0, Math.sin(angle) * 4.3);
      pylon.rotation.y = -angle;

      const foot = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.38, 1.05),
        darkMetal,
      );
      foot.name = 'pylon_foot';
      foot.position.y = 0.19;
      foot.castShadow = true;
      foot.receiveShadow = true;
      pylon.add(foot);

      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.17, 0.24, 1.75, 12),
        structuralMaterial,
      );
      mast.name = 'pylon_mast';
      mast.position.y = 1.06;
      mast.castShadow = true;
      pylon.add(mast);

      const sensor = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 18, 12),
        this.emissiveMaterial,
      );
      sensor.name = 'pylon_sensor';
      sensor.position.y = 1.98;
      pylon.add(sensor);

      this.add(pylon);

      const start = new THREE.Vector3(
        Math.cos(angle) * 2.95,
        0.25,
        Math.sin(angle) * 2.95,
      );
      const end = new THREE.Vector3(
        Math.cos(angle) * 4.0,
        0.25,
        Math.sin(angle) * 4.0,
      );
      const conduit = this.makeConduit(start, end, darkMetal, `conduit_${index}`);
      this.add(conduit);
    }

    // TERTIARY FASTENERS — real geometry because they contribute shadows and
    // visible construction detail near the player/inspection camera.
    const boltGeometry = new THREE.CylinderGeometry(0.055, 0.055, 0.08, 10);
    for (let index = 0; index < 24; index += 1) {
      const angle = (index / 24) * Math.PI * 2;
      const bolt = new THREE.Mesh(boltGeometry, darkMetal);
      bolt.name = `foundation_fastener_${index}`;
      bolt.position.set(Math.cos(angle) * 3.2, 0.76, Math.sin(angle) * 3.2);
      bolt.rotation.z = Math.PI / 2;
      bolt.rotation.y = -angle;
      bolt.castShadow = true;
      this.add(bolt);
    }

    // Ground-facing access threshold provides an explicit functional entry
    // location for later possession/interaction systems.
    const accessThreshold = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.12, 0.72),
      this.accentMaterial,
    );
    accessThreshold.name = 'access_threshold';
    accessThreshold.position.set(0, 0.83, 2.82);
    accessThreshold.castShadow = true;
    this.add(accessThreshold);

    this.userData.interaction = {
      type: 'InspectModelCore',
      accessPoint: { x: 0, y: 0.9, z: 3.6 },
    };
  }

  update(elapsedSeconds: number): void {
    const tempo = 0.1 + (this.profile.reactionSpeed / 100) * 0.48;
    this.rotatingRings.forEach((ring, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      ring.rotation.y = elapsedSeconds * tempo * direction * (1 + index * 0.22);
      ring.rotation.z += 0.00035 * direction;
    });

    this.emissiveMaterial.emissiveIntensity =
      1.85 + Math.sin(elapsedSeconds * (1.1 + tempo)) * 0.28;
  }

  private makeConduit(
    start: THREE.Vector3,
    end: THREE.Vector3,
    material: THREE.Material,
    name: string,
  ): THREE.Mesh {
    const direction = end.clone().sub(start);
    const length = direction.length();
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    const conduit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, length, 10),
      material,
    );
    conduit.name = name;
    conduit.position.copy(midpoint);
    conduit.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize(),
    );
    conduit.castShadow = true;
    return conduit;
  }
}
