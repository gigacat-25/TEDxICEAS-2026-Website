const { getDb } = require('../src/db');
const { speakers } = require('../src/db/schema');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Mocking Next.js env for local script
process.env.NODE_ENV = 'development';

async function testDrizzleInsert() {
  console.log("Testing Drizzle Insert...");
  const db = getDb();
  
  const id = uuidv4();
  try {
    console.log("Attempting insert via Drizzle...");
    await db.insert(speakers).values({
      id,
      name: "Drizzle Test Speaker",
      role: "Tester",
      bio: "Testing if Drizzle adds createdAt automatically."
    });
    console.log("Insert successful!");

    // Clean up
    console.log("Cleaning up...");
    const { eq } = require('drizzle-orm');
    await db.delete(speakers).where(eq(speakers.id, id));
    console.log("Cleanup successful!");
  } catch (err) {
    console.error("Drizzle Insert Failed:", err.message);
  }
}

testDrizzleInsert();
