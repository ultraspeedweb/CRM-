# Reviewed Next lint glob dependency

The full dependency audit on 2026-10-20 reported GHSA-vfj7-8cjw-p6xm through
`eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces`.
The latest available braces release, 3.0.3, was within the advisory range.

The pinned Next ESLint plugin 16.4.1 uses only
`globSync(pattern, { onlyDirectories: true })` in `dist/utils/get-root-dirs.js`.
The local `tools/next-lint-glob` package preserves that small API with
`tinyglobby@0.2.17` (MIT), installed through a direct dev dependency and an npm
override. It preserves absolute paths and disables implicit directory expansion;
it rejects unsupported options so an upstream contract change fails visibly.

Reviewed tinyglobby package entrypoints, dependencies and filesystem traversal
implementation. It uses filesystem reads and pattern matching; no lifecycle
scripts, network access or secret access are introduced. The adapter is used by
development lint tooling, not imported by application code. Registry integrity
and transitive versions are recorded in package-lock.json; the adapter source is
tracked in Git.

Regression evidence must include a clean `npm ci`, the full audit, normal lint,
and `tests/next-lint-glob.test.ts`, which checks directory/brace discovery and an
actual Next rule diagnostic. No audit exclusions or lint rule removals close this
advisory. Re-review the caller contract on every Next ESLint plugin upgrade.

Removal: once upstream removes or fixes the affected dependency, remove the
override, direct fast-glob dependency and local adapter together; regenerate the
lockfile and rerun the same regression checks. This change removes the vulnerable
dependency chain rather than accepting its residual risk.
