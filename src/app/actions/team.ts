"use server";

import { d1, d1run } from "@/lib/d1";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";
import { currentUser } from "@clerk/nextjs/server";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  teamGroup: string;
  imageUrl: string | null;
  displayOrder: number;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return d1<TeamMember>(`
    SELECT id, name, role,
           team_group    AS teamGroup,
           image_url     AS imageUrl,
           display_order AS displayOrder
    FROM team_members
    ORDER BY display_order ASC
  `);
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const rows = await d1<TeamMember>(
    `SELECT id, name, role,
            team_group    AS teamGroup,
            image_url     AS imageUrl,
            display_order AS displayOrder
     FROM team_members WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function createTeamMember(data: {
  name: string;
  role: string;
  teamGroup: string;
  imageUrl?: string;
}) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  const rows = await d1<{ maxOrder: number }>(
    `SELECT COALESCE(MAX(display_order), -1) AS maxOrder FROM team_members`
  );
  const maxOrder = rows[0]?.maxOrder ?? -1;

  const id = uuidv4();
  await d1run(
    `INSERT INTO team_members (id, name, role, team_group, image_url, display_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, data.name, data.role, data.teamGroup, data.imageUrl ?? null, maxOrder + 1, Date.now()]
  );

  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true, id };
}

export async function updateTeamMember(
  id: string,
  data: { name: string; role: string; teamGroup: string; imageUrl?: string; displayOrder?: number }
) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  await d1run(
    `UPDATE team_members
     SET name = ?, role = ?, team_group = ?,
         image_url = COALESCE(?, image_url),
         display_order = COALESCE(?, display_order)
     WHERE id = ?`,
    [data.name, data.role, data.teamGroup, data.imageUrl ?? null, data.displayOrder ?? null, id]
  );

  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTeamMember(id: string) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  await d1run(`DELETE FROM team_members WHERE id = ?`, [id]);

  revalidatePath("/admin/team");
  revalidatePath("/");
  return { success: true };
}
