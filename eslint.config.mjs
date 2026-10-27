import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Request: "readonly",
        Response: "readonly",
        Headers: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        localStorage: "readonly",
        crypto: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",
        structuredClone: "readonly"
      }
    }
  },
  globalIgnores([".next/**", ".vercel/**", "supabase/.temp/**", "next-env.d.ts"])
]);
