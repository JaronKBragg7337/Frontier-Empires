# Frontier Empires repository instructions

Before proposing or changing code, read:

- `AGENTS.md`
- `docs/UNIVERSAL_THREEJS_HIGH_FIDELITY_STANDARD.md`
- `docs/FRONTIER_EMPIRES_SPEC.md`

These files define the project's mandatory quality bar and architecture. Do not proceed without them.

Key reminders:

- Three.js stays the renderer.
- No runtime AI API is required.
- Models are data + imagery, not live inference agents.
- Real model characteristics feed generalized capability mapping.
- Never hard-code doctrine by model name when data-driven rules can produce it.
- Preserve measured vs inferred vs fictional data provenance.
- Mobile is primary, not a later retrofit.
- High visual/physical/interaction fidelity is required; optimize around bottlenecks rather than removing the intended feature.
