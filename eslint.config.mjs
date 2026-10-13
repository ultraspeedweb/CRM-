import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default defineConfig([
  ...tseslint.configs.recommended,
  { files: ["**/*.{js,jsx,ts,tsx}"], plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: { ...reactHooks.configs.recommended.rules, ...jsxA11y.configs.recommended.rules } },
  globalIgnores([".next/**", ".vercel/**", "supabase/.temp/**", "next-env.d.ts"]),
]);
