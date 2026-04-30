import { getUserTickets, bookTicket } from "@/app/actions/tickets";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Calendar, MapPin, User } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const tickets = await getUserTickets();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar />
      <main className="pt-32 px-6 md:px-20 lg:px-40 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Welcome Header */}
          <header className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic">
              MY <span className="text-ted-red">DASHBOARD</span>
            </h1>
            <p className="text-white/60 text-lg font-light">
              Welcome back, {user.firstName || user.username}. Manage your attendance and tickets here.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Account Info */}
            <Card className="bg-white/5 border-white/10 text-white md:col-span-1">
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest text-ted-red font-bold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-[0.6rem] uppercase text-white/40 tracking-widest font-bold">Name</p>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] uppercase text-white/40 tracking-widest font-bold">Email</p>
                  <p className="font-medium truncate">{user.emailAddresses[0].emailAddress}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tickets Section */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Ticket className="w-6 h-6 text-ted-red" />
                My Tickets
              </h2>

              {tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket, index) => (
                    <Card key={`${ticket.id}-${index}`} className="bg-black border border-ted-red/30 overflow-hidden group hover:border-ted-red transition-colors">
                      <div className="flex">
                        <div className="bg-ted-red w-2 shrink-0" />
                        <CardContent className="p-6 flex-1 flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ted-red font-black italic">
                              TEDxICEAS 2026 Official Entry
                            </p>
                            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
                              {ticket.ticketType} PASS
                            </h3>
                            <div className="flex gap-4 pt-2 text-white/40 text-xs font-medium">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> April 17, 2026</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Bengaluru</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[0.6rem] uppercase font-bold tracking-widest border border-green-500/20">
                              {ticket.status}
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white/5 border-dashed border-white/20 p-12 text-center space-y-6">
                  <div className="space-y-2">
                    <p className="text-white/60 font-light">You don't have any tickets yet.</p>
                    <p className="text-sm text-white/40">Threads of Change is waiting for you.</p>
                  </div>
                  <form action={async () => {
                    "use server";
                    await bookTicket("General");
                  }}>
                    <button className="px-8 py-3 bg-white text-ted-red font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                      Book General Ticket Now
                    </button>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
