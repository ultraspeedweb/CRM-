import { test, expect } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3000';

test('unauthenticated platform export is redirected, never CSV', async ({ request }) => {
  const response = await request.get(`${baseURL}/platform/export`, { maxRedirects: 0 });
  expect([302, 303, 307, 308]).toContain(response.status());
  const redirect = new URL(response.headers().location, baseURL);
  expect(redirect.pathname).toBe('/login');
  // Next.js may canonicalize the local loopback host from 127.0.0.1 to localhost.
  // Both resolve to the same test server; still reject external redirect targets.
  const expected = new URL(baseURL);
  expect(['localhost', '127.0.0.1']).toContain(redirect.hostname);
  expect(redirect.port).toBe(expected.port);
  expect(redirect.protocol).toBe(expected.protocol);
  expect(response.headers()['content-type'] ?? '').not.toContain('text/csv');
});
