---
name: create-ignition-component
description: Create or extend Ignition Perspective components in this module with complete implementation across common, gateway, designer, and web client scopes. Use when the user asks to create/register a component, add a props schema, add a component descriptor, add a component to the palette, or requests Java/TSX examples for gateway/designer files.
---

# create-ignition-component

Make minimal changes and follow existing repository patterns.

## Paths

- Java descriptor: `common/src/main/java/org/fakester/common/component/display/<Name>.java`
- JSON schemas: `common/src/main/resources/<meta-name-lower>/`
- Gateway hook: `gateway/src/main/java/org/fakester/gateway/RadGatewayHook.java`
- Designer hook: `designer/src/main/java/org/fakester/designer/RadDesignerHook.java`
- Client TSX meta/view: `web/packages/client/typescript/components/<Name>.tsx`
- Client export: `web/packages/client/typescript/components/index.ts`
- Client registration: `web/packages/client/typescript/rad-client-components.ts`
- Sandbox standard: `web/sandbox/README.md`
- Sandbox components root: `web/sandbox/src/components/<Name>/`

## Sandbox-first component standard

When creating or iterating UI behavior, prototype in sandbox first, then migrate to client.

Use this required sandbox structure:

```text
web/sandbox/src/components/<Name>/
  custom/
  controls/
  reference/
  index.ts
```

Meaning:

- `custom/`: real React implementation (view, types, styles).
- `controls/`: manual test surface for props and behavior.
- `reference/`: reference contract example for Ignition-oriented props/events.

## Prop naming contract (from sandbox standard)

Apply this convention to **component prop names only** (schema/contract), not internal helper function names.

- `set*` props: represent write/change intent.
- `on*` props: represent event/callback contract.
- `handle*` props: represent orchestration/helper contract only when explicitly needed.

Notes:

- In `reference/`, `on*` props should be treated as Ignition event contract.
- In `custom/`, internal function names are not constrained by this prop naming convention.

## Interface-driven Ignition prop schema rule

When creating Ignition JSON schema props, use the React component prop interface as source of truth.

Source interfaces (in order):

1. `web/sandbox/src/components/<Name>/custom/types.ts`
2. Component props interface used by client component in `web/packages/client/typescript/components/...`

Rules:

- Include regular component configuration props from the interface.
- Exclude interface props starting with `on` and `set`.
- Ensure each included prop has a schema entry with matching type.
- If exact type parity is not possible, document the mapping and keep reducer defaults aligned.

Type mapping guideline:

- `string` -> `string`
- `number` -> `number`
- `boolean` -> `boolean`
- union literals -> `string` + enum constraints when applicable
- arrays -> `array` with item typing
- objects/interfaces -> `object` with explicit properties

## Event payload schema rule (`on*` events)

If the component emits events, define event payload props for Designer/runtime event handling.

Required steps:

1. Create event payload schema in `common/src/main/resources/<meta-name>/<meta-name>.event.props.json`.
2. Register each emitted event in Java descriptor via `ComponentEventDescriptor("onEventName", ..., EVENT_SCHEMA)`.
3. Emit with `props.componentEvents.fireComponentEvent("onEventName", payload)` in client code.
4. Keep payload keys/types emitted at runtime aligned with event payload schema.

Notes:

- `on*` and `set*` are excluded from regular component configuration schema generation.
- `on*` events still require explicit event payload schemas.

## Workflow

1. Define names first: `StatusBadge` / `statusbadge` / `rad.display.statusbadge`.
2. Prototype behavior in sandbox at `web/sandbox/src/components/<Name>/` using `custom/controls/reference`.
3. Keep prop names aligned with `set* / on* / handle*` contract from `web/sandbox/README.md`.
4. Derive schema props from component props interface and exclude `on*` / `set*` props.
5. Create schema: `common/src/main/resources/statusbadge/statusbadge.props.json`.
6. Create descriptor class: `StatusBadge.java`.
7. If component emits events, add event payload schema and event descriptors in common descriptor.
8. Register/remove in Gateway and Designer hooks.
9. Create `StatusBadge.tsx` with `COMPONENT_TYPE === COMPONENT_ID`.
10. If component emits events, wire `fireComponentEvent(...)` with payload shape matching event schema.
11. Export and register `StatusBadgeComponentMeta` on the client.

## Java descriptor skeleton

```java
public class StatusBadge {
    public static final String COMPONENT_ID = "rad.display.statusbadge";
    public static final String META_NAME = "statusbadge";

    public static JsonSchema getSchema(String resourcePath) {
        return JsonSchema.parse(RadComponents.class.getResourceAsStream("/" + META_NAME + "/" + resourcePath));
    }

    public static final JsonSchema SCHEMA = getSchema("statusbadge.props.json");

    public static final ComponentDescriptor DESCRIPTOR = ComponentDescriptorImpl.ComponentBuilder.newBuilder()
            .setPaletteCategory(RadComponents.COMPONENT_CATEGORY)
            .setId(COMPONENT_ID)
            .setModuleId(RadComponents.MODULE_ID)
            .setSchema(SCHEMA)
            .setName("Status Badge")
            .setDefaultMetaName(META_NAME)
            .addPaletteEntry("", "Status Badge", "Simple status badge.", null, null)
            .setResources(RadComponents.BROWSER_RESOURCES)
            .build();
}
```

## Required hook edits

Gateway (`RadGatewayHook.java`):

```java
import org.fakester.common.component.display.StatusBadge;

this.componentRegistry.registerComponent(StatusBadge.DESCRIPTOR);
this.componentRegistry.removeComponent(StatusBadge.COMPONENT_ID);

// Optional delegate
this.modelDelegateRegistry.register(StatusBadge.COMPONENT_ID, StatusBadgeDelegate::new);
this.modelDelegateRegistry.remove(StatusBadge.COMPONENT_ID);
```

Designer (`RadDesignerHook.java`):

```java
import org.fakester.common.component.display.StatusBadge;

registry.registerComponent(StatusBadge.DESCRIPTOR);
registry.removeComponent(StatusBadge.COMPONENT_ID);

// Optional design delegate
this.delegateRegistry.register(StatusBadge.COMPONENT_ID, new StatusBadgeDesignDelegate());
this.delegateRegistry.remove(StatusBadge.COMPONENT_ID);
```

## Client example

```tsx
export const COMPONENT_TYPE = "rad.display.statusbadge";

interface StatusBadgeProps {
  text: string;
  tone: string;
}

export const StatusBadgeComponent = (
  props: ComponentProps<StatusBadgeProps>,
) => {
  return <div {...props.emit()}>{props.props.text}</div>;
};

export class StatusBadgeComponentMeta implements ComponentMeta {
  getComponentType(): string {
    return COMPONENT_TYPE;
  }
  getDefaultSize(): SizeObject {
    return { width: 140, height: 36 };
  }
  getViewComponent(): PComponent {
    return StatusBadgeComponent as PComponent;
  }
  getPropsReducer(tree: PropertyTree): StatusBadgeProps {
    return {
      text: tree.read("text", "Status"),
      tone: tree.read("tone", "neutral"),
    };
  }
}
```

```ts
// components/index.ts
export { StatusBadgeComponentMeta } from "./StatusBadge";

// rad-client-components.ts
import { StatusBadgeComponentMeta } from "./components";
const components: Array<ComponentMeta> = [new StatusBadgeComponentMeta()];
```

## Checklist

- Keep `COMPONENT_ID` (Java) and `COMPONENT_TYPE` (TS) identical.
- Keep `tree.read("...")` keys aligned with schema property keys.
- Mirror sandbox-tested prop contract when migrating to `web/packages/client/typescript/components`.
- Keep `set* / on* / handle*` semantics on component props (per `web/sandbox/README.md`).
- Generate schema props from React component props interface, excluding `on*` and `set*`.
- Keep schema prop types aligned with interface types (or explicit documented mapping).
- Add event payload schema for each emitted `on*` event.
- Keep `fireComponentEvent(...)` payload keys/types aligned with event payload schema.
- Register and remove in both hooks (Gateway + Designer).
- Add/remove delegates in the same scope when used.
- Do not edit `web/packages/designer/typescript/...` unless explicitly requested.

## Validation

- Run `./gradlew build` from repo root.
- If only client changed, run existing TypeScript compile tasks.
