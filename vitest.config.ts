import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcovonly', 'html'],
      // all: true,
      include: ['src'],
      exclude: ['src/index.ts', 'src/**/*.test-d.ts'],
    },
  },
})
