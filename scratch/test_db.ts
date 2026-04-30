import { getDb } from '../src/db/index';
import { speakers } from '../src/db/schema';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const db = getDb();
    const allSpeakers = await db.select().from(speakers);
    console.log('Successfully fetched speakers:', allSpeakers.length);
    console.log(allSpeakers);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

test();
