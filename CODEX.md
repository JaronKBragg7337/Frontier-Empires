# Codex Instructions for Frontier Empires

Before making any change, read:

1. `AGENTS.md`
2. `docs/UNIVERSAL_THREEJS_HIGH_FIDELITY_STANDARD.md`
3. `docs/FRONTIER_EMPIRES_SPEC.md`

Do not begin implementation before these are read.

Treat the Universal Three.js High-Fidelity Standard as a hard requirement. Do not replace intended fidelity with primitive geometry, decorative-only machines, simplistic collision, desktop-only controls, or disposable architecture merely because the project runs in a browser.

Frontier Empires has **no runtime AI API dependency**. AI model names/images/metrics are data used by a local deterministic/rule-based simulation. New models must be addable without name-specific gameplay code.
