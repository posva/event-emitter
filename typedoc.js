// @ts-check

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  name: 'Event Emitter',
  // excludeInternal: true,
  out: 'docs-api',
  entryPoints: ['src/index.ts'],
  exclude: ['**/*.spec.ts'],
}

export default config
