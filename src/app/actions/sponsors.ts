"use server";

import { getDb } from "@/db";
import { sponsors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function createSponsor(data: {
  name: string;
  tier: string;
  logoUrl?: string;
  websiteUrl?: string;
}) {
  const db = getDb();
  const id = uuidv4();

  // Get current max order
  const allSponsors = await db.select().from(sponsors);
  const maxOrder = allSponsors.reduce((max, s) => Math.max(max, s.displayOrder || 0), -1);

  await db.insert(sponsors).values({
    id,
    name: data.name,
    tier: data.tier,
    logoUrl: data.logoUrl,
    websiteUrl: data.websiteUrl,
    displayOrder: maxOrder + 1,
  });

  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  return { success: true, id };
}

export async function deleteSponsor(id: string) {
  const db = getDb();
  await db.delete(sponsors).where(eq(sponsors.id, id));
  
  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  return { success: true };
}

export async function getSponsors() {
  const db = getDb();
  return await db.select().from(sponsors).orderBy(sponsors.displayOrder);
}

export async function getSponsorById(id: string) {
  const db = getDb();
  const result = await db.select().from(sponsors).where(eq(sponsors.id, id));
  return result[0] || null;
}

export async function updateSponsor(id: string, data: {
  name: string;
  tier: string;
  logoUrl?: string;
  websiteUrl?: string;
  displayOrder?: number;
}) {
  const db = getDb();
  await db.update(sponsors).set({
    name: data.name,
    tier: data.tier as any,
    websiteUrl: data.websiteUrl,
    ...(data.logoUrl ? { logoUrl: data.logoUrl } : {}),
    ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
  }).where(eq(sponsors.id, id));

  revalidatePath("/admin/sponsors");
  revalidatePath("/");
  return { success: true };
}

