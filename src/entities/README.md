Self-contained domain slices. A slice never imports from `features`, `widgets`, `pages` or `app`.

```
src/entities/<slice-name>/
  model/   domain logic, types, store
  ui/      presentational components
  lib/     helpers specific to the entity
  api/     data access
  index.ts public API — the only import surface others may use
```
