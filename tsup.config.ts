import fs from 'node:fs'
import { type Options, defineConfig } from 'tsup'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

const commonOptions = {
  splitting: false,
  sourcemap: true,
  format: ['cjs', 'esm'],
  dts: true,
  target: 'esnext',
  banner: {
    js: `
/*!
 * ${pkg.name} v${pkg.version}
 * (c) 2024-present Eduardo San Martin Morote
 * @license ${pkg.license}
 */
`.trim(),
  },
} satisfies Options

export default defineConfig([
  {
    ...commonOptions,
    clean: true,
    entry: ['src/index.ts'],
  },
])
