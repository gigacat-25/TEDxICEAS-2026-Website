'use server';

import { d1, d1run } from "@/lib/d1";
import { auth, currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";
import { sendConfirmationEmail } from "@/lib/mail";

interface Ticket {
  id: string;
  userId: string;
  userEmail: string;
  ticketType: string;
  price: number;
  status: string;
  createdAt: number;
}

export async function getTicketPrices() {
  const rows = await d1<{ key: string; value: string }>(
    `SELECT key, value FROM settings WHERE key IN ('price_student', 'price_general')`
  );
  
  const prices = {
    student: 400,
    general: 500
  };

  rows.forEach(row => {
    if (row.key === 'price_student') prices.student = parseInt(row.value);
    if (row.key === 'price_general') prices.general = parseInt(row.value);
  });

  return prices;
}

export async function updateTicketPrices(student: number, general: number) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized");

  await d1run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('price_student', ?)`, [student.toString()]);
  await d1run(`INSERT OR REPLACE INTO settings (key, value) VALUES ('price_general', ?)`, [general.toString()]);

  revalidatePath("/admin/tickets");
  revalidatePath("/tickets");
  return { success: true };
}

export async function bookTicket(ticketType: string = "general") {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Unauthorized");

  const userEmail = user.emailAddresses[0].emailAddress;
  const userName = user.firstName || userEmail.split("@")[0];
  
  const prices = await getTicketPrices();
  const price = ticketType === "student" ? prices.student : prices.general;
  const ticketId = uuidv4();

  await d1run(
    `INSERT INTO tickets (id, user_id, user_email, ticket_type, price, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [ticketId, userId, userEmail, ticketType, price, "confirmed", Date.now()]
  );

  try {
    await sendConfirmationEmail(userEmail, userName, ticketId, ticketType, price);
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/tickets");

  return { id: ticketId, userId, userEmail, ticketType, price, status: "confirmed" };
}

export async function getUserTickets(): Promise<Ticket[]> {
  const { userId } = await auth();
  if (!userId) return [];

  return d1<Ticket>(
    `SELECT id,
            user_id     AS userId,
            user_email  AS userEmail,
            ticket_type AS ticketType,
            price, status,
            created_at  AS createdAt
     FROM tickets
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );
}

export async function getAllTickets(): Promise<Ticket[]> {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (!isAdmin(email)) throw new Error("Unauthorized - Admin only");

  return d1<Ticket>(`
    SELECT id,
           user_id     AS userId,
           user_email  AS userEmail,
           ticket_type AS ticketType,
           price, status,
           created_at  AS createdAt
    FROM tickets
    ORDER BY created_at DESC
  `);
}

export async function updateTicketStatus(ticketId: string, status: string) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized - Admin only");

  await d1run(`UPDATE tickets SET status = ? WHERE id = ?`, [status, ticketId]);

  revalidatePath("/admin/tickets");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTicket(ticketId: string) {
  const user = await currentUser();
  if (!isAdmin(user?.emailAddresses[0]?.emailAddress)) throw new Error("Unauthorized - Admin only");

  await d1run(`DELETE FROM tickets WHERE id = ?`, [ticketId]);

  revalidatePath("/admin/tickets");
  revalidatePath("/dashboard");
  return { success: true };
}
