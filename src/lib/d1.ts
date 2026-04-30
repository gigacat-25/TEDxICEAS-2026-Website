import { getRequestContext } from "@cloudflare/next-on-pages";

/**
 * Direct Cloudflare D1 REST API helper.
 * Bypasses Drizzle ORM — no column mapping issues, no binding bugs.
 */
export async function d1<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  // Try native Cloudflare D1 binding first
  try {
    const { env } = getRequestContext();
    const nativeDb = (env as any)?.DB;
    if (nativeDb) {
      const result = await nativeDb.prepare(sql).bind(...params).all();
      return (result.results ?? []) as T[];
    }
  } catch {
    // fallback to HTTP API
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;

  if (!accountId || !databaseId || !token) {
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production') {
      console.warn('D1: Skipping fetch due to missing credentials (likely build phase)');
      return [] as T[];
    }
    throw new Error(
      'Missing Cloudflare env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN'
    );
  }

  try {
    const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  const json = (await res.json()) as any;

  if (!json.success) {
    const msg = json.errors?.[0]?.message ?? JSON.stringify(json.errors);
    throw new Error(`D1 error: ${msg}`);
  }

  return (json.result?.[0]?.results ?? []) as T[];
  } catch (error) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('D1: Fetch failed during build, ignoring:', error);
      return [] as T[];
    }
    throw error;
  }
}

/** Convenience wrapper for mutations (INSERT / UPDATE / DELETE). */
export async function d1run(sql: string, params: unknown[] = []): Promise<void> {
  await d1(sql, params);
}
