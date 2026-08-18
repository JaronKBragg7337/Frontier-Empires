# Frontier Empires — Project Specification

## North Star

**AI progress in the real world changes the balance of power inside the game, while the dramatic war history continues.**

Frontier Empires is a production-quality Three.js real-time strategy game and living visualization in which real AI model releases are represented as fictional military civilizations. The actual language models do not run the game. Their public characteristics become source material for data-driven faction capabilities, and the game's own simulation produces the war, diplomacy, economy, logistics, and emergent story.

The world must continue across model generations. When a newer model appears, its name/image/stat profile can replace, inherit from, branch from, ally with, or challenge older factions without resetting the history.

## Core fiction

A model is a **war mind / civilization identity**, not an API endpoint.

Models can act as:

- sovereign civilizations
- successor rulers
- specialized military branches
- splinter factions
- allied commanders
- rival claimants
- historical predecessors

A newer model can inherit territory, infrastructure, treaties, enemies, wars, and political consequences from a predecessor while changing the civilization's military doctrine through a new capability profile.

## No AI API dependency

The project must not require OpenAI, Anthropic, Google, xAI, Moonshot, or any other AI API for gameplay.

The game must remain capable of running from static/manual model data plus local simulation code.

A model entry consists of data such as:

```ts
interface ModelRecord {
  id: string;
  name: string;
  provider: string;
  family?: string;
  parentModel?: string;
  releaseDate?: string;
  image: string;
  status: 'active' | 'historical' | 'preview' | 'unverified';
  metrics: Record<string, MetricRecord>;
  simulationProfile?: CivilizationProfile;
}
```

New models should be addable by updating validated data and adding/replacing an image asset.

## Raw data, derived capabilities, and fiction must be separate

Do not collapse these three layers:

1. **Measured/source data** — benchmark values, cost, speed, context, dates, provenance.
2. **Derived simulation capability** — normalized game-facing values produced by documented mapping functions.
3. **Fiction/game balance state** — territory, alliances, current army strength, damage, historical events, temporary buffs/debuffs.

This separation allows benchmark updates without destroying the persistent story.

## Benchmark → civilization translation

Never hard-code military doctrine to a specific model name if the same behavior can emerge from generic rules.

Bad:

```ts
if (model.name === 'GPT-5.6 Luna') spawnHugeArmy();
```

Correct architecture:

```text
raw metrics
   ↓
normalization
   ↓
capability mapping
   ↓
economics / strategy / engineering rules
   ↓
emergent doctrine
```

### Intelligence → strategic depth

Influences:

- long-horizon planning
- tactical prediction
- terrain exploitation
- ambush quality
- deception
- resource allocation
- threat prioritization
- retreat timing
- counter-strategy
- trap detection
- formation choice
- multi-stage campaign planning

Do not convert intelligence into arbitrary weapon damage.

### Coding → engineering, automation, and cyber capability

Influences:

- autonomous factories
- robotics
- drones
- programmable defenses
- automated logistics
- targeting systems
- battlefield networks
- hacking
- counter-hacking
- electronic warfare
- sensor fusion
- automated repair
- infrastructure optimization
- adaptive defenses

Cyber effects can disrupt production, corrupt information, spoof sensors, delay orders, compromise automated systems, or intercept reconnaissance.

### Cost / efficiency → compute economy and scale

Lower operating cost means the same resource budget can support more active processes, workers, scouts, automated units, factories, and military formations.

Cost efficiency should influence:

- population capacity
- unit replacement cost
- worker density
- scout density
- factory throughput
- territorial coverage
- simultaneous operations

Cheap must not mean infinitely scalable. Large forces also consume energy, material, bandwidth, logistics capacity, and memory.

### Output speed / latency → operational tempo

Influences:

- command latency
- reaction time
- formation changes
- scouting updates
- logistics rerouting
- defensive response
- target reassessment
- routine decision throughput

### Context → command complexity / institutional memory

Influences:

- concurrent plans
- campaign memory
- retained reconnaissance
- multi-front coordination
- state size that can be governed coherently
- diplomatic memory
- operational continuity

Exceeding command complexity should create information degradation, stale orders, duplicated effort, forgotten intelligence, or abandoned objectives.

### Reliability / hallucination → information integrity

Every faction maintains a **belief state** distinct from world ground truth.

Low information reliability can produce:

- incorrect unit counts
- phantom threats
- wrong threat classifications
- unreliable resource estimates
- overreaction to bad intelligence

This must be a serious strategic mechanic, not only a joke.

### Agentic / tool-use capability → officer autonomy

High capability permits the player or strategic AI to issue high-level goals while subordinate systems autonomously perform reconnaissance, logistics, route selection, staging, attack, occupation, repair, and adaptation.

Lower capability requires more direct control and produces weaker delegation.

### Multimodal ability → sensor fusion

Where reliable source data exists, multimodal performance can affect visual reconnaissance, aerial imagery interpretation, terrain classification, damaged-infrastructure inspection, and target identification.

## Core resources

The setting should use resources that make sense for computational civilizations while still supporting physical warfare:

- **Compute** — active processing capacity
- **Energy** — powers physical and computational infrastructure
- **Data** — research, reconnaissance, doctrine improvement
- **Bandwidth** — coordination and communication capacity
- **Memory** — persistent command state
- **Material** — physical construction and replacement parts
- **Tokens** — active reasoning expenditure / decision budget

These resources must interact rather than behave as isolated currencies.

## Military hierarchy

Support strategic hierarchy rather than only individual-unit logic:

```text
Civilization
├── Strategic Command
├── Regional Command
├── Army Group
├── Division
├── Battalion
├── Squad
└── Individual Unit
```

Simulation LOD must allow distant formations to use lower-frequency aggregate simulation while nearby units can resolve into higher-detail behavior.

## General unit families

Use reusable unit categories rather than hard-coded model-specific units:

- infantry
- armored/heavy units
- artillery
- reconnaissance
- engineers
- cyber units
- autonomous drones
- logistics units
- command units
- electronic warfare
- air systems

Faction capability profiles determine which combinations are economically and strategically rational.

## No fixed rock-paper-scissors

Counters should arise from systems and context.

Examples:

- Mass can overwhelm elite forces in open terrain.
- Intelligence plus chokepoints plus artillery can reverse numerical disadvantage.
- Automation can efficiently suppress mass attacks.
- Cyberwarfare can compromise highly networked automation.
- Simpler forces can sometimes be less vulnerable to sophisticated cyberattack because fewer critical systems are networked.

## Logistics

Track meaningful supply constraints such as:

- ammunition
- power
- repair
- compute availability
- communications
- replacement components
- fuel where applicable
- data connectivity
- supply routes

An army can lose because its logistics collapse even if its direct combat statistics are superior.

## Local battlefield knowledge

No faction receives omniscient map knowledge.

Information comes from:

- scouts
- drones
- satellites/sensors where available
- allies
- intercepted communication
- direct observation
- historical knowledge

Maintain **ground truth** separately from **faction belief state**.

## Civilization structure

Each faction originates from a **Model Core** around which infrastructure develops:

```text
Model Core
├── Compute Centers
├── Energy Infrastructure
├── Data Centers
├── Factories
├── Communications
├── Research Facilities
├── Defensive Systems
├── Process / Population Capacity
├── Logistics
└── Military Infrastructure
```

Architecture should visually express capability profile rather than simply display company logos.

Examples:

- high efficiency → vast mass-production infrastructure
- high intelligence → compact, deliberate defensive and command architecture
- high coding capability → robotics, automation, dense machine infrastructure
- high speed → distributed rapid-response networks and transport

## Alliances and diplomacy

Factions can:

- ally
- trade
- share intelligence
- coordinate military operations
- form temporary coalitions
- betray treaties
- become client states
- split into successor factions
- reunify

Alliance logic must be systemic, based on strategic interests, threats, history, resources, ideology/doctrine metadata, and balance of power rather than scripted model-company relationships.

## Model succession and persistent story

A new model does not erase history.

A successor can inherit:

- territory
- infrastructure
- stockpiles
- debt/obligations
- allies
- enemies
- active wars
- treaties
- historical reputation
- previous battle damage

Its new capability profile can then alter how the inherited empire behaves.

A model release may alternatively create a new branch or faction if the user chooses.

## Manual model update workflow

The owner must be able to add a new model without touching simulation code.

Expected workflow:

1. add/replace an image
2. create or edit model data
3. enter measured/public metrics if available
4. mark unknown values as unknown instead of fabricating them
5. optionally enter clearly marked inferred/fictional balancing values
6. run validation
7. launch game
8. choose succession, branch, alliance, or independent-entry behavior

## Benchmark versioning

Every measured metric should support metadata similar to:

```ts
interface MetricRecord {
  metric: string;
  value: number | null;
  benchmark?: string;
  benchmarkVersion?: string;
  measuredAt?: string;
  source?: string;
  confidence: 'high' | 'medium' | 'low' | 'inferred' | 'fictional';
}
```

Do not overwrite historical benchmark values. Preserve snapshots.

## Capability mapping

Derived gameplay capabilities should use configurable bounded transforms rather than naïve direct scaling.

Possible tools:

- percentile normalization
- logistic curves
- diminishing returns
- thresholds where justified
- bounded nonlinear cost curves

A small benchmark difference must not accidentally become a 5× battlefield advantage unless the mapping explicitly and defensibly intends that outcome.

## Operational compute efficiency

Create a derived concept that relates useful capability to operational cost. Cheapness alone must not guarantee military superiority.

Conceptually:

```text
useful capability delivered
──────────────────────────
operational resource cost
```

## World design

The battlefield is a believable continuous 3D world, not a decorative chessboard.

Terrain can include:

- mountains
- valleys
- rivers
- forests
- open plains
- settlements / cities
- industrial regions
- transportation networks
- resource fields
- communications infrastructure

Terrain must materially alter tactics and doctrine.

Territory may use hidden logical regions/provinces while the rendered terrain remains visually continuous.

## Three game modes sharing one database

### War Mode

Full RTS simulation with conflict, expansion, economy, alliances, and persistent history.

### Observatory Mode

A 3D capability visualization using the same model registry. Selectable dimensions can include intelligence, coding, cost, speed, latency, context, reliability, agentic capability, openness, and multimodal ability.

### History Mode

Replay model releases, capability changes, wars, alliances, successions, and benchmark snapshots through time.

These are views over one underlying world/model system, not three separate applications.

## 3D capability space and Pareto frontier

Observatory Mode should support configurable X/Y/Z metrics and smooth animated repositioning.

Calculate Pareto frontiers dynamically for compatible metrics and visualize them as readable 3D lines/surfaces without distorting the source data.

## Player roles

Support several styles over time:

- direct RTS commander
- strategic commander using delegated orders
- observer watching autonomous conflict
- historical observer
- sandbox experimenter

## Scenario / experiment system

Allow controlled battles with different model profiles and conditions.

Variables can include:

- terrain
- starting resources
- force size
- network access
- visibility
- supply conditions
- command latency
- cyber exposure

Repeated seeded runs should be possible so outcomes can be compared.

## Balance philosophy

Do not artificially force equal faction strength.

Outcome should emerge from interactions such as:

```text
capability
× economy
× terrain
× information
× logistics
× strategy
× technology
× diplomacy
× player decisions
```

## Data confidence

Unknown data must remain visibly unknown.

Measured, inferred, and fictional values require distinct metadata and UI treatment.

## Rendering / simulation architecture

Simulation logic should remain independent from Three.js rendering wherever practical.

Use Web Workers for expensive simulation components when appropriate.

Conceptually:

```text
Main thread
├── Three.js rendering
├── UI
└── input

Workers / simulation
├── strategic planning
├── economy
├── battles
├── logistics
├── pathfinding
└── world-state aggregation
```

## Debug / explainability

Every persistent simulation entity needs a stable ID.

Examples:

```text
CIV-OPENAI-SOL
ARMY-SOL-003
DIV-SOL-0042
FACT-SOL-00931
UNIT-SOL-INF-883102
```

The inspector should expose useful structured state such as:

- entity ID
- faction/model
- raw metrics
- derived capabilities
- current orders
- target
- faction belief state
- actual state when debug privileges allow
- supply
- compute use
- bandwidth load
- memory use
- simulation LOD

For important autonomous decisions, record structured rationale metadata such as inputs, confidence, chosen action, rejected alternatives, and relevant modifiers. Do not depend on hidden chain-of-thought.

## Replay / historical reproducibility

A replay should record enough metadata to reproduce a simulation despite future game/data changes, including:

- world seed
- random seed
- game/simulation version
- model database snapshot/version
- benchmark snapshot
- initial resources
- player actions

## First proving scenario

The first substantial playable scenario should contain several contrasting profiles:

- cheap/fast mass civilization
- expensive strategically sophisticated civilization
- engineering/cyber-focused civilization
- balanced generalist

Terrain should include at least:

- open ground
- a chokepoint
- an urban/industrial zone
- a resource region
- communications infrastructure

The scenario succeeds when the different capability profiles visibly create different doctrines without name-specific behavior hacks.

## Success criterion

A viewer who does not know the benchmark numbers should be able to watch a battle and infer things such as:

- “That civilization wins by overwhelming opponents with numbers.”
- “That one keeps baiting enemies into traps.”
- “That faction relies heavily on automation.”
- “That empire reacts incredibly fast but makes shallower plans.”

Then the game can explain which source characteristics produced those tendencies.

## Engineering quality authority

All implementation is subordinate to [`UNIVERSAL_THREEJS_HIGH_FIDELITY_STANDARD.md`](UNIVERSAL_THREEJS_HIGH_FIDELITY_STANDARD.md). Do not reduce visual, physical, interaction, mobile, or world quality because the project is browser-based. Engineer around bottlenecks using LOD, workers, streaming, instancing, compression, pooling, spatial partitioning, and simulation scaling.
