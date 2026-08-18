# Frontier Empires

**The frontier never stays conquered.**

Frontier Empires is a Three.js real-time strategy game and living AI-model war history. Public model characteristics are translated into fictional military doctrine: intelligence becomes strategic depth, coding becomes engineering/cyber capability, cost efficiency becomes scale, speed becomes operational tempo, context becomes command capacity, reliability becomes information integrity, and agentic ability becomes officer autonomy.

The actual AI models are **not** called at runtime. There is no AI API dependency. Models are data records and images interpreted by Frontier Empires' own simulation.

## Core idea

A cheap model may naturally field a huge force because its operational economy supports it. A more intelligent but expensive model may field fewer units while winning through deception, terrain use, logistics attacks, and long-horizon planning. A coding-heavy faction may rely on automation, drones, cyberwarfare, and programmable defenses.

These are not hard-coded personalities. The same generalized capability system applies to models that do not exist yet.

As new real-world models arrive, the owner can update the registry manually, add an image, and decide whether the new model enters the persistent story as a successor, branch, ally, rival, or new civilization.

## Three views, one world

- **War Mode** — RTS warfare, economy, logistics, diplomacy, alliances, territory, and succession.
- **Observatory Mode** — interactive 3D model capability space and Pareto/frontier visualization.
- **History Mode** — replay model generations, wars, alliances, benchmark snapshots, and succession through time.

## Mandatory contributor reading

Before touching the project, read:

1. [`AGENTS.md`](AGENTS.md)
2. [`docs/UNIVERSAL_THREEJS_HIGH_FIDELITY_STANDARD.md`](docs/UNIVERSAL_THREEJS_HIGH_FIDELITY_STANDARD.md)
3. [`docs/FRONTIER_EMPIRES_SPEC.md`](docs/FRONTIER_EMPIRES_SPEC.md)

The high-fidelity standard is a project requirement, not optional polish.

## Technical direction

- Three.js + TypeScript
- Vite web deployment
- mobile-first input architecture
- simulation separated from rendering
- Web Workers for expensive simulation where appropriate
- deterministic / seeded replay support
- manual model data workflow
- no AI API required
- GLTF/GLB production asset pipeline
- simulation, visual, physics, animation, and AI LOD kept distinct
- intended deployment through Heartbeat Observatory

## Status

Repository foundation and architecture are being established. The first proving scenario will demonstrate multiple benchmark-derived military doctrines in the same terrain without model-name-specific behavior hacks.
