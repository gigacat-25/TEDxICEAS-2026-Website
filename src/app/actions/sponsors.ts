"use server";

import { d1, d1run } from "@/lib/d1";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";
import { currentUser } from "@clerk/nextjs/server";

interface Sponsor {
  id: string;
  name: string;
  tier: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  displayOrder: number;
}

export async function getSponsors(): Promise<Sponsor[]> {
  return d1<Sponsor>(`
    SELECT id, name, tier,
           logo_url      AS logoUrl,
           website_url   AS websiteUrl,
           display_order AS displayOrder
    FROM sponsors
    ORDER BY display_order ASC
  `);
}

export async function getSponsorById(id: string): Promise<Sponsor | null> {
  const rows = await d1<Sponsor>(
    `SELECT id, name, tier,
            logo_url      AS logoUrl,
            website_url   AS websiteUrl,
            display_order AS displayOrder
     FROM sponsors WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function createSponsor(data: {
  name: string;
  tier: string;
  logoUrl?: string;
  websiteUrl?: string;
}) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  const rows = await d1<{ maxOrder: number }>(
    `SELECT COALESCE(MAX(display_order), -1) AS maxOrder FROM sponsors`
  );
  const maxOrder = rows[0]?.maxOrder ?? -1;

  const id = uuidv4();
  await d1run(
    `INSERT INTO sponsors (id, name, tier, logo_url, website_url, display_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, data.name, data.tier, data.logoUrl ?? null, data.websiteUrl ?? null, maxOrder + 1, Date.now()]
  );

  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
  revalidatePath("/");
  return { success: true, id };
}

export async function updateSponsor(
  id: string,
  data: { name: string; tier: string; logoUrl?: string; websiteUrl?: string; displayOrder?: number }
) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  await d1run(
    `UPDATE sponsors
     SET name = ?, tier = ?, website_url = ?,
         logo_url = COALESCE(?, logo_url),
         display_order = COALESCE(?, display_order)
     WHERE id = ?`,
    [data.name, data.tier, data.websiteUrl ?? null, data.logoUrl ?? null, data.displayOrder ?? null, id]
  );

  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSponsor(id: string) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  await d1run(`DELETE FROM sponsors WHERE id = ?`, [id]);

  revalidatePath("/admin/sponsors");
  revalidatePath("/sponsors");
  revalidatePath("/");
  return { success: true };
}
