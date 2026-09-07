# Event Emitter

Small, type-safe event emitter library using the oxc ecosystem.

## Commands

```bash
pnpm build                                      # build with tsdown
pnpm test                                       # full suite: build + coverage + typecheck
pnpm test:cov                                   # run Vitest with coverage
pnpm exec vitest run src/event-emitter.spec.ts  # run the unit tests directly
pnpm lint                                       # lint with oxlint
pnpm lint:fix                                   # lint and auto-fix
pnpm fmt                                        # format with oxfmt
pnpm docs                                       # generate API docs with TypeDoc
pnpm test:types                                 # TypeScript project checking
```

## Important

Always keep this file up to date when project commands, structure, or tooling change.

## Architecture

Single-package TypeScript library. `src/index.ts` re-exports the implementation from
`src/event-emitter.ts`. Tests are co-located as `*.spec.ts`; type tests use `*.test-d.ts`.

Built with tsdown (`tsdown.config.ts`), producing ESM and declarations in `dist/`. The oxc
toolchain provides linting and formatting.
