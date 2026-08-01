import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Config separada da vite.config.ts de proposito: testes nao precisam do
// babel-plugin-react-compiler (e' otimizacao de build/runtime, nao muda
// comportamento observavel em teste) nem do plugin do rolldown - so o
// transform de JSX e o mesmo alias @/* usado no app.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    // e2e/ roda no runner do Playwright (test/expect com API diferente do
    // vitest) - sem excluir, o glob default do vitest tambem casa *.spec.ts
    // la dentro e tenta rodar como teste de unidade, quebrando o import de
    // '@playwright/test'.
    exclude: ['**/node_modules/**', '**/e2e/**'],
  },
})
