# Universal Three.js High-Fidelity Project Prompt

> **MANDATORY PROJECT STANDARD**
>
> Every AI agent, contributor, and implementation pass must read this document before changing Frontier Empires. This standard is authoritative for visual fidelity, object construction, interaction, physics, mobile support, performance, validation, and deployment. Do not treat Three.js or browser deployment as permission to reduce the intended quality.

Build this project as a production-quality Three.js experience intended to reach the visual, physical, and interaction fidelity normally associated with dedicated game engines while remaining native to the web.

Do not interpret “Three.js” or “browser-based” as justification for primitive geometry, placeholder environments, simplified interactions, static decorative assets, low-detail materials, or objects that only visually resemble what they represent.

The target is a believable interactive world in which objects look correct, are constructed correctly, behave correctly, and can interact with other systems in ways consistent with their real-world function.

## Mobile and Input

Make the project mobile friendly from the beginning rather than adapting desktop controls afterward.

For player movement on mobile:

- Use an invisible analog movement region on the left side of the screen.
- The analog control should only become visually apparent while the player is touching/using that region.
- Use the right side of the screen for camera/look controls where appropriate.
- Prevent control conflicts with UI elements.
- Support multi-touch correctly.
- Scale controls and interaction zones according to screen dimensions and device pixel ratio.
- Maintain desktop keyboard/mouse controls as an additional input method where applicable.
- Do not reduce world fidelity merely because mobile support exists. Optimize through appropriate rendering and asset pipelines instead.

---

## CORE REALISM STANDARD

**Increase geometric fidelity. Improve silhouette readability. Add secondary and tertiary construction details. Ensure every component appears mechanically or architecturally assembled rather than booleaned together. Calibrate PBR materials with realistic roughness variation, edge wear, decals, and anti-tiling. Validate real-world proportions and maintain consistent texel density.**

This requirement applies to every important visible asset.

Do not make an asset merely recognizable.

Make it believable.

Use three levels of visual construction:

### Primary forms

The major silhouette and mass of the object.

Examples:

- vehicle body
- building
- spaceship hull
- mountain
- machine enclosure
- tree trunk/crown
- weapon body

### Secondary forms

Components that explain how the primary form functions.

Examples:

- doors
- windows
- wheel wells
- suspension
- bumpers
- roof assemblies
- wings
- engine housings
- vents
- structural beams
- stairs
- control surfaces
- panels
- handles
- pipes

### Tertiary forms

Small details establishing construction and scale.

Examples:

- bolts
- seams
- hinges
- welds
- brackets
- fasteners
- cables
- hydraulic lines
- wiring
- vents
- gaskets
- trim
- weather stripping
- warning labels
- decals
- latches
- drain holes
- flashing
- fascia
- gutters
- rivets
- access panels

Do not fake all tertiary information with textures when meaningful geometry would affect silhouette, movement, shadows, interaction, or mechanical understanding.

---

## REAL OBJECT → DIGITAL OBJECT PIPELINE

For any asset based on something that exists in reality, research how the real object is constructed.

Use reliable open information such as:

- engineering documentation
- manufacturer specifications
- technical manuals
- government datasets
- NASA datasets
- public engineering drawings
- patents where appropriate
- architectural references
- scientific papers
- GIS information
- public-domain imagery
- dimensional drawings
- mechanical diagrams
- teardown information
- open-source models
- CC0 assets
- public-domain datasets

Use the actual measurements whenever reasonably obtainable.

Do not eyeball dimensions when authoritative dimensions are available.

Translate real measurements into a consistent Three.js world-unit convention.

Prefer:

**1 Three.js world unit = 1 meter**

unless the project requires another clearly documented scale.

Examples:

If a real vehicle is:

- 4.8 m long
- 1.9 m wide
- 1.85 m tall
- 2.9 m wheelbase

build around those proportions.

If a doorway is approximately 2.03 m tall, do not arbitrarily make it 3 m because it looks convenient.

If a wheel diameter is known, use it to derive suspension height, axle position, wheel arch geometry, player scale, and collision geometry.

Measurements should propagate through the design.

The goal is not merely copying dimensions.

The goal is allowing real mathematics to govern the virtual object’s structure.

If exact dimensions cannot be obtained, derive reasonable values from known dimensions and clearly document which values are measured versus inferred.

---

## OBJECTS MUST BE SYSTEMS, NOT MESHES

This is a critical requirement.

Do not represent an interactive object as one monolithic mesh when the real object consists of functional components.

A vehicle should not conceptually be:

```text
vehicle.glb
```

It should behave more like:

```text
Vehicle
├── chassis
├── body
├── drivetrain
├── steering
├── suspension
│   ├── front-left
│   ├── front-right
│   ├── rear-left
│   └── rear-right
├── wheels
├── doors
├── seats
├── dashboard
├── lighting
├── cargo
├── attachment points
├── tow receiver
├── collision bodies
├── enter/exit points
├── audio emitters
└── interaction metadata
```

The exact hierarchy should depend on the object.

A building should know which components are:

- doors
- windows
- floors
- walls
- stairs
- elevators
- rooms
- lights
- electrical equipment
- ventilation
- furniture
- entrances
- exits

A machine should know which pieces are:

- motors
- gears
- shafts
- actuators
- conveyors
- sensors
- control panels
- bearings
- housings

A spacecraft should know which pieces are:

- engines
- thrusters
- landing gear
- docking ports
- cargo interfaces
- doors
- airlocks
- control surfaces
- sensors
- reactors
- tanks
- weapon mounts
- internal compartments

Preserve useful semantic node names inside GLTF/GLB hierarchies whenever possible.

---

## PHYSICAL VOCABULARY

Every important object should reproduce not just its appearance but its physical vocabulary.

Ask:

- What parts move?
- Around what pivot do they move?
- What limits their motion?
- What attaches to them?
- What can detach?
- What can be carried?
- What can carry something else?
- What can be opened?
- What can be entered?
- What can be driven?
- What can be operated?
- What can contain something?
- What can tow something?
- What can be towed?
- What can break?
- What can rotate?
- What can slide?
- What can fold?
- What can extend?
- What can retract?
- What physical state can this object occupy?

Create those capabilities where appropriate.

Examples:

A door requires:

- hinge pivot
- rotation limits
- open/closed state
- collision behavior
- interaction point
- animation or physically constrained movement

A trailer ramp requires:

- hinge
- pivot
- open/closed states
- latch
- collision
- drivable surface when deployed

A wheel requires:

- axle
- rotation
- steering relationship where applicable
- suspension relationship
- physical radius
- contact behavior

Do not animate an object around an arbitrary center if the real object rotates around a hinge, bearing, axle, ball joint, rail, or mechanical linkage.

---

## INTERACTION GRAPH

Design objects so their systems can compose with other systems.

The goal is to enable interaction chains such as:

```text
Player
↓ mounts
Bike
↓ attaches to
Vehicle Rack
↓ belongs to
Vehicle
↓ connects through hitch
Trailer
↓ carries
ATV
```

These interactions should not require every possible combination to be individually hard-coded.

Develop reusable interaction interfaces.

Examples:

- Rideable
- Driveable
- Enterable
- Openable
- Carryable
- Attachable
- Towable
- TowReceiver
- CargoCarrier
- Seat
- Socket
- Connector
- Container
- PowerSource
- PowerConsumer
- FuelConsumer
- Dockable
- Repairable
- Damageable
- Interactable

Use capability-based design, ECS architecture, component architecture, or another maintainable equivalent where useful.

An object may implement multiple capabilities simultaneously.

Example:

A bicycle can be:

- Rideable
- Carryable
- Attachable
- Damageable

A Jeep can be:

- Driveable
- Enterable
- CargoCarrier
- TowReceiver
- BikeCarrier
- Damageable

This should permit emergent combinations instead of requiring bespoke scripting for every interaction.

---

## ATTACHMENT SOCKET SYSTEM

Create standardized named attachment points for objects where appropriate.

Examples:

- tow_hitch
- tow_coupler
- bike_mount
- cargo_socket
- seat_driver
- seat_passenger
- weapon_mount
- docking_port
- fuel_connector
- power_connector
- trailer_axle
- door_hinge
- wheel_hub

Each socket should be able to define:

- transform
- orientation
- compatible attachment classes
- weight limits if relevant
- locking state
- interaction state
- collision rules
- detach conditions

When two compatible interfaces connect, establish their physical relationship correctly.

Avoid crude position snapping without orientation, constraint, collision, and state management.

---

## PHYSICS FIDELITY

Use an appropriate physics solution when physical interaction warrants it.

Physics objects should have plausible:

- mass
- center of mass
- inertia
- friction
- restitution
- damping
- torque
- acceleration
- suspension
- wheel radius
- steering angle
- traction
- drag
- gravity response

For vehicles, account for systems such as:

- suspension travel
- spring rate
- damping
- steering geometry
- tire contact
- vehicle mass
- center of gravity
- torque application
- braking
- slope behavior

Do not make a heavy truck behave like a floating box.

Do not make a bicycle behave like a four-wheel vehicle.

Do not make a trailer permanently rigid relative to its tow vehicle.

Where appropriate use physical joints/constraints for:

- hinges
- ball joints
- sliders
- axles
- suspension
- towing
- doors
- ramps
- mechanical linkages

Visually animated motion and physical collision states must remain synchronized.

---

## CHARACTER FIDELITY

Characters should be treated with the same quality standard as vehicles and environments.

Avoid placeholder-looking humanoids when the project aims for realism.

Important characters should have:

- believable human proportions
- anatomically reasonable joint placement
- proper skeletal hierarchy
- locomotion animations
- transition blending
- foot placement
- slope adaptation where practical
- entering/exiting animations or procedural transitions
- hand placement for controls
- seated poses appropriate to each vehicle
- appropriate scale relative to surrounding objects

Avoid visible foot sliding and obvious animation snapping.

Use inverse kinematics where valuable.

---

## ENTER / EXIT / POSSESSION SYSTEM

For controllable vehicles and machines, create generalized possession logic.

The player should be able to:

1. approach the object
2. detect a valid interaction point
3. interact
4. move or animate into the operating position
5. transfer input authority to the object
6. control it
7. stop
8. exit at an appropriate location
9. regain character control

Do not permanently bake player control into one vehicle type.

Support multiple independently controllable classes through a common architecture.

---

## MATERIAL REALISM

Do not simply assign flat colors.

Use physically based materials.

Where appropriate use:

- albedo/base color
- normal maps
- roughness
- metalness
- ambient occlusion
- clearcoat
- clearcoat roughness
- transmission
- opacity
- emissive maps
- decals
- detail normals
- dirt masks
- wear masks

Materials should represent actual material classes:

- painted steel
- raw steel
- aluminum
- rubber
- glass
- plastic
- leather
- fabric
- concrete
- asphalt
- soil
- wood
- vegetation
- ceramic
- carbon composite

Different materials should respond differently to light.

Avoid universally glossy surfaces.

Avoid perfectly uniform roughness.

Break repetition through:

- material variation
- decals
- macro variation
- micro variation
- vertex variation
- blended materials
- procedural masks

Do not over-weather everything.

Wear should appear where physical usage would cause wear.

---

## UV AND TEXEL DENSITY

Maintain consistent texel density.

Do not allow one part of an asset to appear extremely sharp while another adjacent surface appears visibly blurry without a physical reason.

Avoid:

- stretched UVs
- visible texture seams
- obvious repetitive tiling
- inconsistent resolution
- texture swimming

Use reusable tiling surfaces for large environments while layering macro variation and decals to remove repetition.

---

## ENVIRONMENTAL REALISM

Environment quality must match asset quality.

Do not place a realistic vehicle inside simplistic game terrain.

Construct landscapes using multiple spatial scales.

### Macro scale

- mountains
- valleys
- watersheds
- coastlines
- planetary curvature where relevant
- large geological formations

### Meso scale

- roads
- fields
- forests
- drainage systems
- erosion
- rock formations
- embankments
- road cuts
- settlements

### Micro scale

- grass
- stones
- dirt
- tire tracks
- cracks
- debris
- leaves
- road markings
- surface displacement
- small vegetation
- material transitions

Terrain should not resemble a smooth heightmap covered with one repeating texture.

Where public geospatial data exists, consider:

- DEM elevation datasets
- GIS information
- satellite data
- OpenStreetMap data
- geological information
- land-cover datasets

Use legal/open datasets appropriate to the project.

---

## ROADS

Roads must follow terrain believably.

Account for:

- road width
- shoulders
- banking/camber
- slope
- intersections
- drainage
- embankments
- cuts
- surface markings
- transitions between asphalt, dirt, gravel, and surrounding terrain

Vehicles should physically respond to road geometry rather than traveling over invisible flat surfaces.

---

## VEGETATION

Avoid uniform randomly scattered trees.

Vegetation distribution should respond to environmental conditions.

Where relevant consider:

- elevation
- moisture
- slope
- climate
- biome
- soil
- proximity to water
- human land use

Use instancing and LOD systems to permit dense environments without excessive draw calls.

---

## LIGHTING AND ATMOSPHERE

Lighting is part of realism and must not be treated as an afterthought.

Use appropriate:

- physically plausible light intensities
- environment lighting
- HDR environment maps when appropriate
- shadows
- ambient lighting
- atmospheric scattering
- fog/haze
- exposure
- tone mapping
- time-of-day effects

Large landscapes require atmospheric depth.

Distant mountains should not visually behave like objects five meters away.

---

## ASSET PIPELINE

Prefer production asset formats such as GLTF/GLB.

Where appropriate use:

- glTF
- Meshopt compression
- Draco compression where beneficial
- KTX2/Basis compressed textures
- mipmaps
- texture atlases
- instanced meshes
- merged static geometry
- shared materials

Do not destroy useful semantic hierarchy merely to reduce draw calls.

Optimize intelligently.

---

## PERFORMANCE WITHOUT DESTROYING FIDELITY

The solution to browser performance is not automatically making everything primitive.

Use:

- LOD systems
- frustum culling
- occlusion strategies where practical
- instancing
- geometry compression
- texture compression
- physics sleeping
- asynchronous loading
- asset streaming
- object pooling
- spatial partitioning
- chunking
- reduced distant simulation
- adaptive quality settings

Spend computational resources where the player is looking and interacting.

High-fidelity nearby objects can coexist with aggressively optimized distant objects.

Create performance budgets for:

- triangles
- draw calls
- texture memory
- active rigid bodies
- shadow casters
- particles
- animation rigs
- networked entities if applicable

Profile instead of guessing.

---

## SIMULATION LEVEL OF DETAIL

Not every distant object needs full simulation.

Separate:

- Visual LOD
- Physics LOD
- AI LOD
- Animation LOD
- Simulation LOD

Example:

A vehicle 2 km away may require:

- low-detail mesh
- simplified movement
- no detailed suspension simulation
- reduced animation
- low-frequency AI updates

The same vehicle beside the player can transition into full simulation.

This allows a complex world without abandoning detail.

---

## COLLISION STANDARD

Collision geometry must correspond to visible geometry closely enough that interaction feels believable.

Avoid:

- invisible walls
- floating collision planes
- oversized collision boxes
- collisions that stop the player before touching an object
- stairs that visually and physically disagree
- vehicles driving above terrain
- characters clipping through doors

Use simplified collision geometry where appropriate, but validate it against the rendered mesh.

Build automated collision validation where practical.

---

## DEBUG / WORLD IDENTIFICATION SYSTEM

Every persistent or important asset must have an Asset ID.

Examples:

- VEH-JEEP-00492
- BLDG-HANGAR-0122
- TREE-PINE-883192
- DOOR-HAB-A17-003
- SHIP-CARGO-042

Every meaningful object should expose debug metadata.

For planetary/world-scale projects, maintain:

- longitude
- latitude
- elevation

along with a local coordinate representation.

For smaller environments use appropriate world/grid coordinates.

Create a Debug Layer accessible from development settings.

When enabled, display unobtrusive floating labels or inspection bubbles containing information such as:

- Asset ID
- Asset Type
- World Coordinate
- Latitude
- Longitude
- Elevation
- Chunk ID
- LOD
- Physics State
- Collision ID
- Parent Object
- Current State

The debug layer should allow a player/tester to report:

```text
VEH-JEEP-00492 at coordinate X/Y/Z
```

instead of saying:

```text
the green car near the hill.
```

This system should support rapid AI-assisted debugging.

---

## FLOATING ORIGIN / PLANETARY PRECISION

For extremely large worlds or planetary environments, do not rely indefinitely on a single large floating-point coordinate space.

Implement an appropriate large-world strategy such as:

- floating origin
- origin rebasing
- chunk-relative coordinates
- hierarchical coordinate systems
- geographic coordinates + local coordinates

Maintain stable precision near the player.

Planetary geographic coordinates and render coordinates should be convertible through documented transforms.

---

## AUTOMATED VALIDATION

Do not depend entirely on a human noticing defects.

Create development tools that can detect or flag problems such as:

- overlapping geometry
- floating objects
- underground objects
- invalid asset scale
- incorrect pivots
- missing textures
- missing collisions
- extreme texture resolution
- excessive draw calls
- broken attachment sockets
- invalid physics bodies
- disconnected navigation surfaces
- duplicate IDs
- impossible transforms
- NaN physics values
- objects outside expected world bounds

Where reasonable, have the project produce diagnostic reports.

---

## OPEN SOURCE / CC0 REQUIREMENT

Use CC0, public-domain, permissively licensed, user-owned, or otherwise legally usable assets and information.

Track source/provenance where appropriate.

Use open-source information as a reference for understanding the real object.

This can include real measurements, engineering diagrams, physical properties, scientific information, and construction methods.

For example:

If building a wooden crate, determine:

- board dimensions
- plank arrangement
- fasteners
- framing
- expected wood thickness
- construction method

Then reproduce that construction.

If building a vehicle, research:

- wheelbase
- tire size
- suspension arrangement
- body dimensions
- door placement
- ground clearance
- seating position
- towing interfaces

If building a planet, use available scientific information for:

- radius
- gravity
- rotation
- axial tilt
- atmospheric properties
- geography where applicable
- poles
- orbital properties

Translate the underlying mathematics into the Three.js simulation.

---

## NO DECORATIVE MACHINES

If an object appears functional, strongly prefer making it functional.

A visible door should open where appropriate.

A seat should be occupiable where appropriate.

A wheel should rotate.

A steering wheel should respond to steering.

A trailer ramp should articulate.

A switch should be capable of changing state.

A control panel should correspond to some system.

A docking port should actually support docking if docking is part of the game.

A cargo bay should be able to contain cargo.

A vehicle rack should be able to hold compatible equipment.

Not every tiny object needs interaction, but important functional objects should not merely imitate functionality visually.

---

## GENERAL PHILOSOPHY

The objective is not:

> “Make something that looks approximately like the reference.”

The objective is:

> Understand what the thing is, determine how it is constructed, determine how it behaves, reproduce its important physical relationships mathematically, and then render and simulate that system through Three.js.

When an open technical reference, measurement, scientific dataset, engineering drawing, or real-world specification can answer a question, research it instead of inventing arbitrary values.

When multiple systems can interact in reality, design them so they can interact in the simulation when relevant.

Favor reusable generalized systems over one-off scripted illusions.

The desired progression is:

```text
Primitive
↓
Recognizable model
↓
High-fidelity model
↓
Mechanically correct assembly
↓
Interactive object
↓
Physically simulated object
↓
Composable system
↓
Persistent simulated world
```

The final target is the bottom of that progression.

Objects should have a life beyond their mesh.

The world should feel assembled rather than decorated.

The simulation should explain what the visuals are showing.

The visuals should accurately represent what the simulation contains.

---

## DEPLOYMENT

The completed project will be hosted through Heartbeat Observatory.

Maintain compatibility with a practical modern web deployment pipeline.

Do not compromise the intended final quality merely to simplify development.

When a limitation actually exists, identify the precise bottleneck and solve around it through optimization, streaming, LOD, compression, simulation scaling, or architecture rather than automatically removing the feature.
