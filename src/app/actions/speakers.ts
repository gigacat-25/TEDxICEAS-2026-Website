"use server";

import { getDb } from "@/db";
import { speakers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function createSpeaker(data: {
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
}) {
  const db = getDb();
  const id = uuidv4();

  // Get the current max display order
  const allSpeakers = await db.select().from(speakers);
  const maxOrder = allSpeakers.reduce((max, s) => Math.max(max, s.displayOrder || 0), -1);

  await db.insert(speakers).values({
    id,
    name: data.name,
    role: data.role,
    bio: data.bio,
    imageUrl: data.imageUrl,
    displayOrder: maxOrder + 1,
  });

  revalidatePath("/admin/speakers");
  revalidatePath("/"); // Revalidate home page where speakers are shown
  return { success: true, id };
}

export async function deleteSpeaker(id: string) {
  const db = getDb();
  await db.delete(speakers).where(eq(speakers.id, id));
  
  revalidatePath("/admin/speakers");
  revalidatePath("/");
  return { success: true };
}

export async function getSpeakers() {
  const db = getDb();
  return await db.select().from(speakers).orderBy(speakers.displayOrder);
}

export async function getSpeakerById(id: string) {
  const db = getDb();
  const result = await db.select().from(speakers).where(eq(speakers.id, id));
  return result[0] || null;
}

export async function updateSpeaker(id: string, data: {
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  displayOrder?: number;
}) {
  const db = getDb();
  await db.update(speakers).set({
    name: data.name,
    role: data.role,
    bio: data.bio,
    ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
    ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
  }).where(eq(speakers.id, id));

  revalidatePath("/admin/speakers");
  revalidatePath("/");
  return { success: true };
}

