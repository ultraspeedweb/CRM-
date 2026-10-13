/** Escape untrusted text for spreadsheet-compatible CSV, including formula injection. */
export function csvCell(value: unknown): string {
  const raw = String(value ?? "");
  // Excel and spreadsheet importers may ignore leading whitespace or control
  // characters when detecting formulas; quote the entire value after prefixing.
  const dangerous = /^[\s\x00-\x1f]*[=+@-]/u.test(raw);
  const safe = dangerous ? "'" + raw : raw;
  return '"' + safe.replace(/"/g, '""') + '"';
}
