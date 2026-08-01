import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // componentes gerados pelo shadcn CLI (nao editados a mao) - exportam
    // helpers tipo buttonVariants/badgeVariants junto do componente, que e'
    // o padrao esperado da lib e nao vale a pena reestruturar so pro Fast
    // Refresh, que nesses arquivos praticamente nunca dispara mesmo (raramente
    // editados em dev).
    files: ['src/shared/ui/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
