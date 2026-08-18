# Frontier Empires — Mandatory Agent Instructions

## STOP: read the project standards before changing anything

**Every AI agent and every human contributor must read these files before planning, editing, generating assets, changing architecture, or writing gameplay code:**

1. [`docs/UNIVERSAL_THREEJS_HIGH_FIDELITY_STANDARD.md`](docs/UNIVERSAL_THREEJS_HIGH_FIDELITY_STANDARD.md)
2. [`docs/FRONTIER_EMPIRES_SPEC.md`](docs/FRONTIER_EMPIRES_SPEC.md)

The Universal Three.js High-Fidelity Standard is the project's visual/physical/interaction quality gate. It is not optional guidance. If a proposed shortcut conflicts with it, redesign the implementation instead of lowering the target.

## Non-negotiable project rules

- **Three.js remains the renderer.** Do not migrate the project to Unity, Unreal, or another engine.
- **No AI API is required to play or simulate the game.** OpenAI, Anthropic, Google, xAI, Moonshot, etc. models are represented as game data and imagery. The real models are not invoked to make in-game decisions.
- **The game owns its simulation.** Strategy, economy, alliances, warfare, logistics, cyber systems, doctrine, and decision-making must run locally through deterministic/rule-based simulation code.
- **Real model characteristics inform fictional military doctrine.** Benchmark-derived statistics are translated into capabilities; they do not literally mean the model is commanding units.
- **Models are replaceable faces in a persistent war history.** New releases can supersede, branch from, ally with, or rival existing factions while the world's history continues.
- **Manual updates are a first-class workflow.** The owner must be able to add a new model or update metrics by editing validated data and adding an image; no remote inference service may be required.
- **Never silently invent missing benchmark values.** Store measured, inferred, fictionalized, and manually balanced values distinctly with provenance/confidence metadata.
- **Benchmark versions matter.** Never compare incompatible benchmark generations as though they share one absolute scale.
- **Do not hard-code faction behavior by model name when a generalized capability mapping can produce it.** `if (model === "Luna") swarm()` is forbidden architecture. Cost efficiency should make swarming rational through the same rules that apply to every faction.
- **Simulation and rendering stay decoupled.** Large wars must not require one full-fidelity Three.js object or full AI tick per distant entity.
- **Mobile is a primary platform from the beginning.** Do not build a desktop-only architecture and retrofit touch later.
- **High fidelity is the default, not a stretch goal.** Primitive geometry may be used only as temporary development instrumentation and must not be mistaken for finished world art.
- **Important objects are systems, not decorative meshes.** Follow the component/physical-vocabulary rules in the universal standard.
- **Use 1 Three.js world unit = 1 meter** unless a documented system explicitly requires otherwise.
- **Optimize with LOD, instancing, workers, streaming, compression, pooling, and spatial partitioning before removing intended fidelity or systems.**

## Required pre-change check

Before making a substantial implementation change, the contributor should be able to answer:

- Which requirement in the high-fidelity standard governs this work?
- Which Frontier Empires gameplay/system requirement does it implement?
- Is the implementation generalized enough for models that do not exist yet?
- Does it preserve the no-AI-API requirement?
- Does it work with the intended mobile architecture?
- Does it keep measured data, derived game statistics, and fictional balancing clearly separated?

If those questions cannot be answered, do not implement the change yet.

## Project north star

> **AI progress in the real world changes the balance of power inside the game, while the dramatic war history continues.**
