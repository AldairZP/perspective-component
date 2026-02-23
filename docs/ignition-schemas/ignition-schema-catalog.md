# Ignition Perspective Schema Catalog

This document is the concise catalog of `urn:ignition-schema:schemas/*` references used for this project.

## Analyzed version

- Ignition SDK used by this project: `8.1.16` (see `gradle/libs.versions.toml`)
- Scanned artifact: `com.inductiveautomation.perspective:perspective-common:2.1.16`

## Available schema URNs

- `urn:ignition-schema:schemas/binding-expr.json`
- `urn:ignition-schema:schemas/binding-expr-struct.json`
- `urn:ignition-schema:schemas/binding-http.json`
- `urn:ignition-schema:schemas/binding-property.json`
- `urn:ignition-schema:schemas/binding-query.json`
- `urn:ignition-schema:schemas/binding-tag.json`
- `urn:ignition-schema:schemas/binding-tag-history.json`
- `urn:ignition-schema:schemas/css-length.schema.json`
- `urn:ignition-schema:schemas/css-props.schema.json`
- `urn:ignition-schema:schemas/css-rotation.schema.json`
- `urn:ignition-schema:schemas/css-time.schema.json`
- `urn:ignition-schema:schemas/icon-schema.json`
- `urn:ignition-schema:schemas/meta-schema.json`
- `urn:ignition-schema:schemas/optional-icon-schema.json`
- `urn:ignition-schema:schemas/project-mounts.json`
- `urn:ignition-schema:schemas/session-props.json`
- `urn:ignition-schema:schemas/style-class-schema.json`
- `urn:ignition-schema:schemas/style-properties.schema.json`
- `urn:ignition-schema:schemas/svg-fill.json`
- `urn:ignition-schema:schemas/svg-stroke.json`
- `urn:ignition-schema:schemas/transform-expr.json`
- `urn:ignition-schema:schemas/transform-format.json`
- `urn:ignition-schema:schemas/transform-map.json`
- `urn:ignition-schema:schemas/trend-style.schema.json`
- `urn:ignition-schema:schemas/view-props-schema.json`

## What these schemas are used for

- `binding-*`: Perspective binding configuration.
- `transform-*`: Binding transform configuration.
- `style-*`, `css-*`, `svg-*`, `icon-*`: Styling and visual metadata.
- `meta-schema`, `view-props-schema`, `session-props`: Runtime/project metadata.

For required/optional/default attributes by schema, see:

- `docs/ignition-schemas/ignition-schema-attributes-reference.md`

## Where schemas come from

Schemas are packaged in `perspective-common-2.1.16.jar`, under internal path `schemas/`.

## How to regenerate this catalog

PowerShell:

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
$jar = Get-ChildItem -Recurse -File "$env:USERPROFILE\.gradle\caches\modules-2\files-2.1\com.inductiveautomation.perspective\perspective-common\2.1.16" |
  Where-Object { $_.Name -eq 'perspective-common-2.1.16.jar' } |
  Select-Object -First 1 -ExpandProperty FullName

$zip = [System.IO.Compression.ZipFile]::OpenRead($jar)
$zip.Entries |
  Where-Object { $_.FullName -match '(^|/)schemas/[^/]+\.json$' } |
  ForEach-Object { "urn:ignition-schema:schemas/$($_.FullName -replace '^.*/schemas/','')" } |
  Sort-Object -Unique
$zip.Dispose()
```

## Notes

- Exact availability may vary by Ignition/Perspective version.
- Re-run extraction whenever SDK version changes.
