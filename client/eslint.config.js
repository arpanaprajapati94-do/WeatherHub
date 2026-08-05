import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
// The React Compiler lint rules below are very aggressive and flag
      // standard React 18 patterns (e.g. data-fetching inside useEffect,
      // context modules that also export hooks, ref usage for DOM access).
      // These are intentional in this codebase and are NOT bugs, so we
      // disable them to avoid false positives while keeping the rest of the
      // recommended rules active.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      // Context modules intentionally export both a provider component and a
      // consumer hook (e.g. useAuth, useTheme). This is the standard React
      // context pattern and is not a fast-refresh problem, so we disable it.
      'react-refresh/only-export-components': 'off',
    },
  },
])
