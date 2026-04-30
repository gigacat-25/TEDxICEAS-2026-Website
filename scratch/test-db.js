const { getDb } = require('./src/db/index');
require('dotenv').config();

async function testDb() {
  try {
    console.log("Testing D1 connection...");
    const db = getDb();
    const result = await db.execute('SELECT 1 as connected');
    console.log("Result:", result);
    console.log("D1 Connection Successful!");
  } catch (error) {
    console.error("D1 Connection Failed:", error);
  }
}

testDb();
