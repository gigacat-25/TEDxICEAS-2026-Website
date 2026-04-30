"use server";

import { d1, d1run } from "@/lib/d1";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";
import { currentUser } from "@clerk/nextjs/server";

interface Speaker {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
  displayOrder: number;
}

export async function getSpeakers(): Promise<Speaker[]> {
  return d1<Speaker>(`
    SELECT id, name, role, bio,
           image_url    AS imageUrl,
           display_order AS displayOrder
    FROM speakers
    ORDER BY display_order ASC
  `);
}

export async function getSpeakerById(id: string): Promise<Speaker | null> {
  const rows = await d1<Speaker>(
    `SELECT id, name, role, bio,
            image_url    AS imageUrl,
            display_order AS displayOrder
     FROM speakers WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function createSpeaker(data: {
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
}) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  const rows = await d1<{ maxOrder: number }>(
    `SELECT COALESCE(MAX(display_order), -1) AS maxOrder FROM speakers`
  );
  const maxOrder = rows[0]?.maxOrder ?? -1;

  const id = uuidv4();
  await d1run(
    `INSERT INTO speakers (id, name, role, bio, image_url, display_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, data.name, data.role, data.bio ?? null, data.imageUrl ?? null, maxOrder + 1, Date.now()]
  );

  revalidatePath("/admin/speakers");
  revalidatePath("/");
  return { success: true, id };
}

export async function updateSpeaker(
  id: string,
  data: { name: string; role: string; bio?: string; imageUrl?: string; displayOrder?: number }
) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  await d1run(
    `UPDATE speakers
     SET name = ?, role = ?, bio = ?,
         image_url = COALESCE(?, image_url),
         display_order = COALESCE(?, display_order)
     WHERE id = ?`,
    [data.name, data.role, data.bio ?? null, data.imageUrl ?? null, data.displayOrder ?? null, id]
  );

  revalidatePath("/admin/speakers");
  revalidatePath("/");
  return { success: true };
}

export async function deleteSpeaker(id: string) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  await d1run(`DELETE FROM speakers WHERE id = ?`, [id]);

  revalidatePath("/admin/speakers");
  revalidatePath("/");
  return { success: true };
}
