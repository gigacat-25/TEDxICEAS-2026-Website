const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
const token = process.env.CLOUDFLARE_D1_TOKEN;

async function query(sql, params = []) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.result[0];
}

async function testCrud() {
  try {
    console.log("Adding a test sponsor...");
    const id = "test-uuid-" + Date.now();
    await query("INSERT INTO sponsors (id, name, tier, display_order, created_at) VALUES (?, ?, ?, ?, ?)", [
      id, "Test Sponsor", "gold", 99, Math.floor(Date.now() / 1000)
    ]);
    console.log("Sponsor added successfully.");

    console.log("Verifying sponsor exists...");
    const selectResult = await query("SELECT * FROM sponsors WHERE id = ?", [id]);
    console.log("Select Result:", selectResult.results);

    if (selectResult.results.length > 0) {
      console.log("Deleting test sponsor...");
      await query("DELETE FROM sponsors WHERE id = ?", [id]);
      console.log("Sponsor deleted successfully.");
    } else {
      console.error("Sponsor not found after insert!");
    }
    
    console.log("CRUD test completed successfully!");
  } catch (error) {
    console.error("CRUD test failed:", error);
  }
}

testCrud();
