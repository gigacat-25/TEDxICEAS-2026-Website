require('dotenv').config();

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID;
const TOKEN = process.env.CLOUDFLARE_D1_TOKEN;

async function testTickets() {
  console.log("Testing Tickets CRUD...");
  
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  };

  const ticketId = `test-ticket-${Date.now()}`;
  
  try {
    // 1. Insert
    console.log("Inserting ticket...");
    const insertRes = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sql: "INSERT INTO tickets (id, user_id, user_email, ticket_type, price, status) VALUES (?, ?, ?, ?, ?, ?)",
        params: [ticketId, 'test-user', 'test@example.com', 'general', 500, 'confirmed']
      })
    });
    const insertJson = await insertRes.json();
    console.log("Insert result success:", insertJson.success);
    if (!insertJson.success) {
      console.log("Insert errors:", JSON.stringify(insertJson.errors, null, 2));
    }

    // 2. Select
    console.log("Selecting ticket...");
    const selectRes = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sql: "SELECT * FROM tickets WHERE id = ?",
        params: [ticketId]
      })
    });
    const selectJson = await selectRes.json();
    console.log("Select result count:", selectJson.result[0].results.length);

    // 3. Delete
    console.log("Deleting ticket...");
    const deleteRes = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sql: "DELETE FROM tickets WHERE id = ?",
        params: [ticketId]
      })
    });
    const deleteJson = await deleteRes.json();
    console.log("Delete result success:", deleteJson.success);

  } catch (err) {
    console.error("Error:", err.message);
  }
}

testTickets();

