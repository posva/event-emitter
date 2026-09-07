import { defineConfig } from 'tsdown'
import type { UserConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

const banner = `
/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author.name}
 * @license MIT
 */
`.trim()

const commonOptions = {
  banner,
  sourcemap: false,
  format: ['esm'],
  deps: {
    onlyBundle: [],
    neverBundle: [],
  },
  target: 'esnext',
  tsconfig: 'tsconfig.build.json',
  dts: {
    enabled: true,
    generator: 'oxc',
  },
  exports: true,
} satisfies UserConfig

export default defineConfig([
  {
    ...commonOptions,
    clean: true,
    entry: ['src/index.ts'],
    globalName: 'PosvaEventEmitter',
  },
])
