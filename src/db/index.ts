import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

/**
 * Minimal D1 HTTP shim that implements the D1Database interface
 * using the Cloudflare D1 REST API.
 * Used when running local `next dev` (no CF binding available).
 */
class D1HttpClient implements Pick<D1Database, 'prepare' | 'batch' | 'exec' | 'dump'> {
  constructor(
    private accountId: string,
    private databaseId: string,
    private token: string
  ) {}

  private async query(sql: string, params: unknown[] = []) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });
    const json = await res.json() as any;
    if (!json.success) throw new Error(`D1 HTTP error: ${JSON.stringify(json.errors)}`);
    return json.result[0];
  }

  prepare(sql: string) {
    const self = this;
    const bindings: unknown[] = [];
    const stmt: D1PreparedStatement = {
      bind(...args: unknown[]) { bindings.push(...args); return stmt; },
      async first<T = unknown>(col?: string): Promise<T | null> {
        const r = await self.query(sql, bindings);
        const row = r.results?.[0];
        return col ? (row?.[col] ?? null) : (row ?? null);
      },
      async run() {
        const r = await self.query(sql, bindings);
        return { results: r.results ?? [], success: true, meta: r.meta ?? {} } as D1Result;
      },
      async all<T = unknown>() {
        const r = await self.query(sql, bindings);
        return { results: (r.results ?? []) as T[], success: true, meta: r.meta ?? {} } as D1Result<T>;
      },
      async raw<T extends unknown[] = unknown[]>() {
        const r = await self.query(sql, bindings);
        return (r.results ?? []) as T[];
      },
    };
    return stmt;
  }

  async batch<T extends D1Result = D1Result>(statements: D1PreparedStatement[]): Promise<T[]> {
    // Execute each statement individually via the HTTP API
    const results = await Promise.all(statements.map((s) => (s as any).run()));
    return results as T[];
  }

  async exec(query: string): Promise<D1ExecResult> {
    const r = await this.query(query);
    return { count: r.meta?.changes ?? 0, duration: r.meta?.duration ?? 0 };
  }

  async dump(): Promise<ArrayBuffer> {
    throw new Error('D1HttpClient.dump() is not supported in local dev');
  }
}

/**
 * Returns a Drizzle ORM instance backed by D1.
 *
 * On Cloudflare Pages: uses native D1 binding via getRequestContext().env.DB
 * On local next dev:   uses D1 REST API (needs CLOUDFLARE_D1_TOKEN in .env)
 */
export function getDb(binding?: D1Database) {
  if (binding) return drizzle(binding, { schema });

  // Try CF Pages runtime context (production & next-on-pages)
  try {
    // Use variable to prevent Next.js static analysis from erroring on optional package
    const pkg = '@cloudflare/next-on-pages';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getRequestContext } = require(pkg);
    const env = getRequestContext().env;
    if (env?.DB) return drizzle(env.DB as D1Database, { schema });
  } catch {
    // Not in CF Pages runtime — fall through to HTTP driver
  }

  // Local next dev: use D1 REST API
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;

  if (!accountId || !databaseId || !token || token === 'your_d1_api_token_here') {
    throw new Error(
      'CLOUDFLARE_D1_TOKEN is not set. Generate one at:\n' +
      'https://dash.cloudflare.com/profile/api-tokens\n' +
      'Use the "D1 Edit" template and paste it into your .env file.'
    );
  }

  return drizzle(new D1HttpClient(accountId, databaseId, token) as unknown as D1Database, { schema });
}

/**
 * Returns the R2 bucket binding.
 * Only available on Cloudflare Pages; throws a clear error in local dev.
 */
export function getR2(): R2Bucket {
  try {
    const pkg = '@cloudflare/next-on-pages';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getRequestContext } = require(pkg);
    const env = getRequestContext().env;
    if (env?.R2) return env.R2 as R2Bucket;
  } catch {
    // fall through
  }
  throw new Error(
    'R2 binding is only available on Cloudflare Pages. Image uploads require a CF Pages deployment.'
  );
}
