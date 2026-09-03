# ILS Currency Converter

A mobile Expo app that fetches live market rates and instantly converts USD and EUR amounts into Israeli New Shekels.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/ils-currency-converter run dev` — run the Expo mobile preview
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ils-currency-converter/app/index.tsx` — converter screen, input handling, and live rate display
- `artifacts/ils-currency-converter/constants/colors.ts` — light and dark semantic theme tokens
- `artifacts/api-server/src/routes/rates.ts` — server-side Frankfurter proxy and USD/ILS derivation
- `lib/api-spec/openapi.yaml` — source of truth for the `/api/rates` contract

## Architecture decisions

- The app is a single-screen Expo Router app with no tabs because conversion is the core task.
- Frankfurter is called from the API server to avoid browser CORS restrictions; the client consumes the generated API hook.
- USD to ILS is derived as the EUR-to-ILS rate divided by the EUR-to-USD rate because Frankfurter defaults to EUR.

## Product

Users enter a USD amount and see live USD-to-ILS and EUR-to-ILS totals update immediately. The screen includes auto-load, manual refresh, loading and error states, and a last-updated time.

## User preferences

- Clean, modern, minimalist mobile UI with rounded cards, soft background colors, and large legible currency values.

## Gotchas

- The Expo app needs `EXPO_PUBLIC_DOMAIN` to reach the shared API server in native bundles; the managed workflow injects it automatically.
- Keep the Frankfurter request server-side so web previews do not hit its missing CORS headers.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
