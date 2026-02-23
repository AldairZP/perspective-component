---
name: review-sandbox-component-standard
description: Validate whether a component under web/sandbox/src/components follows the project sandbox standard (component folder with custom/controls/reference, prop naming rules set/on/handle for component props, interface-to-Ignition-schema prop/type alignment, and event payload schema parity for on* events). Use when the user asks to review, audit, check, or enforce sandbox component structure/standard. If non-compliant, always ask the user whether to apply fixes before editing files.
---

# review-sandbox-component-standard

Validate sandbox components against the standard defined in `web/sandbox/README.md`.

## Scope

Review only sandbox component structure and contract naming:

- Root: `web/sandbox/src/components`
- Standard source: `web/sandbox/README.md`

Do not modify Java, gateway, designer, or client package files unless explicitly requested.

## Required checks

For each component folder inside `web/sandbox/src/components`:

1. Component folder exists at first level (e.g., `ToastSileo/`).
2. Required subfolders exist inside component folder:
   - `custom/`
   - `controls/`
   - `reference/`
3. Component-level barrel exists: `<ComponentName>/index.ts`.
4. Root barrel `web/sandbox/src/components/index.ts` exports component entries.
5. `custom/` contains implementation files (`*View.tsx`, `types.ts`, styles/helpers as needed).
6. `controls/` contains test/control UI (`*Controls.tsx`).
7. `reference/` contains reference contract usage (`*Reference.tsx`).

## Interface -> Ignition schema checks

Use React component props interfaces as source of truth for Ignition schema props.

Check the following:

1. Identify component props interface in sandbox `custom/types.ts` (or nearest equivalent props interface).
2. Identify Ignition schema in `common/src/main/resources/<meta-name>/<meta-name>.props.json` when available.
3. Verify all interface props **except** those starting with `on` and `set` are represented in schema.
4. Verify props starting with `on` and `set` are not treated as regular persisted schema props.
5. Verify schema types match interface prop types (or explicit documented mapping).

If schema is not present yet (sandbox-only stage), produce a proposed schema prop/type table based on the interface and mark it as `Pending schema creation`.

## `on*` event payload schema checks

If component exposes or emits `on*` events:

1. Verify event payload schema exists in `common/src/main/resources/<meta-name>/<meta-name>.event.props.json` (or equivalent event schema path).
2. Verify Java descriptor registers event(s) with `ComponentEventDescriptor` and the payload schema.
3. Verify client event emission via `fireComponentEvent("onEventName", payload)`.
4. Verify emitted payload keys/types match the registered event payload schema.

If event schema is not present yet (sandbox-only stage), produce a proposed event payload schema table and mark it as `Pending event schema creation`.

## Prop naming checks

Apply naming checks only to **component props/contracts**, not internal helper function names.

- `set*` props: write/change intent.
- `on*` props: event/callback intent.
- `handle*` props: orchestration/helper contract only when explicitly needed.

In `reference/`, treat `on*` props as Ignition event-facing contract.

For schema validation, `on*` and `set*` are excluded from regular schema prop generation.

## Output format

Return a concise audit report with:

1. Compliance summary (`Compliant` or `Needs changes`).
2. File/folder findings.
3. Interface->schema findings (missing props, excluded props, type mismatches).
4. Event payload findings (`on*` events, schema presence, payload parity).
5. Exact proposed fixes.
6. Risk/impact note (usually low, structure-only).

## Mandatory confirmation gate

If any non-compliance is found:

- Do **not** edit files immediately.
- Ask the user if they want auto-fix now.
- Wait for explicit confirmation before applying changes.

Use this question style:

- "Found X issues against sandbox standard. Do you want me to apply the fixes now?"

If user declines, provide manual fix steps only.

## Fix strategy (after user confirms)

1. Make minimal structural edits.
2. Preserve component behavior and logic.
3. Update only imports/exports required by moved files.
4. Remove obsolete empty folders.
5. Validate with diagnostics (`get_errors`) for touched files.

## Guardrails

- Keep edits surgical; avoid unrelated refactors.
- Do not enforce naming on internal functions unless user explicitly asks.
- Prefer consistency with existing sandbox patterns already in the repo.
- Do not infer schema props from arbitrary implementation details; derive from typed component prop interfaces.
- Do not treat event payload schemas as optional when `on*` events are emitted.
