/// <reference types="@cloudflare/workers-types" />
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Minimal D1 HTTP shim that implements the D1Database interface
 * using the Cloudflare D1 REST API.
 * Used when running local `next dev` (no CF binding available).
 */
/**
 * D1 client that uses the wrangler CLI to execute queries.
 * This bypasses the need for an API token by using the user's
 * logged-in wrangler session.
 */
class WranglerD1Client implements Pick<D1Database, 'prepare' | 'batch' | 'exec' | 'dump'> {
  constructor(private databaseName: string) {}

  private async query(sql: string, params: unknown[] = []) {
    // Interpolate params into SQL (basic escaping for local dev)
    const parts = sql.split(/\?|\$\d+/);
    let finalSql = parts[0];
    
    for (let i = 0; i < params.length; i++) {
      const p = params[i];
      let value = p;
      if (typeof p === 'string') {
        value = `'${p.replace(/'/g, "''")}'`;
      } else if (p instanceof Date) {
        value = `'${p.toISOString()}'`;
      } else if (p === null || p === undefined) {
        value = 'NULL';
      } else if (typeof p === 'boolean') {
        value = p ? '1' : '0';
      }
      
      finalSql += String(value) + (parts[i + 1] || '');
    }

    try {
      // Use a temporary file to avoid all shell quoting issues on Windows/Linux
      const tempDir = path.join(process.cwd(), '.tmp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
      
      const tempFile = path.join(tempDir, `query-${Date.now()}-${Math.random().toString(36).slice(2)}.sql`);
      fs.writeFileSync(tempFile, finalSql);

      try {
        const args = ['wrangler', 'd1', 'execute', this.databaseName, '--remote', '--json', '--file', tempFile];
        
        const result = spawnSync('npx', args, { 
          encoding: 'utf-8', 
          shell: process.platform === 'win32' 
        });

        if (result.status !== 0) {
          const errorMsg = result.stderr || result.stdout || 'Wrangler command failed';
          throw new Error(errorMsg);
        }
        
        // Robustly find the JSON part in the output (ignoring progress bars, etc.)
        const stdout = result.stdout;
        const jsonStartIndex = stdout.indexOf('[');
        const jsonEndIndex = stdout.lastIndexOf(']') + 1;
        
        if (jsonStartIndex === -1 || jsonEndIndex <= jsonStartIndex) {
          throw new Error(`Wrangler output did not contain a valid JSON result array: ${stdout}`);
        }
        
        const jsonStr = stdout.substring(jsonStartIndex, jsonEndIndex);
        const json = JSON.parse(jsonStr);
        const queryResult = Array.isArray(json) ? json[0] : json;
        
        if (!queryResult.success) {
          throw new Error(queryResult.errors?.[0]?.message || 'Query failed');
        }

        return {
          results: queryResult.results || [],
          success: queryResult.success,
          meta: queryResult.meta || { changes: 0, duration: 0 }
        };
      } finally {
        // Always clean up the temp file
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      }
    } catch (e: any) {
      console.error(`\x1b[31m[Wrangler Error]\x1b[0m ${e.message}`);
      throw e;
    }
  }

  prepare(sql: string) {
    const self = this;
    const bindings: unknown[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stmt: any = {
      bind(...args: unknown[]) { bindings.push(...args); return stmt; },
      async first<T = unknown>(col?: string): Promise<T | null> {
        const r = await self.query(sql, bindings);
        const row = r.results?.[0];
        return col ? (row?.[col] ?? null) : (row ?? null);
      },
      async run() {
        const r = await self.query(sql, bindings);
        return { results: r.results ?? [], success: true, meta: r.meta ?? {} };
      },
      async all<T = unknown>() {
        const r = await self.query(sql, bindings);
        return { results: (r.results ?? []) as T[], success: true, meta: r.meta ?? {} };
      },
      async raw<T extends unknown[] = unknown[]>() {
        const r = await self.query(sql, bindings);
        return (r.results ?? []) as T[];
      },
    };
    return stmt as D1PreparedStatement;
  }

  async batch<T extends D1Result = D1Result>(statements: D1PreparedStatement[]): Promise<T[]> {
    const results = await Promise.all(statements.map((s) => (s as any).run()));
    return results as T[];
  }

  async exec(query: string): Promise<D1ExecResult> {
    const r = await this.query(query);
    return { count: r.meta?.changes ?? 0, duration: r.meta?.duration ?? 0 };
  }

  async dump(): Promise<ArrayBuffer> {
    throw new Error('WranglerD1Client.dump() is not supported');
  }
}

class D1HttpClient implements Pick<D1Database, 'prepare' | 'batch' | 'exec' | 'dump'> {
  constructor(
    private accountId: string,
    private databaseId: string,
    private token: string
  ) {}

  private async query(sql: string, params: unknown[] = []) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    console.log(`\x1b[36m[D1]\x1b[0m ${sql.slice(0, 120)}`);
    if (params.length > 0) console.log(`\x1b[36m[D1 params]\x1b[0m`, JSON.stringify(params));

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const json = await res.json() as any;

    if (!json.success) {
      const errorMsg = json.errors?.[0]?.message || JSON.stringify(json.errors);
      console.error(`\x1b[31m[D1 Error]\x1b[0m`, errorMsg);
      throw new Error(`D1 HTTP error: ${errorMsg}`);
    }

    const resultSet = json.result?.[0];
    if (!resultSet) {
      console.error(`\x1b[31m[D1 Error]\x1b[0m No result set. Full response:`, JSON.stringify(json));
      throw new Error('D1: no result set in response');
    }

    // Log first row so we can verify column names from D1
    if (resultSet.results?.length > 0) {
      const firstRow = resultSet.results[0];
      console.log(`\x1b[32m[D1 row0]\x1b[0m keys=${Object.keys(firstRow).join(',')}`); 
      console.log(`\x1b[32m[D1 row0]\x1b[0m`, JSON.stringify(firstRow));
    } else {
      console.log(`\x1b[33m[D1 result]\x1b[0m rows=${resultSet.results?.length ?? 'null'} success=${resultSet.success}`);
    }

    return resultSet;
  }

  prepare(sql: string) {
    const self = this;
    // Each prepare() call gets its own bindings array
    let bindings: unknown[] = [];
    const stmt: any = {
      bind(...args: unknown[]) {
        // Drizzle calls bind() with all params at once — replace, don't accumulate
        bindings = args;
        return stmt;
      },
      async first<T = unknown>(col?: string): Promise<T | null> {
        const r = await self.query(sql, bindings);
        const row = r.results?.[0];
        return col ? (row?.[col] ?? null) : (row ?? null);
      },
      async run() {
        const r = await self.query(sql, bindings);
        return { results: r.results ?? [], success: true, meta: r.meta ?? {} };
      },
      async all<T = unknown>() {
        const r = await self.query(sql, bindings);
        return { results: (r.results ?? []) as T[], success: true, meta: r.meta ?? {} };
      },
      async raw<T extends unknown[] = unknown[]>() {
        const r = await self.query(sql, bindings);
        return (r.results ?? []) as T[];
      },
    };
    return stmt as D1PreparedStatement;
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

import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Returns a Drizzle ORM instance backed by D1.
 *
 * Uses @opennextjs/cloudflare to access the Cloudflare environment.
 * Falls back to D1 REST API in local dev if no binding is available.
 */
export function getDb(binding?: D1Database) {
  if (binding) return drizzle(binding, { schema });

  // Try CF runtime context (production & preview)
  try {
    const { env } = getCloudflareContext();
    const d1 = (env as any)?.DB;
    if (d1) return drizzle(d1 as D1Database, { schema });
  } catch {
    // fall through
  }

  // Local next dev: prefer D1 REST API for speed and reliability
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;
  const databaseName = process.env.CLOUDFLARE_DATABASE_NAME || 'tedxiceas-db';

  // Only use Wrangler if explicitly requested
  if (process.env.USE_WRANGLER === 'true') {
    return drizzle(new WranglerD1Client(databaseName) as unknown as D1Database, { schema });
  }

  if (!accountId || !databaseId || !token || token === 'your_d1_api_token_here') {
    throw new Error(
      'CLOUDFLARE_D1_TOKEN is not set. Generate one at:\n' +
      'https://dash.cloudflare.com/profile/api-tokens'
    );
  }

  return drizzle(new D1HttpClient(accountId, databaseId, token) as unknown as D1Database, { schema });
}

/**
 * Returns the R2 bucket binding.
 * Only available on Cloudflare; throws a clear error in local dev.
 */
export function getR2(): R2Bucket {
  try {
    const { env } = getCloudflareContext();
    const r2 = (env as any)?.R2;
    if (r2) return r2 as R2Bucket;
  } catch {
    // fall through
  }
  throw new Error(
    'R2 binding is only available on Cloudflare. Image uploads require a Cloudflare deployment.'
  );
}
