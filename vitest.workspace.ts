import { defineWorkspace, mergeConfig } from 'vitest/config'
import rootConfig from './vitest.config'

export default defineWorkspace([
  'packages/*',
  mergeConfig(rootConfig, {
    test: {
      environment: 'jsdom',
      include: ['tests/**/*.test.{ts,js}', '**/__tests__/**/*.test.{ts,js}'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/es/**', '**/lib/**'],
    },
  }),
])
