const { drizzle } = require('drizzle-orm/d1');
require('dotenv').config({ path: '.env' });

class D1HttpClient {
  constructor(accountId, databaseId, token) {
    this.accountId = accountId;
    this.databaseId = databaseId;
    this.token = token;
  }

  async query(sql, params = []) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(`D1 HTTP error: ${JSON.stringify(json.errors)}`);
    return json.result[0];
  }

  prepare(sql) {
    const self = this;
    const bindings = [];
    const stmt = {
      bind(...args) { bindings.push(...args); return stmt; },
      async all() {
        const r = await self.query(sql, bindings);
        return { results: (r.results || []), success: true, meta: r.meta || {} };
      },
    };
    return stmt;
  }
}

async function test() {
  const db = drizzle(new D1HttpClient(
    process.env.CLOUDFLARE_ACCOUNT_ID,
    process.env.CLOUDFLARE_DATABASE_ID,
    process.env.CLOUDFLARE_D1_TOKEN
  ));
  
  try {
    const result = await db.select().from({ name: 'tickets' }).all();
    console.log(result);
  } catch (e) {
    console.log("CAUGHT ERROR:", e.message);
  }
}
test();
