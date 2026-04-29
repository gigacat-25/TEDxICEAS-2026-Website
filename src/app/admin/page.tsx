import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Presentation, Handshake } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the TEDxICEAS Admin Portal. Manage your content here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/speakers">
          <Card className="hover:bg-white/5 transition-colors cursor-pointer bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Speakers
              </CardTitle>
              <Presentation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Manage</div>
              <p className="text-xs text-muted-foreground mt-1">
                Add, edit, or remove speakers
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/team">
          <Card className="hover:bg-white/5 transition-colors cursor-pointer bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Team Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Manage</div>
              <p className="text-xs text-muted-foreground mt-1">
                Add, edit, or remove team members
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/sponsors">
          <Card className="hover:bg-white/5 transition-colors cursor-pointer bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sponsors
              </CardTitle>
              <Handshake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Manage</div>
              <p className="text-xs text-muted-foreground mt-1">
                Add, edit, or remove sponsors
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
