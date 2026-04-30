import { getDb } from "@/db";
import { tickets } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";

export async function bookTicket(ticketType: string = "general") {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const userEmail = user.emailAddresses[0].emailAddress;
  const db = getDb();

  const newTicket = {
    id: uuidv4(),
    userId,
    userEmail,
    ticketType,
    status: "confirmed", // Simplification: auto-confirm for now
  };

  await db.insert(tickets).values(newTicket);
  
  revalidatePath("/dashboard");
  revalidatePath("/admin/tickets");
  
  return newTicket;
}

export async function getUserTickets() {
  const { userId } = await auth();
  if (!userId) return [];

  const db = getDb();
  return await db
    .select()
    .from(tickets)
    .where(eq(tickets.userId, userId))
    .orderBy(desc(tickets.createdAt));
}

export async function getAllTickets() {
  const { userId } = await auth();
  const user = await currentUser();
  const email = user?.emailAddresses[0].emailAddress;
  
  if (!isAdmin(email)) {
    throw new Error("Unauthorized - Admin only");
  }

  const db = getDb();
  return await db
    .select()
    .from(tickets)
    .orderBy(desc(tickets.createdAt));
}
