# Ignition Schema Attributes Reference

This document keeps a compact reference for top-level schema attributes.

Scope:

- Required fields
- Optional fields
- Defaults (when explicitly defined)

> Note: This is a top-level summary. Schemas using `oneOf` / `anyOf` / `allOf` may vary by branch.

## Core runtime schemas

| Schema                     | Required            | Optional                                                                                                                                                    | Defaults                                                            |
| -------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `binding-expr.json`        | `expression`        | —                                                                                                                                                           | `expression` (none)                                                 |
| `binding-expr-struct.json` | `struct`            | `waitOnAll`                                                                                                                                                 | none                                                                |
| `binding-http.json`        | `request`           | `enableCookies`, `connectTimeout`, `socketTimeout`, `polling`                                                                                               | request + polling defaults                                          |
| `binding-property.json`    | `path`              | `bidirectional`                                                                                                                                             | `path=""`, `bidirectional=false`                                    |
| `binding-query.json`       | `queryPath`         | `returnFormat`, `parameters`, `polling`, `designerUseLimit`, `bypassCache`                                                                                  | `returnFormat="auto"`, `designerUseLimit=true`, `bypassCache=false` |
| `binding-tag.json`         | `tagPath`           | `mode`, `bidirectional`, `references`                                                                                                                       | `tagPath=""`, `mode="direct"`, `bidirectional=false`                |
| `binding-tag-history.json` | `dateRange`, `tags` | `returnFormat`, `returnSize`, `polling`, `aggregate`, `valueFormat`, `ignoreBadQuality`, `preventInterpolation`, `avoidScanClassValidation`, `calculations` | `returnFormat="wide"`, polling defaults                             |

## Styling and visual schemas

| Schema                         | Required | Optional                                                                                    | Defaults                                  |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `style-properties.schema.json` | —        | `classes`, CSS props, `fill`, etc.                                                          | `classes=""` + some color defaults        |
| `style-class-schema.json`      | —        | `pseudo`, `animation`, `declarations`, `keyframes`, `dependencies`                          | none                                      |
| `css-props.schema.json`        | —        | broad CSS property set                                                                      | some color defaults                       |
| `css-length.schema.json`       | —        | (branch-defined)                                                                            | none                                      |
| `css-rotation.schema.json`     | —        | `anchor`, `angle`                                                                           | none                                      |
| `css-time.schema.json`         | —        | (branch-defined)                                                                            | none                                      |
| `icon-schema.json`             | —        | `path`, `library`, `name`, `color`, `style`                                                 | `path=""`, `color=""`                     |
| `optional-icon-schema.json`    | —        | `path`, `color`                                                                             | `path="material/link"`, `color="#6C6C6C"` |
| `svg-fill.json`                | —        | `paint`, `opacity`, `rule`                                                                  | none                                      |
| `svg-stroke.json`              | —        | `paint`, `width`, `opacity`, `dashArray`, `dashoffset`, `linecap`, `linejoin`, `miterlimit` | none                                      |
| `trend-style.schema.json`      | —        | `colorScheme`, `colors`, `normal`, `highlighted`, `selected`, `muted`                       | none                                      |

## Meta/session/view schemas

| Schema                   | Required | Optional                                                                                                                                             | Defaults                          |
| ------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `meta-schema.json`       | —        | `name`, `visible`, `tooltip`, `domId`                                                                                                                | `visible=true`                    |
| `session-props.json`     | —        | `id`, `host`, `theme`, `locale`, `timeZoneId`, `lastActivity`, `auth`, `gateway`, `device`, `bluetooth`, `geolocation`, `appBar`, `pipes`, `symbols` | `theme="light"` + device defaults |
| `project-mounts.json`    | —        | (branch-defined)                                                                                                                                     | none                              |
| `view-props-schema.json` | —        | `defaultSize`, `dropConfig`, `loading`, `inputBehavior`                                                                                              | `inputBehavior="replace"`         |

## Transform schemas

| Schema                  | Required                    | Optional         | Defaults                                     |
| ----------------------- | --------------------------- | ---------------- | -------------------------------------------- |
| `transform-expr.json`   | `expression`                | —                | none                                         |
| `transform-format.json` | `formatType`, `formatValue` | —                | datetime format default object               |
| `transform-map.json`    | —                           | (branch-defined) | mappings/inputType/outputType default object |

## Regeneration note

For a full extraction, regenerate from the Perspective common JAR and update this file together with:

- `docs/ignition-schemas/ignition-schema-catalog.md`
