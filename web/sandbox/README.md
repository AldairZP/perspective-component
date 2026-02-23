# Sandbox Standard for Ignition Components

This sandbox is the visual prototyping environment for components before moving them to `web/packages/client/typescript/components`.

## Goal

- Define a scalable structure and naming standard for multiple components.
- Keep consistency between sandbox and final client/typescript implementation.
- Avoid ambiguity in component prop names for events and actions.

## Required structure

Each component must live in its own folder under `src/components`.

```text
src/components/
  ComponentName/
    custom/
      index.ts
      ComponentNameView.tsx
      types.ts
      *.module.css
      helpers.tsx (optional)
    controls/
      ComponentNameControls.tsx
    reference/
      ComponentNameReference.tsx
    index.ts
  index.ts
```

### Folder purpose

- `custom/`: real component implementation (React + types + styles).
- `controls/`: manual test panel for props and behavior.
- `reference/`: reference usage of Ignition props/event contract.

## Component prop naming standard

This convention applies **only to component prop names** (schema/contract), not internal helper function names.

### 1) `set*` props

Props that represent write/change intent toward Ignition.

- ✅ `setState`, `setSelectedPoint`
- ❌ do not use `set*` for props that actually represent events

### 2) `on*` props

Event/callback props in the component contract.

- ✅ `onPointCreated`, `onPointReleased`, `onPointDeleted`
- ✅ in `reference/`, a prop starting with `on` is interpreted as an Ignition event

### 3) `handle*` props

Auxiliary/orchestration props when explicitly needed by the contract (less common).

- ✅ `handleAction` (if it is explicitly part of the contract)
- ❌ do not use `handle*` for pure event props (use `on*`)

## Ignition JSON props source of truth

For component configuration props, use the React component props interface as the source of truth.

Rules:

- Ignition JSON schema props must be derived from the component props interface (`custom/types.ts` or equivalent interface in the component).
- Exclude props starting with `on` and `set` from the JSON schema.
- `on*` and `set*` are contract/event/write semantics, not regular persisted configuration props.
- When generating or reviewing schema, verify type parity against the React interface for all included props.

### Type mapping guideline (React -> Ignition JSON)

- `string` -> `string`
- `number` -> `number`
- `boolean` -> `boolean`
- string union (`"a" | "b"`) -> `string` + enum constraints in schema (when applicable)
- arrays -> `array` with item typing
- object/interface -> `object` with explicit properties

If a type cannot be represented exactly, document the mapping decision and keep `getPropsReducer` defaults aligned with schema defaults.

## Event payload props (Designer-facing)

In addition to regular component props, events also have payload props that are exposed in Ignition Designer.

Event payload contract rules:

- Define event payload schema in `common/src/main/resources/<meta-name>/<meta-name>.event.props.json` (or event-specific equivalent if needed).
- Register events in the Java descriptor with `ComponentEventDescriptor` and the payload schema.
- Fire the event from client code using `props.componentEvents.fireComponentEvent("onEventName", payload)`.
- Ensure payload keys and types sent by `fireComponentEvent(...)` match the event payload schema exactly.

Important distinction:

- `on*` and `set*` props are excluded from regular component configuration schema generation.
- `on*` events still require explicit event payload schemas for Designer/runtime event configuration.

## Golden rule for future components

- If a prop represents write/change intent: `set*`.
- If a prop represents event/callback intent: `on*`.
- If a prop represents orchestration/support in the contract: `handle*`.
- Internal function names are free and not enforced by this standard.
- Ignition JSON props are all component interface props **except** `on*` and `set*`, with validated type mapping.

## Recommended flow: Sandbox -> Client

1. Create component in `src/components/ComponentName/` (`custom + controls + reference`).
2. Validate behavior visually in sandbox.
3. Migrate to `web/packages/client/typescript/components/ComponentName` keeping structure and names.
4. Export in `web/packages/client/typescript/components/index.ts`.
5. Register meta in `web/packages/client/typescript/rad-client-components.ts`.

## Checklist for new component PRs

- Component folder structure is applied.
- `set/on/handle` naming in props follows this standard.
- Ignition JSON schema props were generated from the React component props interface.
- `on*` and `set*` props are excluded from JSON schema props.
- JSON prop types match React interface prop types (or documented mapping).
- Event payload schema exists for each exposed `on*` event.
- Event payload keys/types in `fireComponentEvent(...)` match event payload schema.
- `reference` reflects Ignition event/prop contract.
- `controls` allows manual testing for key props.
- Export is correctly added in `src/components/index.ts` (sandbox) and then in client/typescript.
