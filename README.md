# Perspective Component Module (Project Guide)

This repository implements an Ignition Perspective module with custom components across multiple scopes (`common`, `gateway`, `designer`, `web`).

This README centralizes:

- How to build (local and Docker).
- Current project standards.
- Agent skills available in this repository.
- End-to-end flow for creating new components.

## 1) High-level structure

```text
perspective-component/
├── common/      # Component descriptors + schemas
├── gateway/     # Runtime registration in Gateway
├── designer/    # Registration in Designer
├── web/         # Web client (packages/client + sandbox)
├── run_docker_build.sh
├── run_docker_build.bat
└── docker-compose.yml
```

### Scopes and responsibilities

- `common`: shared contract (Java descriptor + JSON schema).
- `gateway`: runtime component registration.
- `designer`: designer/palette component registration.
- `web/packages/client`: TypeScript/React client implementation.
- `web/sandbox`: visual prototyping and validation before migration.

### Current minimal component set

This repository is intentionally cleaned to keep one runtime example component:

- `ToastSileo` (registered in gateway/designer/client)

Resource exceptions kept on purpose:

- `common/src/main/resources/example/example.props.json`
- `common/src/main/resources/toastsileo/toastsileo.props.json`

## 2) Build the project

## Option A: Standard build (recommended)

From project root:

```bash
# Linux/macOS
./gradlew build

# Windows
gradlew.bat build
```

## Option B: Docker build (new workflow)

This repository includes scripts and compose config to build inside a Java 17 container.

### Requirements

- Docker installed.
- Docker Compose available (`docker compose`).

### Run build script

```bash
# Linux/macOS
./run_docker_build.sh

# Windows
run_docker_build.bat
```

Internally this runs:

- `docker compose up builder`
- `builder` service from `docker-compose.yml` with image `eclipse-temurin:17-jdk`
- build command: `./gradlew build --no-daemon`

### Expected result

After completion, module artifacts are generated in `build/` (for example unsigned/signed `.modl` depending on signing setup).

## 3) Project standards

## 3.1 Sandbox standard (UI source of truth)

Defined in: `web/sandbox/README.md`

Main rules:

1. Each component lives in its own folder:

```text
web/sandbox/src/components/<ComponentName>/
  custom/
  controls/
  reference/
  index.ts
```

2. `set/on/handle` convention applies **only to component prop names** (not internal function names):

- `set*`: write/change intent.
- `on*`: event/callback intent.
- `handle*`: contract orchestration/support when needed.

3. In `reference/`, `on*` props are treated as Ignition event contract.

4. Ignition JSON schema props must be derived from the React component props interface, excluding `on*` and `set*` props.

5. JSON schema property types must match React interface prop types (or documented, explicit mapping when exact parity is not possible).

6. Exposed `on*` events must define event payload schemas and keep runtime payload parity:

- Event schema file pattern: `common/src/main/resources/<meta-name>/<meta-name>.event.props.json`
- Java descriptor registration: `ComponentEventDescriptor("onEventName", ..., EVENT_SCHEMA)`
- Runtime emitter: `props.componentEvents.fireComponentEvent("onEventName", payload)`

Designer receives event payload props from these event schemas, not from regular component config schema.

## 3.2 Ignition integration rules

- `COMPONENT_ID` (Java) and `COMPONENT_TYPE` (TS) must match exactly.
- `tree.read("...")` keys must match schema property keys.
- Register and remove components in both Gateway and Designer.
- Keep component root element stable and preserve `emit(...)` behavior (do not override root `ref`).

## 4) Skills available in this repository

Skills are located in `.agents/skills/`.

## 4.1 `create-ignition-component`

Path: `.agents/skills/create-ignition-component/SKILL.md`

Use when you need to:

- Create/register a full component across `common + gateway + designer + client`.
- Add schema, descriptor, and palette registration.
- Start from sandbox prototype and migrate to `web/packages/client/typescript/components`.

Includes:

- Exact paths by scope.
- End-to-end workflow.
- Checklist and validation guidance.

## 4.2 `review-sandbox-component-standard`

Path: `.agents/skills/review-sandbox-component-standard/SKILL.md`

Use when you need to:

- Audit whether `web/sandbox/src/components` follows standard.
- Verify `custom/controls/reference` structure.
- Verify `set/on/handle` naming on component props.

Critical rule:

- If non-compliance is found, it must ask first before editing files.

## 5) Complete guide: create a new component

This is the recommended flow to keep technical and visual consistency.

## Step 1: Define component identity

Define from the start:

- Java/TS name: `StatusBadge`
- Meta name: `statusbadge`
- Type ID: `rad.display.statusbadge`

## Step 2: Prototype in sandbox (required)

Create structure:

```text
web/sandbox/src/components/StatusBadge/
  custom/
  controls/
  reference/
  index.ts
```

Goal:

- Validate UX/behavior.
- Freeze component prop contract (`set/on/handle` per standard).

## Step 3: Create JSON schema (common)

Add schema at:

- `common/src/main/resources/statusbadge/statusbadge.props.json`

Schema generation rules:

- Start from the React component props interface (`web/sandbox/src/components/<Name>/custom/types.ts` or equivalent interface in client component).
- Include all regular component configuration props.
- Exclude props starting with `on` and `set`.
- Ensure schema keys and types match client-side reads and interface types.

Quick type mapping guideline:

- `string` -> `string`
- `number` -> `number`
- `boolean` -> `boolean`
- union literals -> `string` with enum constraints when applicable
- arrays -> `array` with typed items
- objects -> `object` with explicit properties

## Step 4: Create Java descriptor (common)

Add descriptor at:

- `common/src/main/java/org/fakester/common/component/display/StatusBadge.java`

Configure:

- `COMPONENT_ID`
- `META_NAME`
- `SCHEMA`
- palette entry
- browser resources

## Step 5: Register in gateway/designer

Update:

- `gateway/src/main/java/org/fakester/gateway/RadGatewayHook.java`
- `designer/src/main/java/org/fakester/designer/RadDesignerHook.java`

Actions:

- register/remove descriptor.
- optional delegates (if applicable).
- register `on*` events with `ComponentEventDescriptor` and event payload schema when component emits events.

## Step 6: Implement in client TypeScript

Create component/meta in:

- `web/packages/client/typescript/components/StatusBadge.tsx`

Export and register in:

- `web/packages/client/typescript/components/index.ts`
- `web/packages/client/typescript/rad-client-components.ts`

If component emits events:

- call `props.componentEvents.fireComponentEvent("onEventName", payload)`
- keep payload keys/types aligned with event payload schema used in Java descriptor.

## Step 7: Validate

- Full build: `./gradlew build` (or Docker build script).
- If only client/sandbox changed, run TypeScript/client checks from the `web` subproject.

## 6) Quick pre-PR checklist

- [ ] Sandbox structure is correct per component.
- [ ] `set/on/handle` prop contract is consistent.
- [ ] Ignition schema props come from React component props interface.
- [ ] `on*` and `set*` props are excluded from schema.
- [ ] JSON schema aligned with `tree.read` keys.
- [ ] JSON schema prop types aligned with React interface types (or documented mapping).
- [ ] Event payload schema added for each emitted `on*` event.
- [ ] `fireComponentEvent(...)` payload shape matches event payload schema.
- [ ] `COMPONENT_ID` == `COMPONENT_TYPE`.
- [ ] Component registered in gateway and designer.
- [ ] Client export and registration completed.
- [ ] Build passes (local or Docker).

## 7) Additional documentation

- `web/README.md`: web subproject details.
- `web/sandbox/README.md`: sandbox and prop naming standard.
- `docs/ignition-schemas/ignition-schema-catalog.md`: Ignition URN schema catalog and regeneration notes.
- `docs/ignition-schemas/ignition-schema-attributes-reference.md`: concise required/optional/default attribute reference.
- `.agents/skills/create-ignition-component/SKILL.md`
- `.agents/skills/review-sandbox-component-standard/SKILL.md`

---

If you are starting a new component, recommended sequence:

1. Sandbox prototype.
2. Audit with `review-sandbox-component-standard`.
3. Full implementation with `create-ignition-component`.
