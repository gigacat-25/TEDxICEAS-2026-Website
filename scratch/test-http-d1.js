const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
const token = process.env.CLOUDFLARE_D1_TOKEN;

async function testHttpD1() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  console.log("Testing D1 HTTP API...");
  console.log("URL:", url);
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        sql: 'SELECT 1 as connected', 
        params: [] 
      }),
    });

    const json = await res.json();
    console.log("Response Status:", res.status);
    console.log("Response JSON:", JSON.stringify(json, null, 2));

    if (json.success) {
      console.log("D1 HTTP Connection Successful!");
    } else {
      console.error("D1 HTTP Connection Failed!");
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

testHttpD1();
