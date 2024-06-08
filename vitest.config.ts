/// <reference types="vite/client" />
// import path from 'path'

export default {
  assetsInclude: [/\.(htm)$/, /\.(vm)$/],
  test: {
    environment: 'jsdom',
    root: process.cwd(),
    // setupFiles: [path.join(process.cwd(), 'vitest.setup.ts')],
    include: ['tests/**/*.test.{ts,js}', '**/__tests__/**/*.test.{ts,js}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/es/**', '**/lib/**'],
  },
}
