'use server';

import { d1, d1run } from "@/lib/d1";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";
import { currentUser } from "@clerk/nextjs/server";

interface ScheduleItem {
  id: string;
  time: string;
  event: string;
  displayOrder: number;
}

export async function getSchedule(): Promise<ScheduleItem[]> {
  return d1<ScheduleItem>(`
    SELECT id, time, event,
           display_order AS displayOrder
    FROM schedule
    ORDER BY display_order ASC
  `);
}

export async function getScheduleById(id: string): Promise<ScheduleItem | null> {
  const rows = await d1<ScheduleItem>(
    `SELECT id, time, event,
            display_order AS displayOrder
     FROM schedule WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function addScheduleItem(data: {
  id?: string;
  time: string;
  event: string;
  displayOrder: number;
}) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  const id = data.id ?? uuidv4();
  await d1run(
    `INSERT INTO schedule (id, time, event, display_order, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [id, data.time, data.event, data.displayOrder, Date.now()]
  );

  revalidatePath("/admin/schedule");
  revalidatePath("/");
  return { success: true };
}

export async function updateScheduleItem(
  id: string,
  data: { time: string; event: string; displayOrder: number }
) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  await d1run(
    `UPDATE schedule SET time = ?, event = ?, display_order = ? WHERE id = ?`,
    [data.time, data.event, data.displayOrder, id]
  );

  revalidatePath("/admin/schedule");
  revalidatePath("/");
  return { success: true };
}

export async function deleteScheduleItem(id: string) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  await d1run(`DELETE FROM schedule WHERE id = ?`, [id]);

  revalidatePath("/admin/schedule");
  revalidatePath("/");
  return { success: true };
}
