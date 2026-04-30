"use server";

import { getDb } from "@/db";
import { teamMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function createTeamMember(data: {
  name: string;
  role: string;
  teamGroup: string;
  imageUrl?: string;
}) {
  const db = getDb();
  const id = uuidv4();

  // Get current max order
  const allTeam = await db.select().from(teamMembers);
  const maxOrder = allTeam.reduce((max, s) => Math.max(max, s.displayOrder || 0), -1);

  await db.insert(teamMembers).values({
    id,
    name: data.name,
    role: data.role,
    teamGroup: data.teamGroup as any,
    imageUrl: data.imageUrl,
    displayOrder: maxOrder + 1,
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true, id };
}

export async function deleteTeamMember(id: string) {
  const db = getDb();
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  
  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true };
}

export async function getTeamMembers() {
  const db = getDb();
  return await db.select().from(teamMembers).orderBy(teamMembers.displayOrder);
}

export async function getTeamMemberById(id: string) {
  const db = getDb();
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
  return result[0] || null;
}

export async function updateTeamMember(id: string, data: {
  name: string;
  role: string;
  teamGroup: string;
  imageUrl?: string;
  displayOrder?: number;
}) {
  const db = getDb();
  await db.update(teamMembers).set({
    name: data.name,
    role: data.role,
    teamGroup: data.teamGroup as any,
    ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
    ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
  }).where(eq(teamMembers.id, id));

  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true };
}

