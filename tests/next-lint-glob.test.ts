import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { ESLint } from "eslint";
import { expect, it } from "vitest";

const require = createRequire(import.meta.url);
const plugin = require("@next/eslint-plugin-next");
const { getRootDirs } = require("@next/eslint-plugin-next/dist/utils/get-root-dirs");

it("preserves Next root directory glob discovery and actual lint diagnostics", async () => {
  const fixture = mkdtempSync(join(tmpdir(), "satisdesk-lint-"));
  try {
    for (const app of ["one", "two"]) {
      mkdirSync(join(fixture, app, "pages"), { recursive: true });
      writeFileSync(join(fixture, app, "pages", "about.js"), "export default function About() { return null; }");
    }
    writeFileSync(join(fixture, "not-a-directory"), "file");
    const pattern = `${fixture}/*`;
    const directories = (settings: object) => getRootDirs({ cwd: fixture, settings }).map((path: string) => resolve(path)).sort();
    expect(directories({ next: { rootDir: pattern } })).toEqual([join(fixture, "one"), join(fixture, "two")]);
    expect(directories({ next: { rootDir: [`${fixture}/{one,two}`] } })).toEqual([join(fixture, "one"), join(fixture, "two")]);
    const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: [{
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      plugins: { "@next/next": plugin }, settings: { next: { rootDir: pattern } },
      rules: { "@next/next/no-html-link-for-pages": "error" },
    }] });
    const [result] = await eslint.lintText('const link = <a href="/about">About</a>;', { filePath: "lint-fixture.js" });
    expect(result.messages.map(message => message.ruleId)).toContain("@next/next/no-html-link-for-pages");
  } finally { rmSync(fixture, { recursive: true, force: true }); }
});
