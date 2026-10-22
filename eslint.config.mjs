import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // The pinned Next plugin loads this small adapter through synchronous require().
  { files: ["tools/next-lint-glob/index.cjs"], rules: { "@typescript-eslint/no-require-imports": "off" } },
  globalIgnores([".next/**", ".vercel/**", "supabase/.temp/**", "next-env.d.ts"]),
]);
