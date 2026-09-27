# INTRDY

React 19 + Vite 8 + TypeScript + Tailwind CSS 4, pnpm, FSD-style architecture.

## Commands

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `pnpm dev`         | Dev server on http://localhost:3000      |
| `pnpm build`       | Typecheck + production build             |
| `pnpm preview`     | Serve the production build               |
| `pnpm typecheck`   | `tsc -b` only                            |
| `pnpm lint`        | oxlint, includes FSD boundary rules       |
| `pnpm lint:fix`    | oxlint with autofix                      |

## Architecture

Layers may only import **downward**. The rules are enforced by oxlint (`no-restricted-imports` with `regex` patterns in `.oxlintrc.json`), so a violation fails `pnpm lint`.

```
src/
  app/          composition root: providers, router, global styles
  pages/        route-level screens  (app → pages)
  widgets/      composite blocks      (pages/widgets → entities)
  features/     user actions          (widgets/features → entities)
  entities/     domain slices         (entities → shared)
  shared/       framework-agnostic: ui, lib, config, api
```

### Slice rules

- Every slice exposes a public API via its own `index.ts`; deep imports are banned (`@/shared/ui/Button` ❌, `@/shared/ui` ✅).
- Use the `@/*` alias, never `../` (`import/no-relative-parent-imports`).
- No import cycles (`import/no-cycle`).
- Segment order inside a slice: `model` · `ui` · `lib` · `api`, then `index.ts`.
- Routes are lazy: `src/app/router/lazy-pages.ts`, defined in `routes.tsx`, paths in `paths.ts` (`ROUTES`).
- Each route is wrapped with `withPageBoundary` (Suspense + ErrorBoundary); a thrown loader error renders `RouteErrorFallback`.

### Adding a page

1. `src/pages/<name>/ui/<Name>Page.tsx` + `index.ts` re-exporting it.
2. Add a lazy import in `src/app/router/lazy-pages.ts`.
3. Add the path to `ROUTES` (`src/app/router/paths.ts`) and an entry to `routes.tsx`.

## Config

Copy `.env.example` to `.env.local`. Typed via `src/shared/types/env.d.ts`, read in `src/shared/config/env.ts` and re-exported as `appConfig`.

`@/*` is aliased in both `vite.config.ts` and `tsconfig.app.json`.
