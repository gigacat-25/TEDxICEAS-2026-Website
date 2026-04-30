const fs = require('fs');
const { execSync } = require('child_process');
require('dotenv').config({ path: '.env' });

const databaseName = process.env.CLOUDFLARE_DATABASE_NAME || 'tedxiceas-db';

async function main() {
  const sqlFile = 'drizzle/0001_b_missing_tickets.sql';
  console.log(`Executing migration from ${sqlFile} remotely via wrangler...`);
  
  try {
    // We use --file instead of --command for migrations to handle multi-line SQL
    const cmd = `npx wrangler d1 execute ${databaseName} --remote --file ${sqlFile}`;
    console.log(`Running: ${cmd}`);
    
    // Using stdio: inherit to see the live progress/output from wrangler
    execSync(cmd, { stdio: 'inherit' });
    
    console.log('\n\x1b[32mSuccessfully executed migration on the remote database.\x1b[0m');
  } catch (e) {
    console.error('\n\x1b[31mFailed to execute migration via wrangler.\x1b[0m');
    console.error('Make sure you are logged in: npx wrangler login');
    process.exit(1);
  }
}

main();
