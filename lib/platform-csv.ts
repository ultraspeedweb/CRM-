/** Treat CSV as untrusted spreadsheet input, including leading whitespace/control chars. */
export function csvCell(value: unknown): string {
  const raw = String(value ?? "");
  // Spreadsheet applications may ignore whitespace and controls before a formula.
  // Prefix dangerous cells with an apostrophe; keep the original bytes for auditing.
  const unsafe = /^[\s\u0000-\u001f\u007f]*[=+\-@]/u.test(raw);
  const safe = unsafe ? "'" + raw : raw;
  return '"' + safe.replace(/"/g, '""') + '"';
}
