import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Commercial launch script safety contract", () => {
  const script = readFileSync(resolve(process.cwd(), "scripts/launch-commercial.ps1"), "utf8");

  it("must not push, merge, reset or deploy production", () => {
    const executable = script
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && !line.startsWith("Write-Host"));
    expect(executable.join("\n")).not.toMatch(/\bgit\s+(?:push|commit|merge|reset|remote\s+set-url)\b/i);
    expect(executable.join("\n")).not.toMatch(/\b(?:vercel\s+--prod|npx\s+.*vercel.*--prod)\b/i);
    expect(executable.join("\n")).not.toMatch(/--force(?:-with-lease)?\b/i);
  });

  it("checks project identity, branch and clean tree before local validation", () => {
    expect(script).toContain("prj_gDo8CZUBN3QvEv1gqgkMuMn56JjG");
    expect(script).toContain("git remote get-url origin");
    expect(script).toContain("git branch --show-current");
    expect(script).toContain('git status --porcelain');
    expect(script).toContain('npm run verify');
  });
});
