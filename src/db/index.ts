import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// Note: If deploying to Vercel, you cannot use native D1 bindings without a REST proxy.
// Assuming deployment to Cloudflare Pages where `env.DB` is available.
// For local Next.js dev, you might need a wrapper or run via `wrangler pages dev next dev`.

export function getDb(envBinding: any) {
  // Pass the D1 binding (e.g., process.env.DB or getRequestContext().env.DB)
  return drizzle(envBinding, { schema });
}
