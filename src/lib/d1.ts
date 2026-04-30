/**
 * Direct Cloudflare D1 REST API helper.
 * Bypasses Drizzle ORM — no column mapping issues, no binding bugs.
 */
export async function d1<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;

  if (!accountId || !databaseId || !token) {
    throw new Error(
      'Missing Cloudflare env vars: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN'
    );
  }

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
}

/** Convenience wrapper for mutations (INSERT / UPDATE / DELETE). */
export async function d1run(sql: string, params: unknown[] = []): Promise<void> {
  await d1(sql, params);
}
