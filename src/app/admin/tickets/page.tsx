import { getAllTickets } from "@/app/actions/tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Mail, Clock, ShieldCheck } from "lucide-react";

export default async function AdminTicketsPage() {
  const tickets = await getAllTickets();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage all event registrations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-black/40 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden text-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 uppercase text-[0.6rem] tracking-widest font-black text-white/40">
            <tr>
              <th className="px-6 py-4">Attendee</th>
              <th className="px-6 py-4">Ticket Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Booked On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tickets.length > 0 ? (
              tickets.map((t, index) => (
                <tr key={`${t.id}-${index}`} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-tight">{t.userEmail.split('@')[0]}</span>
                      <span className="text-[0.6rem] text-white/40 flex items-center gap-1">
                        <Mail className="w-2 h-2" /> {t.userEmail}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <Ticket className="w-3 h-3 text-ted-red" />
                      {t.ticketType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 text-[0.6rem] font-bold uppercase tracking-widest">
                      <ShieldCheck className="w-2 h-2" /> {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/40 font-mono text-[0.65rem]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t.createdAt.toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-white/20 uppercase tracking-widest text-xs">
                  No tickets found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
