import { UserButton, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Users, Presentation, Handshake, LayoutDashboard, Ticket } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const email = user?.emailAddresses[0].emailAddress;

  if (!isAdmin(email)) {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-[#f0f0f0]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/50 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="font-black text-2xl tracking-tighter">
            TEDx<span className="text-ted-red">ICEAS</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/tickets" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Ticket className="w-5 h-5" />
            <span>Tickets</span>
          </Link>
          <Link href="/admin/speakers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Presentation className="w-5 h-5" />
            <span>Speakers</span>
          </Link>
          <Link href="/admin/team" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Users className="w-5 h-5" />
            <span>Team</span>
          </Link>
          <Link href="/admin/sponsors" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Handshake className="w-5 h-5" />
            <span>Sponsors</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-black/50 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Admin Portal</h2>
            <span className="bg-ted-red/10 text-ted-red text-[0.6rem] px-2 py-0.5 rounded border border-ted-red/20 font-bold tracking-widest uppercase">
              Authenticated
            </span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
