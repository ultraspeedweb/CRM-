/**
 * Encode a CSV cell without allowing spreadsheet formula execution when opened in Excel.
 * CSV quotes escape delimiters, but do not prevent formula injection.
 */
export function platformCsvCell(value: unknown): string {
  const raw = String(value ?? "");
  const safe = /^[\s\uFEFF]*[=+@-]/u.test(raw) ? "'" + raw : raw;
  return '"' + safe.replace(/"/g, '""') + '"';
}

export function platformLoginRedirect(requestUrl: string): URL {
  const current = new URL(requestUrl);
  // Preserve the current deployment's origin (local, Preview, or Production).
  return new URL("/login", current.origin);
}
