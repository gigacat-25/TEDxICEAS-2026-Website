import { getAllTickets, getTicketPrices } from "@/app/actions/tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Mail, Clock, ShieldCheck } from "lucide-react";
import { TicketActions } from "./ticket-actions";
import { PriceEditor } from "./price-editor";

export default async function AdminTicketsPage() {
  let tickets: any[] = [];
  let error: string | null = null;
  let prices = { student: 400, general: 500 };

  try {
    tickets = await getAllTickets();
    prices = await getTicketPrices();
  } catch (e: any) {
    console.error("Failed to fetch data:", e);
    error = e.message || "Unknown error";
  }

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          Monitor and manage all event registrations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <PriceEditor initialPrices={prices} />
        
        <Card className="bg-black/40 border-white/10 flex flex-col justify-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-mono">{tickets.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-white/10 flex flex-col justify-center border-l-ted-red border-l-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-ted-red">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black font-mono">₹{tickets.reduce((acc, t) => acc + (t.price || 0), 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden text-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 uppercase text-[0.6rem] tracking-widest font-black text-white/40">
            <tr>
              <th className="px-6 py-4">Attendee</th>
              <th className="px-6 py-4">Ticket Type</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Booked On</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {error ? (
              <tr key="error-row">
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-ted-red font-bold uppercase tracking-widest text-xs">Database Connection Error</p>
                    <p className="text-white/40 text-[0.65rem] max-w-md mx-auto font-mono">{error}</p>
                    <p className="text-white/20 text-[0.6rem] mt-4 max-w-xs mx-auto italic">
                      Tip: Ensure CLOUDFLARE_D1_TOKEN in .env has D1:Edit permissions for this database.
                    </p>
                  </div>
                </td>
              </tr>
            ) : tickets.length > 0 ? (
              tickets.map((t, index) => (
                <tr key={`${t.id}-${index}`} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-tight">
                        {t.userEmail ? t.userEmail.split('@')[0] : 'Unknown'}
                      </span>
                      <span className="text-[0.6rem] text-white/40 flex items-center gap-1">
                        <Mail className="w-2 h-2" /> {t.userEmail || 'No Email'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <Ticket className="w-3 h-3 text-ted-red" />
                      {t.ticketType}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-ted-red">
                    ₹{t.price || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-widest ${
                      t.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                      t.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                      'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                    }`}>
                      <ShieldCheck className="w-2 h-2" /> {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/40 font-mono text-[0.65rem]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t.createdAt ? (
                        t.createdAt instanceof Date 
                          ? t.createdAt.toLocaleDateString() 
                          : new Date(t.createdAt).toLocaleDateString()
                      ) : 'Unknown Date'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TicketActions ticketId={t.id} initialStatus={t.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr key="empty-row">
                <td colSpan={6} className="px-6 py-20 text-center text-white/20 uppercase tracking-widest text-xs">
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
